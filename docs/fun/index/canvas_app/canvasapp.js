//#region utility functions

const log = function(...args) {
	args.forEach(arg => console.log(arg));
};

function stop_start(o) {
	o.stop_set.forEach(o => o.stop());
	o.start_set.forEach(o => {
		if (typeof(o) === 'function') {
			o();
		} else if ('play' in o) {
			o.play();
		} else {
			o.start();
		}
	});	
};

// const next = function(url) {
// //	return () => setTimeout(() => window.location.href = url, 250);
// 	return () => setTimeout(() => window.location.assign(url), 250);
// };

// const back = function(url) {
// 	return () => setTimeout(() => window.history.back(), 250);
// };
			
// const replace = function(url) {
// 	return () => setTimeout(() => window.location.href = url, 250);
// };

// const goto = function(url) {
// 	return () => setTimeout(() => window.location.href = url, 250);
// };

// const goto = function(url) {
// 	return () => setTimeout(() => window.location.href = url, 250);
// };


//#endregion

//#region fullscreen

const fullscreen_enabled = function() {
	return (
		'requestFullscreen'       in g_canvas ||
		'webkitRequestFullscreen' in g_canvas ||
		'mozRequestFullScreen'    in g_canvas ||
		'msRequestFullscreen'     in g_canvas 
	);
};

const fullscreen_active = function() {
	if ('fullscreenElement' in document) {
		return document.fullscreenElement === g_canvas;
	} else if ('webkitFullscreenElement' in document) {
		return document.webkitFullscreenElement === g_canvas;
	} else if ('mozFullScreenElement' in document) {
		return document.mozFullScreenElement === g_canvas;
	} else if ('msFullscreenElement' in document) {
		return document.msFullscreenElement === g_canvas;
	} else {
		return false;
	}
};

let on_fullscreen = null;
let on_windowed = null;

const set_on_fullscreen = f => on_fullscreen = f; 
const set_on_windowed   = f => on_windowed = f; 

function on_fullscreen_change() {
	if (fullscreen_active()) {
		if (on_fullscreen !== null) on_fullscreen();
	} else {
		if (on_windowed !== null) on_windowed();
	}
};

if ('onfullscreenchange' in document) {
	document.onfullscreenchange = on_fullscreen_change;
} else if ('webkitfullscreenchange' in document) {
	document.webkitfullscreenchange = on_fullscreen_change;
} else if ('mozfullscreenchange' in document) {
	document.mozfullscreenchange = on_fullscreen_change;
} else if ('MSFullscreenChange' in document) {
	document.MSFullscreenChange = on_fullscreen_change;
}

// safari doesn't return a promise for requestFullscreen
const request_fullscreen = function() {
	if ('requestFullscreen' in g_canvas) {
		return g_canvas.requestFullscreen();
	} else if ('webkitRequestFullscreen' in g_canvas) {
		return g_canvas.webkitRequestFullscreen();
	} else if ('mozRequestFullScreen' in g_canvas) {
		return g_canvas.mozRequestFullScreen();
	} else if ('msRequestFullscreen' in g_canvas) {
		return g_canvas.msRequestFullscreen();
	} else {
		throw new Error("request fullscreen not supported");
	}
};

const exit_fullscreen = function() {
	if ('exitFullscreen' in document) {
		return document.exitFullscreen();
	} else if ('webkitExitFullscreen' in document) {
		return document.webkitExitFullscreen();
	} else if ('mozCancelFullScreen' in document) {
		return document.mozCancelFullScreen();
	} else if ('msExitFullscreen' in document) {
		return document.msExitFullscreen();
	} else {
		throw new Error("exit fullscreen not supported");
	}
};

//#endregion

//#region sound

// function c_sound(audio_element) {
// 	this.audio_element = audio_element;
// }

// c_sound.prototype.start = function() {
// 	this.audio_element.play();
// };

// const sound = function(audio_element) {
// 	return new c_sound(audio_element);
// };

//#endregion

//#region circle

export function c_circle(x, y, r) {
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

//#endregion

//#region rect

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

//#endregion

//#region frame

export function c_frame(image, duration = 1/8, x = 0, y = 0) {
	this.image = image;
	this.duration = duration;
	this.x = x;
	this.y = y;
}

c_frame.prototype.draw = function(ctx, dx = 0, dy = 0) {
	ctx.drawImage(
		this.image, 
		0, 
		0, 
		this.image.width, 
		this.image.height, 
		this.x + dx, 
		this.y + dy, 
		this.image.width, 
		this.image.height);
};

const frame = function(image, duration = 1/8, x = 0, y = 0) {
	return new c_frame(image, duration, x, y);
};

const frames = function(images, duration = 1/8, x = 0, y = 0) {
	if (!Array.isArray(images)) {
		throw new Error("images not an array");
	}
	return images.map(image => new c_frame(image, duration, x, y));
};

//#endregion

//#region delay

function c_delay(t) {
	this.t = t;
	this.start_set = [];
	this.stop_set  = [];
	this.elapsed_time = 0;
}

c_delay.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_delay.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_delay.prototype.start = function() {
	this.elapsed_time = 0;
	add_updatable(this);
};

c_delay.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.t) {
		remove_updatable(this);
		stop_start(this);
	}
};

const delay = function(t) {
	return new c_delay(t);
};

//#endregion

//#region once

export function c_once(frames, z_index = 100, dx = 0, dy = 0) {
	this.frames = frames;
	this.z_index = z_index;
	this.dx = dx;
	this.dy = dy;
	this.start_set = [];
	this.stop_set  = [];
}

c_once.prototype.starts = function(...os) {
	os.forEach(o => {
		this.start_set.push(o);
	});
	return this;
};

c_once.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_once.prototype.start = function() {
	this.frame_index = 0;
	this.elapsed_time = 0;
	add_drawable(this);
	add_updatable(this);
};

c_once.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx, this.dx, this.dy);
};

c_once.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.frames[this.frame_index].duration) {
		this.elapsed_time = 0;
		++this.frame_index;
		dirty = true;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
			remove_drawable(this);
			remove_updatable(this);
			stop_start(this);
		}
	}
};

const once = function(frames, z_index = 10, dx = 0, dy = 0) {
	if (Array.isArray(frames)) {
		return new c_once(frames, z_index, dx, dy);
	} else {
		return new c_once([frames], z_index, dx, dy);
	}
};

//#endregion

//#region loop

function c_loop(frames, z_index = 10, dx = 0, dy = 0) {
	this.frames = frames;
	this.z_index = z_index;
	this.dx = dx;
	this.dy = dy;
}

c_loop.prototype.start = function() {
	this.frame_index  = 0;
	this.elapsed_time = 0;
	add_drawable(this);
	add_updatable(this);
};

c_loop.prototype.stop = function() {
	remove_drawable(this);
	remove_updatable(this);
};

c_loop.prototype.started = function() {
	return drawables.includes(this);
};

c_loop.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx, this.dx, this.dy);
};

c_loop.prototype.update = function(dt) {
	if (this.frames.length === 1) {
		// ensure an initial draw after start
		if (this.elapsed_time === 0) {
			this.elapsed_time = dt;
			dirty = true;
		}
		return;
	}
	this.elapsed_time += dt;
	if (this.elapsed_time > this.frames[this.frame_index].duration) {
		this.elapsed_time = 0;
		++this.frame_index;
		dirty = true;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
		}
	}
};

const loop = function(frames, z_index = 10, dx = 0, dy = 0) {
	if (Array.isArray(frames)) {
		return new c_loop(frames, z_index, dx, dy);
	} else {
		return new c_loop([frames], z_index, dx, dy);
	}
};

//#endregion

//#region touch

function c_touch(shapes, dx, dy) {
	this.shapes = shapes;
	this.dx = dx;
	this.dy = dy;
	this.independent = false;
	this.start_set = [];
	this.stop_set  = [];
}

c_touch.prototype.make_independent = function() {
	this.independent = true;
	return this;
}

c_touch.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_touch.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_touch.prototype.start = function() {
	add_touchable(this);
};

c_touch.prototype.stop = function() {
	remove_touchable(this);
};

c_touch.prototype.touch = function(x, y) {
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(x - this.dx, y - this.dy)) {
			if (this.independent) {
				remove_touchable(this);
			} else {
				touchables = touchables.filter(o => !o.independent);
			}
			stop_start(this);
			return true;
		}
	}
	return false;
};

const touch = function(shapes, dx = 0, dy = 0) {
	if (Array.isArray(shapes)) {
		return new c_touch(shapes, dx, dy);
	} else {
		return new c_touch([shapes], dx, dy);
	}
};

//#endregion

//#region main

const g_w     = 1280;  // design width
const g_h     = 720;   // design height
const g_spf   = 1 / 8; // default seconds per frame
let dirty = true;  // to redraw canvas

const ctx = g_canvas.getContext('2d', { alpha: false });
let scale = 1;
let left  = 0;
let top   = 0;

function adjust_canvas() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	
	// Set canvas size.
	scale = Math.min(1, w / g_w, h / g_h);
	g_canvas.width  = scale * g_w;
	g_canvas.height = scale * g_h;

	// Center canvas in browser window.
	left = (w  - g_canvas.width ) / 2;
	top  = (h - g_canvas.height) / 2;
	g_canvas.style.left = left;
	g_canvas.style.top  = top;

	// Set drawing context transform to scale design coordinates 
	// (world coordinates) to display coordinates.
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	dirty = true;
}

adjust_canvas();

window.addEventListener('resize', adjust_canvas);

// Convert mouse event coords to game world coords.
const canvas_coords = e => {
	return {
		x: (e.pageX - left) / scale,
		y: (e.pageY - top ) / scale
	};
};

const drawables      = [];
const updatables     = [];
let touchables       = [];

let audio_context = null;

const on_touch = p => {
	// Getting audio context on first touch will enable fastest
	// possible playout of sound on subsequent touch events.
	if (audio_context === null) {
		audio_context = new (window.AudioContext || window.webkitAudioContext)();
	}
	// I'm not sure the following is needed but I think phones might 
	// suspend audio contexts to reduce battery drain.
	if (audio_context.state === 'suspended') {
		audio_context.resume();
	}
	for (let i = 0; i < touchables.length; ++i) {
		if (touchables[i].touch(p.x, p.y)) break;
	}
};

const mousemove = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
};

const mousedown = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
	on_touch(canvas_coords(e));
};

// the following touchend and touchmove code needed for fullscreen on chrome
// see: https://stackoverflow.com/questions/42945378/full-screen-event-on-touch-not-working-on-chrome/42948120

const touchend = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'none';
	on_touch(canvas_coords(e.changedTouches[0]));
};

const touchmove = e => {
	e.preventDefault();
}

g_canvas.addEventListener('mousemove', mousemove, true);
g_canvas.addEventListener('mousedown', mousedown, true); 
g_canvas.addEventListener('touchend' , touchend , true); 
g_canvas.addEventListener('touchmove', touchmove, { passive: false }); 

const add_touchable = function(o) {
	if (touchables.includes(o)) return;
	touchables.push(o);
};

const add_drawable = function(o) {
	if (!('z_index' in o)) throw new Error(o);
	if (drawables.includes(o)) return;
	dirty = true;
	for (let i = drawables.length; i > 0; --i) {
		if (o.z_index >= drawables[i - 1].z_index) {
			drawables.splice(i, 0, o);
			return;
		}
	}
	drawables.unshift(o);
};

const add_updatable = function(o) {
	if (updatables.includes(o)) return;
	updatables.push(o);
};

const clear_touchables = function() {
	touchables.length = 0;
};

const remove_touchable = function(o) {
	const i = touchables.indexOf(o);
	if (i !== -1) {
		touchables.splice(i, 1);
	}
};

const remove_drawable = function(o) {
	const i = drawables.indexOf(o);
	if (i !== -1) {
		drawables.splice(i, 1);
		dirty = true;
	}
};

const remove_updatable = function(o) {
	const i = updatables.indexOf(o);
	if (i !== -1) {
		updatables.splice(i, 1);
	}
};

let previous_time = new Date().getTime() / 1000;

function animation_loop() {
	if (dirty) {
		ctx.drawImage(g_bg, 0, 0, g_w, g_h, 0, 0, g_w, g_h);
		drawables.forEach(o => o.draw(ctx));
		dirty = false;
	}
	const current_time = new Date().getTime() / 1000;
	let dt = current_time - previous_time;
	previous_time = current_time;
	updatables.slice().forEach(o => o.update(dt));
	requestAnimationFrame(animation_loop);
}

requestAnimationFrame(animation_loop);

//#endregion

//#region exports

export default {
	version: '2021-06-29-a',
	log: log,
	fullscreen_enabled: fullscreen_enabled,
	fullscreen_active: fullscreen_active,
	set_on_fullscreen: set_on_fullscreen,
	set_on_windowed: set_on_windowed,
	request_fullscreen: request_fullscreen,
	exit_fullscreen: exit_fullscreen,
	//sound: sound,
	circle: circle,
	rect: rect,
	frame: frame,
	frames: frames,
	delay: delay,
	once: once,
	loop: loop,
	touch: touch
}

//#endregion
