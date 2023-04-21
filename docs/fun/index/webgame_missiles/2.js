// level 2
window.addEventListener('load', function() {
  let ignoreKey = false;
  document.addEventListener('keydown', e => {
    if (e.key !== ' ' || ignoreKey) return;
    ignoreKey = true;
    setTimeout(() => ignoreKey = false, 50);
    if (Missile.count > 0) {
      a.add(new Missile());
      --Missile.count;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      Missile.setY(Missile.y - 12);
    } else if (e.key === 'ArrowDown') {
      Missile.setY(Missile.y + 12);
    }
  });

  a_canvas.addEventListener('click', function(e) {
    Missile.setY(e.y);
    if (Missile.count > 0) {
      a.add(new Missile());
      --Missile.count;
    }
  });

  function Missile() {
    this.x           = -Missile.w    ;
    this.y           = Missile.y     ;
    this.w           = Missile.w     ;
    this.h           = Missile.h     ;
    this.speed       = Missile.speed ;
    this.powerupHits = 0             ;
  }

  Missile.w         = 70                  ;
  Missile.h         = 20                  ;
  Missile.baseSpeed = 200                 ;
  Missile.speed     = Missile.baseSpeed   ;
  Missile.count     = 10                  ;
  Missile.targets   = []                  ;
  Missile.y         = a_canvas.height / 2 ;

  Missile.setY = function(y) {
    if (y < 0) {
      Missile.y = 0;
    } else if (y > a_canvas.height - Missile.h) {
      Missile.y = a_canvas.height - Missile.h;
    } else {
      Missile.y = y;
    }
  };

  Missile.draw = function() {
    a.ctx.fillStyle = 'black';
    a.ctx.fillRect(0, Missile.y, 8, Missile.h);
  };

  a.add(Missile);

  Missile.addTarget = function(o) {
    Missile.targets.push(o);
  };

  Missile.removeTarget = function(o) {
    Missile.targets = Missile.targets.filter(function(x) { return x !== o; });
  };

  Missile.powerup = function() {
    Missile.speed = 800;
    if (Missile.powerupTimeout) {
      clearTimeout(Missile.powerupTimeout);
    }
    Missile.powerupTimeout = setTimeout(function() {
      Missile.speed = Missile.baseSpeed;
    }, Powerup.duration * 1000);
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
        o.x < this.x + this.w  &&
        o.x + o.w > this.x     &&
        o.y < this.y + this.h  &&
        o.y + o.h > this.y
      ) {
        o.hit(this);
      }
    }
    a.ctx.fillStyle = '#000000';
    if (this.powerupHits > 0) a.ctx.fillStyle = '#aaaaaa';
    a.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  const hud = {};

  hud.draw = function(dt) {
    a.ctx.fillStyle = "#000000"                            ;
    a.ctx.font      = "24px serif"                         ;
    a.ctx.fillText("Level 1", 8, 25)                       ;
    a.ctx.fillText("Objective: get to 20 missiles", 8, 50) ;
    a.ctx.fillText("Missiles: " + Missile.count, 8, 75)    ;
  };
    
  a.add(hud);

  const boxInterval = setInterval(function() {
    a.add(new Box());
  }, 3000);

  function Box() {
    this.x        = a_canvas.width * 2 / 3 + Math.random() * (a_canvas.width * 1 / 3 - 30);
    this.y        = 0 + Math.random() * (a_canvas.height - 200);
    this.dx       = 0       ;
    this.dy       = 100     ;
    this.w        = 30      ;
    this.h        = 30      ;
    this.visible  = true    ;
    Missile.addTarget(this) ;
  }

  Box.toggleVisibleRate = .08;

  Box.prototype.hit = function(o) {
    // stop moving and start blinking
    this.dx                  = 0;
    this.dy                  = 0;
    Missile.removeTarget(this);
    if (o.powerupHits === 0) {
      o.powerupHits = 1;
      this.text = "+3";
      Missile.count += 3;
    } else {
      ++o.powerupHits;
      this.text = "+6";
      Missile.count += 6;
    }
    const box = this;
    const interval = setInterval(function() {
      box.visible = !box.visible;
    }, 80);
    setTimeout(function() {
      clearInterval(interval);
      a.remove(box);
    }, 1600);
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


  const powerupInterval = setInterval(function() {
    a.add(new Powerup());
  }, 6000);

  function Powerup() {
    this.x        = 100 + Math.random() * (a_canvas.width / 3);
    this.y        = 0 + Math.random() * (a_canvas.height - 200);
    this.dx       = 0       ;
    this.dy       = 100     ;
    this.w        = 30      ;
    this.h        = 30      ;
    this.visible  = true    ;
    Missile.addTarget(this) ;
  }

  Powerup.duration = 5;

  Powerup.prototype.hit = function(o) {
    Missile.removeTarget(this);

    // stop moving and start blinking
    this.dx       = 0;
    this.dy       = 0;
    const powerup = this;

    const interval = setInterval(function() {
      powerup.visible = !powerup.visible;
    }, 80);

    setTimeout(function() {
      clearInterval(interval);
      a.remove(powerup);
    }, Powerup.duration * 1000);

    Missile.powerup();
  };
    
  Powerup.prototype.draw = function(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
    if (this.y > a_canvas.height) {
      a.remove(this);
      Missile.removeTarget(this);
      return;
    }
    if (this.visible) {
      a.ctx.fillStyle = 'red';
      a.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  };

});

