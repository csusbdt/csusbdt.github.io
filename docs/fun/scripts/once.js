function c_once(frames, z_index = 100, x = 0, y = 0) {
	this.frames = frames;
	this.z_index = z_index;
	this.x = x;
	this.y = y;
	this.start_set = [];
	this.stop_set  = [];
}

c_once.prototype.vert = mixin.vert;
c_once.prototype.check_vert = mixin.check_vert;

//c_once.prototype.set_x = function(x) {
//	this.x = x;
//	dirty = true;
//	return this;
//}

//c_once.prototype.set_y = function(y) {
//	this.y = y;
//	dirty = true;
//	return this;
//}

c_once.prototype.starts = mixin.starts;
c_once.prototype.stops  = mixin.stops;

c_once.prototype.started = function() {
	return drawables.includes(this);
};

c_once.prototype.start = function() {
	this.frame_index = 0;
	this.elapsed_time = 0;
	add_drawable(this);
	add_updatable(this);
	return this;
};

c_once.prototype.draw = function(ctx) {
	this.check_vert();
	this.frames[this.frame_index].draw(ctx, this.x, this.y);
};

c_once.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.frames[this.frame_index].duration) {
		this.elapsed_time = 0;
		++this.frame_index;
		dirty = true;
		if (this.frame_index === this.frames.length) {
			remove_drawable(this);
			remove_updatable(this);
			stop_stop_sets(this.stop_set);
			start_start_sets(this.start_set);
		}
	}
};

const once = function(frames, z_index = 10, x = 0, y = 0) {
	if (Array.isArray(frames)) {
		return new c_once(frames, z_index, x, y);
	} else {
		return new c_once([frames], z_index, x, y);
	}
};

export default once;
