var BlackHole = {
  x: 0, // position in (px)
  y: 0, // position in (px)
  radius: 0, // in (px)
  force:  0, // attraction force in (px/s^2)
};

BlackHole.Draw = function(ctx, color) {
  var x = BlackHole.x;
  var y = BlackHole.y;
  var radius = BlackHole.radius;
  GraphicsUtils.FillCircle(ctx, color, radius, x, y);
};

BlackHole.DirectionFrom = function(x, y) {
  // returns non-normalized vector that represents direction
  // from coordinates (x, y) to BlackHole object
  // length is the distance between coordinates (x, y) and BlackHole
  var dx = BlackHole.x - x;
  var dy = BlackHole.y - y;
  return {x: dx, y: dy};
};

BlackHole.AttractionFrom = function(x, y) {
  // returns vector that represents the attraction force
  // from coordinates (x, y) to BlackHole object
  // length is the attraction value
  // b_collision is a boolean that defines if
  // the coordinates are in BlackHole (i.e. collision)
  var dir    = BlackHole.DirectionFrom(x, y);
  var sq_len = dir.x * dir.x + dir.y * dir.y;

  var sq_r = BlackHole.radius * BlackHole.radius;

  if(sq_len < sq_r)
    return {x: 0, y: 0, b_collision: true};

  var len = Math.sqrt(sq_len);
  var dx  = dir.x / len;
  var dy  = dir.y / len;

  var attr = BlackHole.force / sq_len;

  return {x: dx * attr, y: dy * attr, b_collision: false};
};
