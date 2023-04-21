import g from './canvasapp.js';

document.title = "canvas example";

const blop_sound  = g.sound(s_blop);
const click_sound = g.sound(s_click);
const thud_sound  = g.sound(s_thud);
const tick_sound  = g.sound(s_tick);

const dx_2 = 560;
const dy_2 = 200;

const fullscreen_loop      = g.loop(g.frames([i_fullscreen]));
const test_1_loop          = g.loop(g.frames([i_test_1]));
const test_2_loop          = g.loop(g.frames([i_test_1]), 10, dx_2, dy_2);
const hi_closed_loop       = g.loop(g.frames([i_hi_0]));
const hi_opened_loop       = g.loop(g.frames([i_hi_5]), 11);
const preferred_color_loop = g.loop(g.frames([i_preferred_color]));
const red_loop             = g.loop(g.frames([i_red]));
const blue_loop            = g.loop(g.frames([i_blue]));
const red_blue_loop        = g.loop(g.frames([i_red, i_blue], 1 / 2), 11);
const back_loop            = g.loop(g.frames([i_back]));

const fullscreen_once = g.once(g.frames([i_fullscreen_1, i_fullscreen_2, i_fullscreen_3], 1/8), 11);
const opening_hi_once = g.once(g.frames([i_hi_1, i_hi_2, i_hi_3, i_hi_4]), 11);
const closing_hi_once = g.once(g.frames([i_hi_4, i_hi_3, i_hi_2, i_hi_1]), 11);
const back_once       = g.once(g.frames([i_back_1, i_back_2, i_back_3]), 11);

const fullscreen_touch = g.touch([g.rect(12, 12, 287, 104)]);
const test_1_touch     = g.touch([g.rect(74, 263, 474, 463)]);
const test_2_touch     = g.touch([g.rect(74, 263, 474, 463)], dx_2, dy_2);
const open_hi_touch    = g.touch([g.circle(800, 330, 32)]);
const close_hi_touch   = g.touch([g.rect(0, 0, 1280, 720)]);
const red_touch        = g.touch([g.circle(134, 588, 30)]);
const blue_touch       = g.touch([g.circle(212, 588, 30)]);
const clear_touch      = g.touch([g.rect(262, 566, 311, 601)]);
const back_touch       = g.touch([g.circle(1109, 138, 140)]);

const start_touches = () => {
	if (g.fullscreen_enabled() && !g.fullscreen()) {
		fullscreen_touch.start();
	}
	back_touch.start();
	test_1_touch.start();
	test_2_touch.start();
	open_hi_touch.start();
	const preferred_color = localStorage.getItem('preferred_color');
	if (preferred_color === 'red') {
		blue_touch.start();
		clear_touch.start();
	} else if (preferred_color === 'blue') {
		red_touch.start();
		clear_touch.start();
	} else {
		red_touch.start();
		blue_touch.start();
	}
};

fullscreen_touch.stops(fullscreen_loop).starts(blop_sound, fullscreen_once);
fullscreen_once.starts(g.request_fullscreen, start_touches);

test_1_touch.starts(click_sound, g.delay(.5).starts(g.goto('test_1/')));
test_2_touch.starts(click_sound, g.delay(.5).starts(g.goto('test_2/')));
open_hi_touch.stops(hi_closed_loop).starts(opening_hi_once, blop_sound);
close_hi_touch.stops(hi_opened_loop).starts(closing_hi_once, thud_sound);
opening_hi_once.starts(hi_opened_loop, close_hi_touch);
closing_hi_once.starts(hi_closed_loop, start_touches);
back_once.starts(g.goto('../'));

const set_red     = () => localStorage.setItem('preferred_color', 'red');
const set_blue    = () => localStorage.setItem('preferred_color', 'blue');
const clear_color = () => localStorage.removeItem('preferred_color');

red_touch.stops(red_blue_loop, blue_loop).starts(set_red, red_loop, start_touches, tick_sound);
blue_touch.stops(red_blue_loop, red_loop).starts(set_blue, blue_loop, start_touches, tick_sound);
clear_touch.stops(red_loop, blue_loop).starts(clear_color, red_blue_loop, start_touches, click_sound);
back_touch.stops(back_loop).starts(back_once, blop_sound);

window.addEventListener('load', e => {
	if (g.fullscreen_enabled()) {
		fullscreen_loop.start();
	}
	const preferred_color = localStorage.getItem('preferred_color');
	if (preferred_color === 'red') {
		red_loop.start();
	} else if (preferred_color === 'blue') {
		blue_loop.start();
	} else {
		red_blue_loop.start();
	}
	test_1_loop.start();
	test_2_loop.start();
	hi_closed_loop.start();
	preferred_color_loop.start();
	back_loop.start();
	start_touches();
});
