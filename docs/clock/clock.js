import "./suncalc.js";  // https://github.com/mourner/suncalc
  
// utils

// san berdo 34.1083 -117.2898  

const yellow      = "#FBF57D";
const blue        = "#7D83FB";
const green       = "#8ADBAC";
const light_grey  = "#bbb";
const medium_grey = "#999";
const dark_grey   = "#666";

const milliseconds_per_day  = 24 * 60 * 60 * 1000;

function zero_pad(num, zeros = 2) {
  return num.toString().padStart(zeros, '0');
}

function hhmm(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  return `${hours}h${minutes}`;
}

function hours_string(milliseconds) {
  return Number.parseFloat(milliseconds/1000/60/60).toFixed(1);
}

function time_string(date) {
  let s = "";
  if (date.getHours() <= 12) {
    s += date.getHours() + ":";
  } else {
    s += (date.getHours() - 12) + ":";
  }
  if (date.getMinutes() < 10) s += "0";
  s += date.getMinutes();
  if (date.getHours() < 12) {
    s += "am"; 
  } else {
    s += "pm";
  }
  return s;
}

function guess_longitude(date) {
    return -date.getTimezoneOffset() / 60 * 15;    
}

// init

let lat  = null;
let long = null;

if (navigator.geolocation) {    
  navigator.geolocation.getCurrentPosition(
    pos => {
      lat  = pos.coords.latitude;
      long = pos.coords.longitude;
      localStorage.setItem('clock.lat' , lat );
      localStorage.setItem('clock.long', long);
    }, _ => {});
}

if (lat === null) {
  lat = parseFloat(localStorage.getItem('clock.lat'));
  if (isNaN(lat)) {
    lat = 0;
  }  
}

if (long === null) {
  long = parseFloat(localStorage.getItem('clock.long'));
  if (isNaN(long)) {
    long = guess_longitude(new Date());
  }  
}

g_lat.value  = lat;
g_long.value = long;

function update() {
  const date  = new Date();
  const ydate = new Date(date.getTime() - milliseconds_per_day);
  const tdate = new Date(date.getTime() + milliseconds_per_day);
  
  const now            = date.getTime();      
  const sun            = SunCalc.getTimes(date, lat, long);
  const dawn           = sun.dawn.getTime();
  const sunrise        = sun.sunrise.getTime();
  const sunset         = sun.sunset.getTime();
  const dusk           = sun.dusk.getTime();      
  const yesterday_dusk = SunCalc.getTimes(ydate, lat, long).dusk.getTime();
  const tomorrow_dawn  = SunCalc.getTimes(tdate, lat, long).dawn.getTime();

  //g_local_time.innerHTML = time_string(date);
/*
  if (now < dawn) {
    g_time_remaining.innerHTML = hhmm(dawn - now) + "->light";
  } else if (now < sunrise) {
    g_time_remaining.innerHTML = hhmm(dusk - now) + "->light";
  } else if (now < sunset) {
    g_time_remaining.innerHTML = hhmm(dusk - now) + "->dark";
  } else if (now < dusk) {
    g_time_remaining.innerHTML = hhmm(dusk - now) + "->dark";
  } else {
    g_time_remaining.innerHTML = hhmm(tomorrow_dawn - now) + "->light";
  } 
*/
  draw_clock();
}

update();
setInterval(update, 60 * 1000);

g_lat.addEventListener('change', _ => {
  lat = parseFloat(g_lat.value);
  localStorage.setItem('clock.lat', lat);
  update();
});

g_long.addEventListener('change', _ => {
  long = parseFloat(g_long.value);
  localStorage.setItem('clock.long', long);
  update();
});

// season

function get_mar(date) {
  const jde = A.Solistice.march(date.getFullYear());
  return A.JulianDay.jdFromJDE(jde).toDate();
}

function get_jun(year) {
  const jde = A.Solistice.june(year);
  return A.JulianDay.jdFromJDE(jde).toDate().getTime();
}

function get_sep(date) {
  const jde = A.Solistice.september(date.getFullYear());
  return A.JulianDay.jdFromJDE(jde).toDate();
}

function get_dec(year) {
  console.log(year);
  const jde = A.Solistice.december(year);
  return A.JulianDay.jdFromJDE(jde).toDate().getTime();
}

function draw_season() {
  const ctx = g_canvas_season.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  const cx = ctx.canvas.width  / 2;
  const cy = ctx.canvas.height / 2;
  const r  = ctx.canvas.width  / 2 * .83;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = dark_grey;
  ctx.fill();

  const now          = new Date();
  const t            = now.getTime();
  const current_year = now.getFullYear();
  const prev_year    = current_year - 1;
  const next_year    = current_year + 1;

  let prev_d = null;
  let next_d = null;
  const d = get_dec(current_year);
  if (t < d) {
    next_d = d;
    prev_d = get_dec(prev_year);
  } else {
    next_d = get_dec(next_year);
    prev_d = d;
  }
  
  let prev_j = null;
  let next_j = null;
  const j = get_jun(current_year);
  if (t < j) {
    next_j = j;
    prev_j = get_jun(prev_year);
  } else {
    next_j = get_jun(next_year);
    prev_j = j;
  }

  const p = (t - prev_d) / (next_d - prev_d); // percent of year completed

  const a = p * 2 * Math.PI + Math.PI / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI / 2, a);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = medium_grey;
  ctx.fill();

  const x = cx + r * Math.cos(a);
  const y = cy + r * Math.sin(a);
  ctx.beginPath();
  ctx.arc(x, y, .10 * r, 0, 2*Math.PI);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = green;
  ctx.fill();
/*
  if (next_j < next_d) {
    if (t - prev_d < next_j - t) {
	  g_season.innerHTML = "win->" + Math.round((t - prev_d) / 1000 / 60 / 60 / 24);
    } else {
	  g_season.innerHTML = Math.round((next_j - t) / 1000 / 60 / 60 / 24) + "->sum";
    }
  } else {
    if (t - prev_j < next_d - t) {
	  g_season.innerHTML = "sum->" + Math.round((t - prev_j) / 1000 / 60 / 60 / 24);
    } else {
	  g_season.innerHTML = Math.round((next_d - t) / 1000 / 60 / 60 / 24) + "->win";
    }
  }
*/
}

draw_season();

function draw_day_circle(p) {
  const ctx = g_canvas.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  const cx = ctx.canvas.width  / 2;
  const cy = ctx.canvas.height / 2;
  const r  = ctx.canvas.width  / 2;  
  const sliver = (p - .5) / 2 * 2*Math.PI;
  const start_angle = sliver;
  const end_angle   = Math.PI - sliver;
  ctx.arc (cx, cy, r, end_angle, start_angle);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = "#ff6";
  ctx.fill();
  ctx.beginPath();
//  ctx.moveTo()
}

function draw_clock() {
  const date  = new Date();
  const ydate = new Date(date.getTime() - milliseconds_per_day);
  const tdate = new Date(date.getTime() + milliseconds_per_day);

  const today_sun      = SunCalc.getTimes( date, lat, long);
  const yesterday_sun  = SunCalc.getTimes(ydate, lat, long);
  const now            = date.getTime();
  let t = null;
  if (now < today_sun.dawn.getTime()) {
    t = (now - yesterday_sun.dawn.getTime()) / milliseconds_per_day;
  } else {
    t = (now - today_sun.dawn.getTime()) / milliseconds_per_day;    
  }

  const p = (today_sun.dusk.getTime() - today_sun.dawn.getTime()) / milliseconds_per_day;

  const ctx = g_canvas.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  const cx = ctx.canvas.width  / 2;
  const cy = ctx.canvas.height / 2;
  const r  = ctx.canvas.width  / 2 * .83;
  const sliver = (p - .5) / 2 * 2*Math.PI;
  const start_angle = Math.PI - sliver;
  const end_angle   = sliver;
  ctx.arc(cx, cy, r, start_angle, end_angle);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = yellow;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, end_angle, start_angle);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = dark_grey;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, start_angle, Math.PI - sliver + t * 2*Math.PI);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = medium_grey;
  ctx.fill();

//  ctx.beginPath();
//  ctx.moveTo(cx + r * Math.cos(sliver), cy + r * Math.sin(sliver));
//  ctx.lineTo(cx, cy);
//  ctx.strokeStyle = "#000";
//  ctx.setLineDash([4, 4]);
//  ctx.stroke();   
//  ctx.setLineDash([]);
  
  const a = Math.PI - sliver + t * 2*Math.PI;
  const x = cx + r * Math.cos(a);
  const y = cy + r * Math.sin(a);
  ctx.beginPath();
  ctx.arc(x, y, .10 * r, 0, 2*Math.PI);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = green;
  ctx.fill();
}

