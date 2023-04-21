import g from '../canvasapp.js';

document.title = "test 2";

const blop_sound  = g.sound(s_blop);
const click_sound = g.sound(s_click);
const thud_sound = g.sound(s_thud);
const tick_sound = g.sound(s_tick);

// shapes

const bg_shapes         = [g.rect(0, 0, 1280, 720)];
const fullscreen_shapes = [g.circle(400, 374, 300)];
const windowed_shapes   = [g.rect(840, 288, 1212, 486)];
const sel_1_shapes      = [g.circle(426, 226,  70)];
const sel_2_shapes      = [g.circle(200, 425, 160), g.circle(420, 560, 100)];
const sel_3_shapes      = [g.circle(838, 428, 160)];
const sel_x_shapes      = [g.rect(950, 120, 1120, 214)];
const op_x_shapes       = [g.circle(1047, 177, 73)];

// adjustments to map 1 to 2, 3, x 

const dx_2 = -126;
const dy_2 = 242;
const dx_3 = 412;
const dy_3 = 202;
const dx_x = 621;
const dy_x = -49;

// frames

const fullscreen_frames = g.frames([i_pick_screen]);
const door_frames       = g.frames([i_door]);
const opening_x_frames  = g.frames([i_exit_0, i_exit_1]);
const opened_x_frames   = g.frames([i_exit_2]);
const closing_x_frames  = opening_x_frames.slice().reverse();
const idle_1_frames     = g.frames([i_idle1_0, i_idle1_1, i_idle1_2]);

const walk_1_2_frames = [
	g.frame(i_idle1_0, 1/8, 128, -4), 
	g.frame(i_idle1_1, 1/8, 240, -2), 
	g.frame(i_idle1_2, 1/8, 373, 18), 
	g.frame(i_idle1_0, 1/8, 497, 38), 
	g.frame(i_idle1_1, 1/8, 609, 73), 
	g.frame(i_idle1_2, 1/8, 645, 175), 
	g.frame(i_idle1_0, 1/8, 609, 283), 
	g.frame(i_idle1_1, 1/8, 503, 363), 
	g.frame(i_idle1_2, 1/8, 355, 377), 
	g.frame(i_idle1_0, 1/8, 215, 360), 
	g.frame(i_idle1_1, 1/8, 115, 343), 
	g.frame(i_idle1_2, 1/8, 3, 313), 
	g.frame(i_idle1_0, 1/8, -74, 283), 
	g.frame(i_idle1_1, 1/8, -126, 242) 
];
const walk_2_1_frames = walk_1_2_frames.slice().reverse();

const walk_1_3_frames = [
	g.frame(i_idle1_0, 1/8, 65, 36), 
	g.frame(i_idle1_1, 1/8, 136, 75), 
	g.frame(i_idle1_2, 1/8, 186, 111), 
	g.frame(i_idle1_0, 1/8, 263, 143), 
	g.frame(i_idle1_1, 1/8, 337, 182), 
	g.frame(i_idle1_2, 1/8, 387, 212), 
	g.frame(i_idle1_0, 1/8, 412, 202) 
];
const walk_3_1_frames = walk_1_3_frames.slice().reverse();

const walk_2_3_frames = [
	g.frame(i_idle1_0, 1/8, -55, 240), 
	g.frame(i_idle1_1, 1/8, 21, 250), 
	g.frame(i_idle1_2, 1/8, 96, 245), 
	g.frame(i_idle1_0, 1/8, 165, 235), 
	g.frame(i_idle1_1, 1/8, 238, 227), 
	g.frame(i_idle1_2, 1/8, 325, 222), 
	g.frame(i_idle1_0, 1/8, 412, 202) 
];
const walk_3_2_frames = walk_2_3_frames.slice().reverse();

const walk_3_x_frames = [
	g.frame(i_idle1_0, 1/8, 454, 174), 
	g.frame(i_idle1_1, 1/8, 500, 120), 
	g.frame(i_idle1_2, 1/8, 550, 54), 
	g.frame(i_idle1_0, 1/8, 599, -14), 
	g.frame(i_idle1_1, 1/8, 607, -54) 
];
const walk_x_3_frames = walk_3_x_frames.slice().reverse();

// loops

const fullscreen = g.loop(fullscreen_frames, 10);
const door       = g.loop(door_frames, 10);
const idle_1     = g.loop(idle_1_frames, 10);
const idle_2     = g.loop(idle_1_frames, 10, dx_2, dy_2);
const idle_3     = g.loop(idle_1_frames, 10, dx_3, dy_3);
const idle_x     = g.loop(idle_1_frames, 10, dx_x, dy_x);
const opened_x   = g.loop(opened_x_frames, 10);

// touches 

const sel_fullscreen = g.touch(fullscreen_shapes).stops(fullscreen).starts(click_sound);
const sel_windowed   = g.touch(windowed_shapes).stops(fullscreen).starts(click_sound);
const sel_2_1        = g.touch(sel_1_shapes).stops(idle_2).starts(click_sound);
const sel_3_1        = g.touch(sel_1_shapes).stops(idle_3).starts(click_sound);
const sel_x_1        = g.touch(sel_1_shapes).stops(idle_x).starts(click_sound);
const sel_1_2        = g.touch(sel_2_shapes).stops(idle_1).starts(click_sound);
const sel_3_2        = g.touch(sel_2_shapes).stops(idle_3).starts(click_sound);
const sel_x_2        = g.touch(sel_2_shapes).stops(idle_x).starts(click_sound);
const sel_1_3        = g.touch(sel_3_shapes).stops(idle_1).starts(click_sound);
const sel_2_3        = g.touch(sel_3_shapes).stops(idle_2).starts(click_sound);
const sel_x_3        = g.touch(sel_3_shapes).stops(idle_x).starts(click_sound);
const sel_1_x        = g.touch(sel_x_shapes).stops(idle_1).starts(click_sound);
const sel_2_x        = g.touch(sel_x_shapes).stops(idle_2).starts(click_sound);
const sel_3_x        = g.touch(sel_x_shapes).stops(idle_3).starts(click_sound);
const sel_x_x        = g.touch(sel_x_shapes).starts(blop_sound);

const op_x     = g.touch(op_x_shapes).stops(opened_x, idle_x).starts(click_sound);
const noop_x_1 = g.touch(sel_1_shapes).stops(opened_x, idle_x).starts(click_sound);
const noop_x_2 = g.touch(sel_2_shapes).stops(opened_x, idle_x).starts(click_sound);
const noop_x_3 = g.touch(sel_3_shapes).stops(opened_x, idle_x).starts(click_sound);
const noop_x   = g.touch(bg_shapes).stops(opened_x).starts(thud_sound);

// onces

const walk_2_1 = g.once(walk_2_1_frames).starts(idle_1, sel_1_2, sel_1_3, sel_1_x);
const walk_3_1 = g.once(walk_3_1_frames).starts(idle_1, sel_1_2, sel_1_3, sel_1_x);
const walk_x_1 = g.once(walk_x_3_frames).starts(walk_3_1);
const walk_1_2 = g.once(walk_1_2_frames).starts(idle_2, sel_2_1, sel_2_3, sel_2_x);
const walk_3_2 = g.once(walk_3_2_frames).starts(idle_2, sel_2_1, sel_2_3, sel_2_x);
const walk_x_2 = g.once(walk_x_3_frames).starts(walk_3_2);
const walk_1_3 = g.once(walk_1_3_frames).starts(idle_3, sel_3_1, sel_3_2, sel_3_x);
const walk_2_3 = g.once(walk_2_3_frames).starts(idle_3, sel_3_1, sel_3_2, sel_3_x);
const walk_x_3 = g.once(walk_x_3_frames).starts(idle_3, sel_3_1, sel_3_2, sel_3_x);

const walk_3_x = g.once(walk_3_x_frames).starts(idle_x, sel_x_1, sel_x_2, sel_x_3, sel_x_x);
const walk_1_x = g.once(walk_1_3_frames).starts(walk_3_x);
const walk_2_x = g.once(walk_2_3_frames).starts(walk_3_x);

const opening_x        = g.once(opening_x_frames).starts(opened_x, op_x, noop_x_1, noop_x_2, noop_x_3, noop_x);
const closing_op_x     = g.once(closing_x_frames).starts(g.delay(.5).starts(g.goto('../')));
const closing_noop_x_3 = g.once(closing_x_frames).starts(walk_x_3);
const closing_noop_x_1 = g.once(closing_x_frames).starts(walk_x_1);
const closing_noop_x_2 = g.once(closing_x_frames).starts(walk_x_2);
const closing_noop_x   = g.once(closing_x_frames).starts(sel_x_1, sel_x_2, sel_x_3, sel_x_x);

// touch starts

const enter = () => {
	door.start();
	idle_1.start();
	sel_1_2.start();
	sel_1_3.start();
	sel_1_x.start();
};
sel_fullscreen.starts(enter, g.request_fullscreen);
sel_windowed.starts(enter);

sel_1_2.starts(walk_1_2);
sel_1_3.starts(walk_1_3);
sel_1_x.starts(walk_1_x);
sel_2_1.starts(walk_2_1);
sel_2_3.starts(walk_2_3);
sel_2_x.starts(walk_2_x);
sel_3_1.starts(walk_3_1);
sel_3_2.starts(walk_3_2);
sel_3_x.starts(walk_3_x);
sel_x_1.starts(walk_x_1);
sel_x_2.starts(walk_x_2);
sel_x_3.starts(walk_x_3);
sel_x_1.starts(walk_x_1);
sel_x_x.starts(opening_x);

op_x.starts(closing_op_x);
noop_x_1.starts(closing_noop_x_1);
noop_x_2.starts(closing_noop_x_2);
noop_x_3.starts(closing_noop_x_3);
noop_x.starts(closing_noop_x);

window.addEventListener('load', () => {
	if (g.fullscreen_enabled()) {
		fullscreen.start();
		sel_fullscreen.start();
		sel_windowed.start();	
	} else {
		enter();
	}
});
