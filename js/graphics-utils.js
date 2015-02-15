var GraphicsUtils = {
  two_pi: 2 * Math.PI,
  pi_over_2: .5 * Math.PI,
  circle_step: Math.PI / 36,
  triangle_height_coeff: .5 * Math.sqrt(3)
};

GraphicsUtils.StrokeLine = function(ctx, color, width, x0, y0, x1, y1) {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.closePath();

  ctx.lineWidth   = width;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.restore();
};

GraphicsUtils.FillCircle = function(ctx, color, radius, x, y) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, GraphicsUtils.two_pi);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
};

GraphicsUtils.StrokeCircle = function(ctx, color, width, radius, x, y) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, GraphicsUtils.two_pi);
  ctx.closePath();

  ctx.lineWidth   = width;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.restore();
};

GraphicsUtils.Triangle = function(ctx, side) {
  // sets an equilateral triangle path in
  // 2d canvas rendering context
  // returns triangle side and height
  var a = side;
  var h = GraphicsUtils.triangle_height_coeff * a; // heigth

  var a_2 = a >> 1; // side over 2
  var h_2 = h >> 1; // height over 2

  ctx.beginPath();
  ctx.moveTo(   0,-h_2);
  ctx.lineTo(-a_2, h_2);
  ctx.lineTo( a_2, h_2);
  ctx.lineTo(   0,-h_2);
  ctx.closePath();

  return {side: side, height: h};
};
