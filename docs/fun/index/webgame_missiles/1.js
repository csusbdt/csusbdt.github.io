// level 1
window.addEventListener('load', function() {
  a_canvas.addEventListener('click', function(e) {
    if (Missile.count > 0) {
      a.add(new Missile(e.y));
      --Missile.count;
    }
  });

  function Missile(y) {
    this.x     = -Missile.w    ;
    this.y     = y             ;
    this.w     = Missile.w     ;
    this.h     = Missile.h     ;
    this.speed = Missile.speed ;
    this.hits  = 0;
  }

  Missile.w       = 70  ;
  Missile.h       = 20  ;
  Missile.speed   = 200 ;
  Missile.count   = 10  ;
  Missile.targets = []  ;

  Missile.addTarget = function(o) {
    Missile.targets.push(o);
  };

  Missile.removeTarget = function(o) {
    Missile.targets = Missile.targets.filter(function(x) { return x !== o; });
  };

  Missile.prototype.draw = function(dt) {
    this.x += this.speed * dt;
    if (this.x > a_canvas.width) {
      a.remove(this);
    }
    const targets = Missile.targets.slice(0);
    for (let i = 0; i < targets.length; ++i) {
      let o = targets[i];
      if (
        o.x < this.x + this.w &&
        o.x + o.w > this.x    &&
        o.y < this.y + this.h &&
        o.y + o.h > this.y
      ) {
        o.hit(this);
        ++this.hits;
      }
    }
    a.ctx.fillStyle = '#000000';
    if (this.hits > 0) a.ctx.fillStyle = '#aaaaaa';
    a.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  const ai = {};

  ai.draw = function(dt) {
    a.ctx.fillStyle = "#000000"    ;
    a.ctx.font      = "24px serif" ;
    a.ctx.fillText("Level 1", 8, 25);
    a.ctx.fillText("Objective: get to 20 missiles", 8, 50);
    a.ctx.fillText("Missiles: " + Missile.count, 8, 75);
  };
    
  a.add(ai);

  const boxInterval = setInterval(function() {
    new Box();
  }, 3000);

  function Box() {
    this.x        = 100 + Math.random() * (a_canvas.width - 100 - 30);
    this.y        = 0 + Math.random() * (a_canvas.height - 200);
    this.dx       = 0;
    this.dy       = 100;
    this.w        = 30;
    this.h        = 30;
    this.visible  = true;
    a.add(this);
    Missile.addTarget(this);
  }

  Box.toggleVisibleRate = .08;

  Box.prototype.hit = function(o) {
    // stop moving and start blinking
    this.dx                  = 0;
    this.dy                  = 0;
    this.timeToDie           = a.t + 1.6;
    this.visible             = false;
    this.timeToToggleVisible = a.t + Box.toggleVisibleRate;
    Missile.removeTarget(this);
    if (o.hits === 0) {
      this.text = "+2";
      Missile.count += 2;
    } else {
      this.text = "+4";
      Missile.count += 4;
    }
  };
    
  Box.prototype.draw = function(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.y > a_canvas.height) {
      a.remove(this);
      Missile.removeTarget(this);
      return;
    }

    if (this.hasOwnProperty('timeToDie')) {
      if (this.timeToDie <= a.t) {
        console.assert(!Missile.targets.includes(this));
        a.remove(this);
        return;
      }
      if (this.timeToToggleVisible <= a.t) {
        this.timeToToggleVisible = a.t + Box.toggleVisibleRate;
        this.visible = !this.visible;
      }
    } 

    if (this.text) {
      a.ctx.fillStyle = 'red';
      a.ctx.font      = '24px serif';
      a.ctx.fillText(this.text, this.x, this.y);
    }

    if (this.visible) {
      a.ctx.fillStyle = 'green';
      a.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  };

/*
  function SpeedBoostPowerup() {
  }

  function Target(payload, x, y, dx, dy) {
    this.x        = 100 + Math.random() * (a_canvas.width - 100);
    this.y        = 0 + Math.random() * (a_canvas.height - 200);
    this.dx       = 0;
    this.dy       = 100;
    this.w        = 30;
    this.h        = 30;
    this.visible  = true;
    a.add(this);
    a.Missile.addTarget(this);
  }

  Box.toggleVisibleRate = .08;

  Box.prototype.hit = function() {
    // stop moving and start blinking
    this.dx                  = 0;
    this.dy                  = 0;
    this.timeToDie           = a.t + 1.6;
    this.visible             = false;
    this.timeToToggleVisible = a.t + Box.toggleVisibleRate;
    a.Missile.removeTarget(this);
  };
    
  Box.prototype.draw = function(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.y > a_canvas.height) {
      a.remove(this);
      a.Missile.removeTarget(this);
      return;
    }

    if (this.hasOwnProperty('timeToDie')) {
      if (this.timeToDie <= a.t) {
        console.assert(!a.Missile.targets.includes(this));
        a.remove(this);
        return;
      }
      if (this.timeToToggleVisible <= a.t) {
        this.timeToToggleVisible = a.t + Box.toggleVisibleRate;
        this.visible = !this.visible;
      }
      a.ctx.fillStyle = 'red';
      a.ctx.font      = '24px serif';
      a.ctx.fillText("+2", this.x, this.y);
    } 

    if (this.visible) {
      a.ctx.fillStyle = 'green';
      a.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  };
*/
});

