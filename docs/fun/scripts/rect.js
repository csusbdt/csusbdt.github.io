function c_rect(left, top, right, bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
}

c_rect.prototype.inside = function(x, y) {
	return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
};

c_rect.prototype.center = function() {
	return { 
		x: (this.left + this.right) / 2, 
		y: (this.top + this.bottom) / 2 
	};
};

const rect = function(left, top, right, bottom) {
	return new c_rect(left, top, right, bottom);
};

export default rect;
