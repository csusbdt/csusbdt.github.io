import "./suncalc.js";  // https://github.com/mourner/suncalc
  
// utils

// san berdo 34.1083 -117.2898  

const milliseconds_per_day = 24 * 60 * 60 * 1000;

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

function draw_season() {
  const now  = new Date();
  const march_de     = A.Solistice.march(now.getFullYear());
  const march_do     = A.JulianDay.jdFromJDE(march_de);
  const march        = march_do.toDate();
  const june_de      = A.Solistice.june(now.getFullYear());
  const june_do      = A.JulianDay.jdFromJDE(june_de);
  const june         = june_do.toDate();
  const september_de = A.Solistice.september(now.getFullYear());
  const september_do = A.JulianDay.jdFromJDE(september_de);
  const september    = september_do.toDate();
  const december_de  = A.Solistice.december(now.getFullYear());
  const december_do  = A.JulianDay.jdFromJDE(december_de);
  const december     = december_do.toDate();
  const march2_de    = A.Solistice.march(now.getFullYear() + 1);
  const march2_do    = A.JulianDay.jdFromJDE(march2_de);
  const march2       = march2_do.toDate();
  const n  = now.getTime();
  const m  = march.getTime();
  const j  = june.getTime();
  const s  = september.getTime();
  const d  = december.getTime();
  const m2 = march2.getTime();
  if (n < m) {
	  g_season.innerHTML = Math.round((m  - n) / 1000 / 60 / 60 / 24) + "->spr";
  } else if (n < j) {
	  g_season.innerHTML = Math.round((j  - n) / 1000 / 60 / 60 / 24) + "->sum";
  } else if (n < s) {
	  g_season.innerHTML = Math.round((s  - n) / 1000 / 60 / 60 / 24) + "->aut";
  } else if (n < d) {
	  g_season.innerHTML = Math.round((d  - n) / 1000 / 60 / 60 / 24) + "->win";
  } else {
	  g_season.innerHTML = Math.round((m2 - n) / 1000 / 60 / 60 / 24) + "->spr";
  }
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
  ctx.moveTo()
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
  const r  = ctx.canvas.width  / 2;  
  const sliver = (p - .5) / 2 * 2*Math.PI;
  const start_angle = Math.PI - sliver;
  const end_angle   = sliver;
  ctx.arc (cx, cy, r, start_angle, end_angle);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = "#ff6";
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, end_angle, start_angle);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = "#000";
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, start_angle, Math.PI - sliver + t * 2*Math.PI);
  ctx.lineTo(cx, cy);
  ctx.fillStyle = "#ddd";
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ddd";
  ctx.stroke(); 

/*  
  const a = Math.PI - sliver + t * 2*Math.PI;
  ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  ctx.lineTo(cx, cy);
  ctx.strokeStyle = "#000";
  ctx.stroke(); 
  */
}