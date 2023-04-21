function c_frame(image = null, duration = 1/8, x = 0, y = 0) {
	this.image = image;
	this.duration = duration;
	this.x = x;
	this.y = y;
}

c_frame.prototype.vert = mixin.vert;
c_frame.prototype.check_vert = mixin.check_vert;

c_frame.prototype.draw = function(ctx, x = 0, y = 0) {
	this.check_vert();
	if (this.image !== null) {
		ctx.drawImage(
			this.image, 
			0, 0, this.image.width, this.image.height, 
			this.x + x, this.y + y, this.image.width, this.image.height
		);
	}
};

c_frame.prototype.copy = function(x, y) {
	return new c_frame(this.image, this.duration, x, y);
};

function frame(image = null, duration = 1/8, x = 0, y = 0) {
	return new c_frame(image, duration, x, y);
}

function frames(images, duration = 1/8, x = 0, y = 0) {
	if (Array.isArray(images)) {
		return images.map(image => new c_frame(image, duration, x, y));
	} else {
        return [ new c_frame(images, duration, x, y) ];
	}
};

export { frames as default, frame };
