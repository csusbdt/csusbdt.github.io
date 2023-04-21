import             "../scripts/main.js"   ;
import frames from "../scripts/frame.js"  ;
import once   from "../scripts/once.js"   ;
import loop   from "../scripts/loop.js"   ;
import delay  from "../scripts/delay.js"  ;
import arrive from "../scripts/arrive.js" ;
import circle from "../scripts/circle.js" ;
import rect   from "../scripts/rect.js"   ;
import touch  from "../scripts/touch.js"  ;
import sfx    from "../scripts/sfx.js"    ;

document.body.style.backgroundColor = "rgb(175, 182, 44)";
window.background_color = document.body.style.backgroundColor;

const blop = sfx("../sfx/blop_0.264.mp3", .2);
const tick = sfx("../sfx/tick_0.157.mp3", .2);

// (col, row)
const cir_cell = circle(0, 0, 82);
const cir_tut  = circle(0, 0, 60); // tut = tutorial
const r_reset  = rect(0, 0, 162, 90);

const boundary  = loop(frames([i_boundary  ]), 0);
const box       = loop(frames([i_box       ]), 1);
const left      = loop(frames([i_left      ]), 1);
const up        = loop(frames([i_up        ]), 1);
const q_opened  = loop(frames([i_q_0       ]), 2);

const reset_opened  = loop(frames([i_reset_0]));
const reset_closing = once(frames([i_reset_1, i_reset_2]));
const reset_opening = once(frames([i_reset_2, i_reset_1])).starts(reset_opened);

const q_closing = once(frames([i_q_1, i_q_2]), 2);
const q_opening = once(frames([i_q_2, i_q_1]), 2).starts(q_opened);

const t_tut   = touch(cir_tut, 786, 78);
const t_reset = touch(r_reset, 93, 66);
const t_00    = touch(cir_cell, 412      , 132          );
const t_01    = touch(cir_cell, 412      , 132 + 163    );
const t_02    = touch(cir_cell, 412      , 132 + 163 * 2);
const t_10    = touch(cir_cell, 412 + 163, 132          );
const t_11    = touch(cir_cell, 412 + 163, 132 + 163    );
const t_12    = touch(cir_cell, 412 + 163, 132 + 163 * 2);
/*
const t_00    = touch(c00);
const t_01    = touch(c01);
const t_02    = touch(c02);
const t_10    = touch(c10);
const t_11    = touch(c11);
const t_12    = touch(c12);
*/

const duration = .3;

const a_box_00     = arrive(box,    0,   0, duration);
const a_box_01     = arrive(box,    0, 140, duration);
const a_box_02     = arrive(box,    0, 280, duration);
const a_box_10     = arrive(box,  140,   0, duration);
const a_box_11     = arrive(box,  140, 140, duration);
const a_box_12     = arrive(box,  140, 280, duration);
const a_box_index  = arrive(box, -280, 140, duration);
const a_box_music  = arrive(box,  420, 140, duration);
const a_box_source = arrive(box, -280, 280, duration);

const a_up_00   = arrive(up,   0,   0, duration);
const a_up_01   = arrive(up,   0, 140, duration);
const a_up_02   = arrive(up,   0, 280, duration);
const a_up_10   = arrive(up, 140,   0, duration);
const a_up_11   = arrive(up, 140, 140, duration);
const a_up_12   = arrive(up, 140, 280, duration);

const a_left_00 = arrive(left,   0,   0, duration);
const a_left_01 = arrive(left,   0, 140, duration);
const a_left_02 = arrive(left,   0, 280, duration);
const a_left_10 = arrive(left, 140,   0, duration);
const a_left_11 = arrive(left, 140, 140, duration);
const a_left_12 = arrive(left, 140, 280, duration);

q_opening.starts(t_tut, t_01, t_10);
t_reset.stops(reset_opened).starts(blop, reset_closing, q_opening, a_left_00, a_up_00, a_box_00);

const prepare_for_back_button = _ => {
    setTimeout(_ => {
        reset_opened.stop();
        reset_closing.start();
        q_opened.start();
        a_up_00.start();
        a_left_00.start();
        a_box_00.start();
    }, 1000);    
}

a_box_index.starts(
    prepare_for_back_button,
    _ => window.location = "../"
);

a_box_music.starts(
    prepare_for_back_button,
    _ => window.location = "../music/"
);

a_box_source.starts(
    prepare_for_back_button,
    _ => window.location = "https://github.com/csusbdt/csusbdt.github.io/tree/master/docs/fun/puzzle"
);

a_box_00.starts(_ => {
    t_01.start();
    t_10.start();
    t_reset.start();
});

a_box_10.starts(_ => {
    t_00.start();
    if (left.x === 140 && left.y !== 140) {
        t_11.start();
    }
    t_reset.start();
});

a_box_01.starts(_ => {
    if (left.y === 0) {
        if (up.y === 140) {
            t_00.start();
            t_11.start();
            t_02.start();
        } else {
            a_box_index.start();
        }
    } else if (left.y === 140) {
        if (up.y === 140) {
            t_00.start();
            t_11.start();
            t_02.start();
        } else {
            a_box_index.start();
        }
    } else {
        a_box_index.start();
    }
    t_reset.start();
});

a_box_11.starts(_ => {
    if (left.y === 0) {
        if (up.y === 140) {
            t_01.start();
            t_12.start();                
        } else {
            a_box_music.start();
        }
    } else if (left.y === 140) {
        if (up.x === 0) {
            t_10.start();
            t_12.start();          
        } else {
            t_10.start();
            t_01.start();
            t_12.start();
        }
    } else {
        // not possible
    }
    t_reset.start();
});

a_box_02.starts(_ => {
    if (up.y !== 280) {
        a_box_source.start();
    } else {
        t_01.start();
        t_12.start();
    }
    t_reset.start();
});

a_box_12.starts(_ => {
    if (left.y !== 140) {
        t_11.start();        
    }
    t_02.start();
    t_reset.start();
});

t_00.starts(_ => {
    if (box.x === 140) {
        if (up.x === 140) {
            a_up_00.start();
        }
    } else {
        if (left.x === 0) {
            a_up_00.start();
            a_left_00.start();
        }
    }
    a_box_00.start();
});

t_10.starts(_ => {
    if (q_opened.started()) {
        q_opened.stop();
        q_closing.start();
    }
    if (reset_opened.stopped()) {
        reset_opening.start();
    }
   if (box.x === 0) {
       if (left.y === 0) {
           a_left_10.start();
       }
       if (up.y === 0) {
           a_up_10.start();
       }
   } else {
       if (left.y === 140) {
           a_left_10.start();
           if (up.x === 140 && up.y === 140) {
               a_up_10.start();
           }
        }
    }
    a_box_10.start();
});

t_01.starts(_ => {
    if (q_opened.started()) {
        q_opened.stop();
        q_closing.start();
    }
    if (reset_opened.stopped()) {
        reset_opening.start();
    }
   if (box.y === 0) {
       if (left.x === 0) {
           a_left_01.start();
       }
       if (up.x === 0 && up.y === 0) {
           a_up_01.start();
       }
   } else if (box.y === 140) {
       if (up.y === 140) {
           a_up_01.start();
       }
   } else {
        if (left.x === 0) {
           a_left_01.start();
           a_up_01.start();
        }       
   }
    a_box_01.start();
});

t_11.starts(_ => {
    if (box.y === 0) {
        a_left_11.start();
        if (up.x === 140) {
            a_up_11.start();
        }
    } else if (box.y === 140) {
        a_up_11.start();
        if (left.x === 0) {
            a_left_11.start();
        }
    } else {
        if (left.y === 280) {
            a_left_11.start();
            if (up.y === 280) {
                a_up_11.start();        
            }
        }
    }    
    a_box_11.start();
});

t_02.starts(_ => {
    if (box.y === 140) {
        if (up.x === 0 && up.y === 140) {
            a_up_02.start();
        }
        if (left.x === 0) {
            a_left_02.start();
        }
    } else {
       if (up.x === 140 && up.y === 280) {
           a_up_02.start();
       }
    }
    a_box_02.start();
});

t_12.starts(_ => {
    if (box.y === 140) {
        if (left.y === 140) {
            a_left_12.start();
        }
        if (up.x === 140 && up.y === 140) {
            a_up_12.start();
        }
    } else {
        if (left.x === 0) {
            a_left_12.start();
        }
        if (up.y === 280) {
            a_up_12.start();
        }        
    }
    a_box_12.start();
});

const tutorial_start_delay = .2;
const mouse_arrive_delay   = .3;
const tutorial_arrive_duration = .2;
const tutorial_mouse       = loop(frames([i_q_1]), 2);

const tutorial_start_1_delay = delay(tutorial_start_delay);
t_tut.stops(q_opened).starts(tutorial_mouse, tutorial_start_1_delay);
const tutorial_mouse_arrive_1 = arrive(tutorial_mouse, -210, 60, .3);
tutorial_start_1_delay.starts(tutorial_mouse_arrive_1);
const tutorial_mouse_arrive_1_delay = delay(mouse_arrive_delay);
tutorial_mouse_arrive_1.starts(tutorial_mouse_arrive_1_delay);
const tutorial_mouse_press_1 = once(frames([i_q_2], .3), 2, -210, 60).starts(tutorial_mouse);
tutorial_mouse_arrive_1_delay.stops(tutorial_mouse).starts(tick, tutorial_mouse_press_1);
const tutorial_box_arrive_1  = arrive(box , 140, 0, tutorial_arrive_duration);
const tutorial_up_arrive_1   = arrive(up  , 140, 0, tutorial_arrive_duration);
const tutorial_left_arrive_1 = arrive(left, 140, 0, tutorial_arrive_duration);
tutorial_mouse_press_1.starts(tutorial_box_arrive_1, tutorial_up_arrive_1, tutorial_left_arrive_1);

const tutorial_start_2_delay = delay(tutorial_start_delay);
tutorial_box_arrive_1.starts(tutorial_start_2_delay);
const tutorial_mouse_arrive_2 = arrive(tutorial_mouse, -360, 60, tutorial_arrive_duration);
tutorial_start_2_delay.starts(tutorial_mouse_arrive_2);
const tutorial_mouse_arrive_2_delay = delay(mouse_arrive_delay);
tutorial_mouse_arrive_2.starts(tutorial_mouse_arrive_2_delay);
const tutorial_mouse_press_2 = once(frames([i_q_2], tutorial_arrive_duration), 2, -360 , 60).starts(tutorial_mouse);
tutorial_mouse_arrive_2_delay.stops(tutorial_mouse).starts(tick, tutorial_mouse_press_2);
const tutorial_box_arrive_2  = arrive(box , 0, 0, tutorial_arrive_duration);
const tutorial_up_arrive_2   = arrive(up  , 0, 0, tutorial_arrive_duration);
tutorial_mouse_press_2.starts(tutorial_box_arrive_2, tutorial_up_arrive_2);

const tutorial_start_3_delay = delay(tutorial_start_delay);
tutorial_box_arrive_2.starts(tutorial_start_3_delay);
const tutorial_mouse_arrive_3 = arrive(tutorial_mouse, -360, 200, tutorial_arrive_duration);
tutorial_start_3_delay.starts(tutorial_mouse_arrive_3);
const tutorial_mouse_arrive_3_delay = delay(mouse_arrive_delay);
tutorial_mouse_arrive_3.starts(tutorial_mouse_arrive_3_delay);
const tutorial_mouse_press_3 = once(frames([i_q_2], tutorial_arrive_duration), 2, -360 , 200).starts(tutorial_mouse);
tutorial_mouse_arrive_3_delay.stops(tutorial_mouse).starts(tick, tutorial_mouse_press_3);
const tutorial_box_arrive_3  = arrive(box , 0, 140, tutorial_arrive_duration);
const tutorial_up_arrive_3   = arrive(up  , 0, 140, tutorial_arrive_duration);
tutorial_mouse_press_3.starts(tutorial_box_arrive_3, tutorial_up_arrive_3);

const tutorial_start_4_delay = delay(tutorial_start_delay);
tutorial_box_arrive_3.starts(tutorial_start_4_delay);
const tutorial_mouse_arrive_4 = arrive(tutorial_mouse, -360, 340, tutorial_arrive_duration);
tutorial_start_4_delay.starts(tutorial_mouse_arrive_4);
const tutorial_mouse_arrive_4_delay = delay(mouse_arrive_delay);
tutorial_mouse_arrive_4.starts(tutorial_mouse_arrive_4_delay);
const tutorial_mouse_press_4 = once(frames([i_q_2], tutorial_arrive_duration), 2, -360, 340).starts(tutorial_mouse);
tutorial_mouse_arrive_4_delay.stops(tutorial_mouse).starts(tick, tutorial_mouse_press_4);
const tutorial_box_arrive_4  = arrive(box , 0, 280, tutorial_arrive_duration);
const tutorial_up_arrive_4   = arrive(up  , 0, 280, tutorial_arrive_duration);
tutorial_mouse_press_4.starts(tutorial_box_arrive_4, tutorial_up_arrive_4);

const tutorial_start_5_delay = delay(tutorial_start_delay);
tutorial_box_arrive_4.starts(tutorial_start_5_delay);
const tutorial_mouse_arrive_5 = arrive(tutorial_mouse, -360, 200, tutorial_arrive_duration);
tutorial_start_5_delay.starts(tutorial_mouse_arrive_5);
const tutorial_mouse_arrive_5_delay = delay(mouse_arrive_delay);
tutorial_mouse_arrive_5.starts(tutorial_mouse_arrive_5_delay);
const tutorial_mouse_press_5 = once(frames([i_q_2], tutorial_arrive_duration), 2, -360, 200).starts(tutorial_mouse);
tutorial_mouse_arrive_5_delay.stops(tutorial_mouse).starts(tick, tutorial_mouse_press_5);
const tutorial_box_arrive_5  = arrive(box , 0, 140, tutorial_arrive_duration);
tutorial_mouse_press_5.starts(tutorial_box_arrive_5);

const tutorial_box_arrive_6  = arrive(box , -280, 140, tutorial_arrive_duration);
tutorial_box_arrive_5.starts(tutorial_box_arrive_6);

const tutorial_start_end_delay = delay(tutorial_start_delay);
tutorial_box_arrive_6.starts(tutorial_start_end_delay);
const tutorial_mouse_arrive_end = arrive(tutorial_mouse, 0, 0, 0);
const tutorial_box_arrive_end   = arrive(box , 0, 0, tutorial_arrive_duration);
const tutorial_up_arrive_end    = arrive(up  , 0, 0, tutorial_arrive_duration);
const tutorial_left_arrive_end  = arrive(left, 0, 0, tutorial_arrive_duration);
tutorial_start_end_delay
    .stops(tutorial_mouse)
    .starts(tutorial_mouse_arrive_end, tutorial_box_arrive_end, tutorial_up_arrive_end, tutorial_left_arrive_end);
tutorial_box_arrive_end.starts(q_opening);

boundary.start();
box.start();
left.start();
up.start();
t_10.start();
t_01.start();
q_opened.start();
t_tut.start();


window.on_vertical = _ => {
    set_design_size(960, 540);
};

window.on_horizontal = _ => {
    set_design_size(960, 540);
};
