var SpaceShip = {
  x: 0,  // position in (px)
  y: 0,  // position in (px)
  vx: 0, // velocity in (px/s)
  vy: 0, // velocity in (px/s)
  ax: 0, // acceleration in (px/s^2)
  ay: 0, // acceleration in (px/S^2)
  theta: 0,  // orientation in (rad)
  length: 0, // in (px)
  burn_force: 0, // acceleration to apply while burning in (px/s^2)
  b_burning: false,
  targets: [], // represents target predictions (xt, yt, t)
};

SpaceShip.SetupEventListeners = function() {
  window.onkeypress = function(e) {
    var key = e.key;
    Keyboard.SetKey(key, true);
  };

  window.onkeyup = function(e) {
    var key = e.key;
    Keyboard.SetKey(key, false);
  };
};

SpaceShip.Draw = function(ctx, color) {
  // draw the SpaceShip as a line
  // representing its direction
  var len = SpaceShip.length;
  var dir = SpaceShip.Direction();

  var x0 = SpaceShip.x;
  var y0 = SpaceShip.y;

  var x1 = x0 + len * dir.x;
  var y1 = y0 + len * dir.y;

  ctx.save();

  // stroke the ship
  GraphicsUtils.StrokeLine(ctx, color, 4, x0, y0, x1, y1);

  // stroke the flame
  if(SpaceShip.b_burning)
    GraphicsUtils.StrokeLine(ctx, '#ff0000', 4, x0, y0, x0, y0);

  // stroke targets prediction
  if(SpaceShip.targets.length < 1)
    SpaceShip.targets = SpaceShip.TargetPrediction(10, .1);

  var targets = SpaceShip.targets;

  for(var i = 0; i < targets.length; ++i) {
    var x = targets[i].x;
    var y = targets[i].y;
    GraphicsUtils.StrokeCircle(ctx, '#00ff00', 1, 1, x, y);
  }

  // // for debug purpose ----
  // // draw velocity vector
  // var vx = x0 + SpaceShip.vx;
  // var vy = y0 + SpaceShip.vy;
  // GraphicsUtils.StrokeLine(ctx, '#00ff00', 1, x0, y0, vx, vy);
  //
  // // draw acceleration vector
  // var ax = x0 + SpaceShip.ax;
  // var ay = y0 + SpaceShip.ay;
  // GraphicsUtils.StrokeLine(ctx, '#0000ff', 1, x0, y0, ax, ay);
  // // end debug ------------

  ctx.restore();
};

SpaceShip.DrawAsTriangle = function(ctx, color) {
  // draw the SpaceShip as a triangle
  var orientation = SpaceShip.theta + GraphicsUtils.pi_over_2;

  var x0 = SpaceShip.x;
  var y0 = SpaceShip.y;

  ctx.save();

  ctx.save();
  ctx.translate(x0, y0);
  ctx.rotate(orientation);

  var T = GraphicsUtils.Triangle(ctx, 16);

  ctx.restore();

  // draw the ship
  ctx.fillStyle = color;
  ctx.fill();

  if(SpaceShip.b_burning) {
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(orientation);

    ctx.beginPath();
    ctx.rect(-T.side >> 2, T.height >> 1, T.side >> 1, T.side >> 2);
    ctx.closePath();

    ctx.restore();

    // draw the flame
    ctx.fillStyle = '#ff0000';
    ctx.fill();
  }

  ctx.restore();
};

SpaceShip.Update = function(dt) {
  // dt: delta time in (s)
  var Keymap = Keyboard.Keymap;

  // update the orientation
  var b_rot_left  = Keyboard.CheckKeymap(Keymap.rotate_left);
  var b_rot_right = Keyboard.CheckKeymap(Keymap.rotate_right);

  if(b_rot_left ^ b_rot_right) {
    var step = GraphicsUtils.circle_step;
    var sign = b_rot_left ? -1 : 1;
    SpaceShip.theta += sign * step;
  }

  // check if the SpaceShip is burning
  var b_frwd = Keyboard.CheckKeymap(Keymap.forward);
  var b_bkwd = Keyboard.CheckKeymap(Keymap.backward);

  if(b_frwd ^ b_bkwd) {
    var dir = SpaceShip.BurnDirection();

    if(b_frwd) {
      SpaceShip.ax =  dir.x;
      SpaceShip.ay =  dir.y;
    } else {
      SpaceShip.ax = -dir.x;
      SpaceShip.ay = -dir.y;
    }

    SpaceShip.b_burning = true;
  } else {
    SpaceShip.ax = 0;
    SpaceShip.ay = 0;
    SpaceShip.b_burning = false;
  }

  // update velocity and position
  var x = SpaceShip.x;
  var y = SpaceShip.y;

  var attr = BlackHole.AttractionFrom(x, y);

  var ax = SpaceShip.ax + attr.x;
  var ay = SpaceShip.ay + attr.y;

  SpaceShip.vx += ax * dt;
  SpaceShip.vy += ay * dt;

  SpaceShip.x += SpaceShip.vx * dt;
  SpaceShip.y += SpaceShip.vy * dt;

  for(var i = 0; i < SpaceShip.targets.length; ++i) {
    var target = SpaceShip.targets[i];
    var vx = ax * target.t + SpaceShip.vx;
    var vy = ay * target.t + SpaceShip.vy;
    target.x = .5 * ax * target.t * target.t + vx * target.t + SpaceShip.x;
    target.y = .5 * ay * target.t * target.t + vy * target.t + SpaceShip.y;
  }

  if(attr.b_collision) {
    console.log('collision detected : you died!');
  }
};

SpaceShip.Direction = function() {
  var theta = SpaceShip.theta;
  var cos_theta = Math.cos(theta);
  var sin_theta = Math.sin(theta);
  return {x: cos_theta, y: sin_theta};
};

SpaceShip.BurnDirection = function() {
  var dir = SpaceShip.Direction();
  dir.x *= SpaceShip.burn_force;
  dir.y *= SpaceShip.burn_force;
  return dir;
};

SpaceShip.TargetPrediction = function(t_max, step) {
  // t_max: max time in (s)
  // step: time step in (s)
  var vx0 = SpaceShip.vx;
  var vy0 = SpaceShip.vy;
  var x0  = SpaceShip.x;
  var y0  = SpaceShip.y;

  var attr = BlackHole.AttractionFrom(x0, y0);
  var ax  = SpaceShip.ax + attr.x;
  var ay  = SpaceShip.ay + attr.y;

  var targets = [];

  for(var t = step; t < t_max; t += step) {
    var vx = ax * t + vx0;
    var vy = ay * t + vy0;
    var x = .5 * ax * t * t + vx * t + x0;
    var y = .5 * ay * t * t + vy * t + y0;
    targets.push({x: x, y: y, t: t});
  }

  return targets;
};
