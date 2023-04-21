function c_arrive(o, x, y, t) {
	this.o = o;
	this.x = x;
	this.y = y;
	this.t = t;
	this.start_set = [];
	this.stop_set  = [];
	this.time_remaining = t;
}

c_arrive.prototype.starts = mixin.starts;
c_arrive.prototype.stops  = mixin.stops;

c_arrive.prototype.started = function() {
	return updatables.includes(this);
};

c_arrive.prototype.start = function() {
	add_updatable(this);
	this.time_remaining = this.t;
};

c_arrive.prototype.update = function(dt) {
    const dx = dt / this.time_remaining * (this.x - this.o.x);
    const dy = dt / this.time_remaining * (this.y - this.o.y);
    this.time_remaining -= dt;
	if (this.time_remaining < 0.0001) {
        this.o.x = this.x;
        this.o.y = this.y;
		remove_updatable(this);
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	} else {
        this.o.x += dx;
        this.o.y += dy;
	}
    dirty = true;
};

const arrive = function(o, x, y, t) {
	return new c_arrive(o, x, y, t);
};

export default arrive;
