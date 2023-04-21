function c_delay(t) {
	this.t = t;
	this.start_set = [];
	this.stop_set  = [];
	this.elapsed_time = 0;
}

c_delay.prototype.starts = mixin.starts;
c_delay.prototype.stops  = mixin.stops;

c_delay.prototype.started = function() {
	return drawables.includes(this);
};

c_delay.prototype.start = function() {
	this.elapsed_time = 0;
	add_updatable(this);
};

c_delay.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.t) {
		remove_updatable(this);
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	}
};

const delay = function(t) {
	return new c_delay(t);
};

export default delay;
