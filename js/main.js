var Game = {
  canvas:  null,
  context: null,
  buffer:  null,
  buffer_context: null,
  t_start:     0,
  t_then:      0,
  fps_then:    0,
  fps_count:   0,
  fps_current: 0,
  b_initialized: false,
  b_show_help: false
};

Game.Initialize = function() {
  Game.canvas = document.createElement('canvas');
  Game.canvas.setAttribute('id', 'main');
  Game.canvas.width  = 800;
  Game.canvas.height = 600;
  Game.context = Game.canvas.getContext('2d');
  document.body.appendChild(Game.canvas);

  Game.buffer = document.createElement('canvas');
  Game.buffer.width   = Game.canvas.width;
  Game.buffer.height  = Game.canvas.height;
  Game.buffer_context = Game.buffer.getContext('2d');

  Game.b_initialized = true;

  BlackHole.x = Game.canvas.width  >> 1;
  BlackHole.y = Game.canvas.height >> 1;
  BlackHole.radius = 64;
  BlackHole.force  = 1048576; // 2^20

  SpaceShip.x = 64;
  SpaceShip.y = 64;
  SpaceShip.length = 16;
  SpaceShip.burn_force = 256; // 2^8

  SpaceShip.SetupEventListeners();
};

Game.Update = function(dt) {
  // dt: delta time in (ms)
  var dt_s = dt / 1000; // delta time in (s)
  SpaceShip.Update(dt_s);

  Game.b_show_help = Keyboard.CheckKeymap(Keyboard.Keymap.help);
};

Game.Draw = function() {
  var buff_img = Game.buffer;
  var buff_ctx = Game.buffer_context;

  var w = Game.canvas.width;
  var h = Game.canvas.height;

  buff_ctx.fillStyle = '#313131';
  buff_ctx.fillRect(0, 0, w, h);

  BlackHole.Draw(buff_ctx, '#000000');
  SpaceShip.Draw(buff_ctx, '#ff6600');
  // SpaceShip.DrawAsTriangle(buff_ctx, '#ff6600');

  buff_ctx.font = 'small-caps 22px Arial';
  buff_ctx.fillStyle = '#f1f1f1';
  buff_ctx.fillText('fps : ' + Game.GetFPS(), 8, 22);

  buff_ctx.font = '22px Arial';
  buff_ctx.fillText('Press \'' + Keyboard.Keymap.help.toString() + '\' for help', 8, 22 * 2);

  if(Game.b_show_help) {
    var help_w = w >> 1;
    var help_h = h >> 1;
    var help_x_off = (w >> 1) - (help_w >> 1);
    var help_y_off = (h >> 1) - (help_h >> 1);

    buff_ctx.fillStyle = '#616161';
    buff_ctx.fillRect(help_x_off, help_y_off, help_w, help_h);

    buff_ctx.font = '22px Arial';
    buff_ctx.fillStyle = '#f1f1f1';
    buff_ctx.fillText('Burn forward : ' + Keyboard.Keymap.forward.toString(), help_x_off + 8, help_y_off + 22);
    buff_ctx.fillText('Burn backward : ' + Keyboard.Keymap.backward.toString(), help_x_off + 8, help_y_off + 22 * 2);
    buff_ctx.fillText('Botate left : ' + Keyboard.Keymap.rotate_left.toString(), help_x_off + 8, help_y_off + 22 * 3);
    buff_ctx.fillText('Botate right : ' + Keyboard.Keymap.rotate_right.toString(), help_x_off + 8, help_y_off + 22 * 4);
  }

  Game.context.drawImage(buff_img, 0, 0, w, h);
};

Game.Run = function() {
  var dt = Game.GetDeltaTime();
  Game.Update(dt);
  Game.Draw();
  window.requestAnimationFrame(Game.Run);
};

Game.Start = function() {
  if(!Game.b_initialized)
    Game.Initialize();

  Game.t_start  = Game.GetTimeMilli();
  Game.t_then   = Game.t_start;
  Game.fps_then = Game.t_then;
  Game.fps_count   = 0;
  Game.fps_current = 0;

  Game.Run();
};

Game.GetTimeMilli = function() {
  return (new Date()).getTime();
};

Game.GetDeltaTime = function() {
  // returns delta time in (ms)
  var now = Game.GetTimeMilli();
  var dt  = now - Game.t_then;
  Game.t_then = now;
  return dt;
};

Game.GetFPS = function() {
  // returns current fps
  var now = Game.GetTimeMilli();
  var dt  = now - Game.fps_then;

  if(dt < 1000) {
    ++Game.fps_count;
    return Game.fps_current;
  }

  Game.fps_then    = now;
  Game.fps_current = Game.fps_count;
  Game.fps_count   = 0;

  return Game.fps_current;
};

window.onload = function(e) {
  e.preventDefault();

  Game.Initialize();
  Game.Start();
};
