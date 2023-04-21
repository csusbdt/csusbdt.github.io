function c_touch(shapes, x, y) {
	this.shapes = shapes;
	this.x = x;
	this.y = y;
	this.start_set = [];
	this.stop_set  = [];
}

c_touch.prototype.vert = mixin.vert;
c_touch.prototype.check_vert = mixin.check_vert;

c_touch.prototype.starts = mixin.starts;
c_touch.prototype.stops  = mixin.stops;

c_touch.prototype.start = function() {
	add_touchable(this);
};

c_touch.prototype.stop = function() {
	remove_touchable(this);
};

c_touch.prototype.touch = function(x, y) {
	this.check_vert();
	if (this.shapes === null) {
		clear_touchables();
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
		return true;
	}
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(x - this.x, y - this.y)) {
			clear_touchables();
			stop_stop_sets(this.stop_set);
			start_start_sets(this.start_set);
			return true;
		}
	}
	return false;
};

const touch = function(shapes = null, x = 0, y = 0) {
	if (shapes === null) {
		return new c_touch(null, 0, 0);
	} else if (Array.isArray(shapes)) {
		return new c_touch(shapes, x, y);
	} else {
		return new c_touch([shapes], x, y);
	}
};

export default touch;
