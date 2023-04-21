import             "../scripts/main.js"  ;
import delay  from "../scripts/delay.js" ;
import frames from "../scripts/frame.js" ;
import loop   from "../scripts/loop.js"  ;
import once   from "../scripts/once.js"  ;
import circle from '../scripts/circle.js';
import touch  from "../scripts/touch.js" ;
import music  from "../scripts/music.js" ;
import sfx    from "../scripts/sfx.js"   ;

const volume = .05;

let audio = null;
let g_396 = null;
let g_639 = null;
let g_417 = null;
let g_741 = null;
let g_528 = null;
let g_852 = null;

const start_audio = _ => {
	if (audio !== null) return; // already started
	audio = new (window.AudioContext || window.webkitAudioContext)();

	g_396 = audio.createGain();
	g_639 = audio.createGain();
	g_417 = audio.createGain();
	g_741 = audio.createGain();
	g_528 = audio.createGain();
	g_852 = audio.createGain();

	g_396.gain.value = 0;
	g_639.gain.value = 0;
	g_417.gain.value = 0;
	g_741.gain.value = 0;
	g_528.gain.value = 0;
	g_852.gain.value = 0;

	g_396.connect(audio.destination);
	g_639.connect(audio.destination);
	g_417.connect(audio.destination);
	g_741.connect(audio.destination);
	g_528.connect(audio.destination);
	g_852.connect(audio.destination);

	let o = null;
	o = audio.createOscillator(); o.frequency.value = 396; o.connect(g_396); o.start();
	o = audio.createOscillator(); o.frequency.value = 639; o.connect(g_639); o.start();
	o = audio.createOscillator(); o.frequency.value = 417; o.connect(g_417); o.start();
	o = audio.createOscillator(); o.frequency.value = 741; o.connect(g_741); o.start();
	o = audio.createOscillator(); o.frequency.value = 528; o.connect(g_528); o.start();
	o = audio.createOscillator(); o.frequency.value = 852; o.connect(g_852); o.start();
}

const play_396  = _ => { start_audio(); g_396.gain.setTargetAtTime(volume, audio.currentTime, .1); }
const play_639  = _ => { start_audio(); g_639.gain.setTargetAtTime(volume, audio.currentTime, .1); }
const play_417  = _ => { start_audio(); g_417.gain.setTargetAtTime(volume, audio.currentTime, .1); }
const play_741  = _ => { start_audio(); g_741.gain.setTargetAtTime(volume, audio.currentTime, .1); }
const play_528  = _ => { start_audio(); g_528.gain.setTargetAtTime(volume, audio.currentTime, .1); }
const play_852  = _ => { start_audio(); g_852.gain.setTargetAtTime(volume, audio.currentTime, .1); }

const pause_396 = _ => { start_audio(); g_396.gain.setTargetAtTime( 0, audio.currentTime, .1); }
const pause_639 = _ => { start_audio(); g_639.gain.setTargetAtTime( 0, audio.currentTime, .1); }
const pause_417 = _ => { start_audio(); g_417.gain.setTargetAtTime( 0, audio.currentTime, .1); }
const pause_741 = _ => { start_audio(); g_741.gain.setTargetAtTime( 0, audio.currentTime, .1); }
const pause_528 = _ => { start_audio(); g_528.gain.setTargetAtTime( 0, audio.currentTime, .1); }
const pause_852 = _ => { start_audio(); g_852.gain.setTargetAtTime( 0, audio.currentTime, .1); }

//const thud = sfx("../sfx/thud_0.966.mp3");
//const tick = sfx("../sfx/tick_0.157.mp3");
const blop = sfx("../sfx/blop_0.264.mp3", .5);

document.body.style.backgroundColor = "rgb(152, 82, 44)";
window.background_color = document.body.style.backgroundColor;

const cir_back = circle( 70, 70,  53);
const cir_396  = circle(624, 571, 80);
const cir_639  = circle(620, 134, 80);
const cir_417  = circle(815, 464, 80);
const cir_741  = circle(433, 243, 80);
const cir_528  = circle(431, 462, 80);
const cir_852  = circle(810, 243, 80);

const back_closing = once(frames([i_back_1, i_back_2], .08));

const back_opened  = loop(frames([i_back_0]));

const num_396 = loop(frames([i_num_396]));
const num_639 = loop(frames([i_num_639]));
const num_417 = loop(frames([i_num_417]));
const num_741 = loop(frames([i_num_741]));
const num_528 = loop(frames([i_num_528]));
const num_852 = loop(frames([i_num_852]));

const on_396  = loop(frames([i_on_396]));
const on_639  = loop(frames([i_on_639]));
const on_417  = loop(frames([i_on_417]));
const on_741  = loop(frames([i_on_741]));
const on_528  = loop(frames([i_on_528]));
const on_852  = loop(frames([i_on_852]));

const off_396 = loop(frames([i_off_396]));
const off_639 = loop(frames([i_off_639]));
const off_417 = loop(frames([i_off_417]));
const off_741 = loop(frames([i_off_741]));
const off_528 = loop(frames([i_off_528]));
const off_852 = loop(frames([i_off_852]));

const t_back = touch(cir_back);
const t_396  = touch(cir_396);
const t_639  = touch(cir_639);
const t_417  = touch(cir_417);
const t_741  = touch(cir_741);
const t_528  = touch(cir_528);
const t_852  = touch(cir_852);

const start_touches = _ => {
    t_back.start();
    t_396.start();
    t_639.start();
    t_417.start();
    t_741.start();
    t_528.start();
    t_852.start();
};

t_396.starts(_ => {
    if (on_396.started()) {
        on_396.stop();
        off_396.start();
        pause_396();
    } else {
        on_396.start();
        off_396.stop();
        play_396();
    }
    start_touches();
});

t_639.starts(_ => {
    if (on_639.started()) {
        on_639.stop();
        off_639.start();
        pause_639();
    } else {
        on_639.start();
        off_639.stop();
        play_639();
    }
    start_touches();
});

t_417.starts(_ => {
    if (on_417.started()) {
        on_417.stop();
        off_417.start();
        pause_417();
    } else {
        on_417.start();
        off_417.stop();
        play_417();
    }
    start_touches();
});

t_741.starts(_ => {
    if (on_741.started()) {
        on_741.stop();
        off_741.start();
        pause_741();
    } else {
        on_741.start();
        off_741.stop();
        play_741();
    }
    start_touches();
});

t_528.starts(_ => {
    if (on_528.started()) {
        on_528.stop();
        off_528.start();
        pause_528();
    } else {
        on_528.start();
        off_528.stop();
        play_528();
    }
    start_touches();
});

t_852.starts(_ => {
    if (on_852.started()) {
        on_852.stop();
        off_852.start();
        pause_852();
    } else {
        on_852.start();
        off_852.stop();
        play_852();
    }
    start_touches();
});

const prepare_for_back_button = _ => {
    setTimeout(_ => {
        back_opened.start();
        start_touches();
    }, 1000);    
};

back_opened.start();
start_touches();

num_396.start();
num_639.start();
num_417.start();
num_741.start();
num_528.start();
num_852.start();

off_396.start();
off_639.start();
off_417.start();
off_741.start();
off_528.start();
off_852.start();

t_back.stops(back_opened).starts(blop, back_closing);

back_closing.starts(delay(.5).starts(_ => { 
    prepare_for_back_button();
    window.location = '../'; 
}));
