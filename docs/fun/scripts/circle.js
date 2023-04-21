function c_circle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

c_circle.prototype.inside = function(x, y) {
	return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) < this.r * this.r;
};

const circle = function(x, y, r) {
	return new c_circle(x, y, r);
};

export default circle;
