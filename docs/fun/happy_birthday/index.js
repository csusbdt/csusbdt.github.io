import             "../scripts/main.js"  ;
import delay  from "../scripts/delay.js" ;
import frames, { frame } from "../scripts/frame.js";
import loop   from "../scripts/loop.js"  ;
import once   from "../scripts/once.js"  ;
import circle from '../scripts/circle.js';
import rect   from '../scripts/rect.js'  ;
import touch  from "../scripts/touch.js" ;
import music  from "../scripts/music.js" ;
import sfx    from "../scripts/sfx.js"   ;

document.body.style.backgroundColor = "rgb(249, 244, 108)";
window.background_color = document.body.style.backgroundColor;

const blop = sfx("../sfx/blop_0.264.mp3", .5);

const happy_birthday_left  = music("happy_birthday_left.mp3" );
const happy_birthday_right = music("happy_birthday_right.mp3");

const source_frame                 = frame(i_source_0);
const source_closing_frames        = frames([i_source_1, i_source_2]);
const back_frame                   = frame(i_back_0, 1, 0, 10);
const back_closing_frames          = frames([i_back_1, i_back_2]);
const left_frames                  = frames([i_left_0]);
const left_closing_frames          = frames([i_left_1, i_left_2]); 
const left_opening_frames          = left_closing_frames.slice().reverse(); 
const right_frames                 = frames([i_right_0]);
const right_closing_frames         = frames([i_right_1, i_right_2]); 
const right_opening_frames         = right_closing_frames.slice().reverse(); 

const left_pause_frames            = frames([i_left_pause_0]);
const left_pause_closing_frames    = frames([i_left_pause_1, i_left_pause_2]); 
const left_pause_opening_frames    = left_pause_closing_frames.slice().reverse();
const left_pause_to_resume_frames  = frames([i_left_pause_1, i_left_pause_2, null, i_left_resume_2, i_left_resume_1]);
const right_pause_frames           = frames([i_right_pause_0]);
const right_pause_closing_frames   = frames([i_right_pause_1, i_right_pause_2]); 
const right_pause_opening_frames   = right_pause_closing_frames.slice().reverse(); 
const right_pause_to_resume_frames = frames([i_right_pause_1, i_right_pause_2, null, i_right_resume_2, i_right_resume_1]);

const left_resume_frames           = frames([i_left_resume_0]);
const left_resume_closing_frames   = frames([i_left_resume_1, i_left_resume_2]); 
const left_resume_opening_frames   = left_resume_closing_frames.slice().reverse(); 
const left_resume_to_pause_frames  = frames([i_left_resume_1, i_left_resume_2, null, i_left_pause_2, i_left_pause_1]);
const right_resume_frames          = frames([i_right_resume_0]);
const right_resume_closing_frames  = frames([i_right_resume_1, i_right_resume_2]); 
const right_resume_opening_frames  = right_resume_closing_frames.slice().reverse();
const right_resume_to_pause_frames = frames([i_right_resume_1, i_right_resume_2, null, i_right_pause_2, i_right_pause_1]);

const left_stop_frames             = frames([i_left_stop_0]);
const left_stop_closing_frames     = frames([i_left_stop_1, i_left_stop_2]); 
const left_stop_opening_frames     = left_stop_closing_frames.slice().reverse(); 
const right_stop_frames            = frames([i_right_stop_0]);
const right_stop_closing_frames    = frames([i_right_stop_1, i_right_stop_2]); 
const right_stop_opening_frames    = right_stop_closing_frames.slice().reverse(); 

const source         = loop(source_frame, 10, 1110, 22).vert(560, 20);
const back           = loop(back_frame).vert(10, 20);
const left           = loop(left_frames).vert(35, 40);
const left_pause     = loop(left_pause_frames).vert(-560, 590);
const left_resume    = loop(left_resume_frames).vert(-570, 570);
const left_stop      = loop(left_stop_frames).vert(left_resume);

const right          = loop(right_frames).vert(-530, 580);
const right_pause    = loop(right_pause_frames).vert(0, 90);
const right_resume   = loop(right_resume_frames).vert(-15, 110);
const right_stop     = loop(right_stop_frames).vert(right_resume);

const source_closing        = once(source_closing_frames).vert(source);
const back_closing          = once(back_closing_frames).vert(back);
const left_closing          = once(left_closing_frames).vert(left);
const left_pause_closing    = once(left_pause_closing_frames).vert(left_pause);
const left_resume_closing   = once(left_resume_closing_frames).vert(left_resume);
const left_resume_stopping  = once(left_resume_closing_frames).vert(left_resume);
const left_stop_closing     = once(left_stop_closing_frames).vert(left_stop);
const right_closing         = once(right_closing_frames).vert(right);
const right_pause_closing   = once(right_pause_closing_frames).vert(right_pause);
const right_resume_closing  = once(right_resume_closing_frames).vert(right_resume);
const right_resume_stopping = once(right_resume_closing_frames).vert(right_resume);
const right_stop_closing    = once(right_stop_closing_frames).vert(right_stop);

const left_opening          = once(left_opening_frames).vert(left);
const left_pause_opening    = once(left_pause_opening_frames).vert(left_pause);
const left_resume_opening   = once(left_resume_opening_frames).vert(left_resume);
const left_resume_to_pause  = once(left_resume_to_pause_frames).vert(left_resume);
const left_stop_opening     = once(left_stop_opening_frames).vert(left_stop);
const left_pause_to_resume  = once(left_pause_to_resume_frames).vert(left_pause);

const right_opening         = once(right_opening_frames).vert(right);
const right_pause_opening   = once(right_pause_opening_frames).vert(right_pause);
const right_resume_opening  = once(right_resume_opening_frames).vert(right_resume);
const right_resume_to_pause = once(right_resume_to_pause_frames).vert(right_resume);
const right_stop_opening    = once(right_stop_opening_frames).vert(right_stop);
const right_pause_to_resume = once(right_pause_to_resume_frames).vert(right_pause);

const cir_source       = circle(70, 70,  55);
const cir_back         = circle(70, 70,  53);
const cir_left         = circle(305, 326, 200);
const cir_left_pause   = circle(890, 173, 154);
const cir_left_resume  = circle(890, 173, 154);
const cir_left_stop    = circle(900, 538, 143);
const cir_right        = circle(866, 333, 196);
const cir_right_pause  = rect(218, 124, 441, 293);
const cir_right_resume = circle(351, 192, 130);
const cir_right_stop   = circle(350, 456, 100);

const t_source              = touch(cir_source      ).vert(source).starts(blop);
const t_back                = touch(cir_back        ).vert(back).starts(blop);
const t_left                = touch(cir_left        ).vert(left).starts(blop, t_back, t_source);
const t_left_pause          = touch(cir_left_pause  ).vert(left_pause).starts(blop, t_back, t_source);
const t_left_resume         = touch(cir_left_resume ).vert(left_resume).starts(blop, t_back, t_source);
const t_left_stop_paused    = touch(cir_left_stop   ).vert(left_stop).starts(blop, t_back, t_source);
const t_left_stop_playing   = touch(cir_left_stop   ).vert(left_stop).starts(blop, t_back, t_source);
const t_right               = touch(cir_right       ).vert(right).starts(blop, t_back, t_source);
const t_right_pause         = touch(cir_right_pause ).vert(right_pause).starts(blop, t_back, t_source);
const t_right_resume        = touch(cir_right_resume).vert(right_resume).starts(blop, t_back, t_source);
const t_right_stop_paused   = touch(cir_right_stop  ).vert(right_stop).starts(blop, t_back, t_source);
const t_right_stop_playing  = touch(cir_right_stop  ).vert(right_stop).starts(blop, t_back, t_source);

const init = _ => {
    happy_birthday_left.rewind();
    happy_birthday_right.rewind();
    clear_drawables();
    clear_updatables();
    clear_touchables();
    source.start();
    back.start();
    left.start();
    right.start();
    t_source.start();
    t_back.start();
    t_left.start();
    t_right.start();
};
init();

source_closing.starts(delay(.5).starts(_ => { 
    setTimeout(init, 500);
    window.location = 'https://github.com/csusbdt/happy_birthday'; 
}));

back_closing.starts(delay(.5).starts(_ => { 
    setTimeout(init, 500);
    window.location = '../'; 
}));

left_opening        .starts(left       , t_left       , t_right                                 );
left_pause_opening  .starts(left_pause , t_left_pause                                           );
left_resume_opening .starts(left_resume, t_left_resume                                          );
left_stop_opening   .starts(left_stop  , t_left_stop_playing                                    );
left_pause_to_resume.starts(left_resume, t_left_resume, t_left_stop_paused                      );
left_resume_to_pause.starts(left_pause , t_left_pause , t_left_stop_playing, happy_birthday_left);

right_opening        .starts(right       , t_left       , t_right                                    );
right_pause_opening  .starts(right_pause , t_right_pause                                             );
right_resume_opening .starts(right_resume, t_right_resume                                            );
right_stop_opening   .starts(right_stop  , t_right_stop_playing                                      );
right_pause_to_resume.starts(right_resume, t_right_resume, t_right_stop_paused                       );
right_resume_to_pause.starts(right_pause , t_right_pause , t_right_stop_playing, happy_birthday_right);

left_closing.starts(right_pause_opening, right_stop_opening);
left_resume_closing.starts(left_resume_opening);
left_stop_closing.starts(right_opening);

right_closing.starts(left_pause_opening, left_stop_opening);
right_resume_closing.starts(right_resume_opening);
right_stop_closing.starts(left_opening);

t_source
    .stops(source, happy_birthday_left, happy_birthday_right)
    .starts(blop, source_closing);

t_back
    .stops(back, happy_birthday_left, happy_birthday_right)
    .starts(blop, back_closing);

t_left.stops(right).starts(happy_birthday_left, right_closing);
t_left_pause.stops(happy_birthday_left, left_pause).starts(left_pause_to_resume);
t_left_resume.stops(left_resume).starts(happy_birthday_left, left_resume_to_pause);
t_left_stop_playing
    .stops(left_stop, left_pause)
    .starts(left_stop_closing, left_pause_closing, happy_birthday_left.rewind.bind(happy_birthday_left));
t_left_stop_paused
    .stops(left_stop, left_resume)
    .starts(left_stop_closing, left_resume_stopping, happy_birthday_left.rewind.bind(happy_birthday_left));
happy_birthday_left.stops(left_stop, left_pause).starts(left_stop_closing, left_pause_closing);

t_right.stops(left).starts(happy_birthday_right, left_closing);
t_right_pause.stops(happy_birthday_right, right_pause).starts(right_pause_to_resume);
t_right_resume.stops(right_resume).starts(happy_birthday_right, right_resume_to_pause);
t_right_stop_playing
    .stops(right_stop, right_pause)
    .starts(right_stop_closing, right_pause_closing, happy_birthday_right.rewind.bind(happy_birthday_right));
t_right_stop_paused
    .stops(right_stop, right_resume)
    .starts(right_stop_closing, right_resume_stopping, happy_birthday_right.rewind.bind(happy_birthday_right));
happy_birthday_right.stops(right_stop, right_pause).starts(right_stop_closing, right_pause_closing);

window.on_vertical = _ => {
    set_design_size(720, 1280);
};

window.on_horizontal = _ => {
    set_design_size(1280, 720);
};
