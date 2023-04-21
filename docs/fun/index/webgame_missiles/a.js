(function() {
  window.a = {}; // application object

  a.ctx     = a_canvas.getContext('2d', { alpha: false });
  a.t       = 0;  // global game time (seconds into game)
  a.objs    = []; 

  a.add = function(o) {
    a.objs.push(o); 
  };

  a.remove = function(o) {
    o.remove = true;
  };

  function loop(millis) {
    const dt = millis / 1000 - a.t;
    a.t = millis / 1000;

    //ctx.clearRect(0, 0, a_canvas.width, a_canvas.height);
    a.ctx.fillStyle = 'white';
    a.ctx.fillRect(0, 0, a_canvas.width, a_canvas.height);

    for (let i = 0; i < a.objs.length; ++i) { a.objs[i].draw(dt); }
    a.objs = a.objs.filter(function(o) { return !o.remove; });

    requestAnimationFrame(loop);
  }

  // start loop
  requestAnimationFrame(function(millis) { 
    a.t = millis / 1000; 
    requestAnimationFrame(loop);
  });

  //a.Text = function(text, x, y, color, font) {
  //  this.text  = text  || ''           ;
  //  this.x     = x     || 0            ;
  //  this.y     = y     || 0            ;
  //  this.color = color || "#000000"    ;
  //  this.font  = font  || "24px serif" ;
  //};

  //a.Text.prototype.draw = function(dt) {
  //  a.ctx.fillStyle = this.color;
  //  a.ctx.font      = this.font;
  //  a.ctx.fillText(this.text, this.x, this.y);
  //};

})();

