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
  return `${hours}h${minutes}m`;
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
    s += " am"; 
  } else {
    s += " pm";
  }
  return s;
}

function guess_longitude(date) {
    return -date.getTimezoneOffset() / 60 * 15;    
}

function draw_disk(color, p) {
  const ctx = g_canvas.getContext('2d');
  ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
  ctx.beginPath();
  ctx.arc (25, 25, 25, 0, p * 2 * Math.PI);
  ctx.lineTo (25, 25) ;
  ctx.fillStyle = color ;
  ctx.fill();
}

function draw_twilight(p) {
  draw_disk("#73b4f3", p);
}

function draw_day(p) {
  draw_disk("#ff6", p);
}

function draw_night(p) {
  draw_disk("#333", p);
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

  g_local_time.innerHTML = time_string(date);

  if (now < dawn) {
    draw_night((dawn - now)/(dawn - yesterday_dusk));
    g_time_remaining.innerHTML = hhmm(dawn - now);
  } else if (now < sunrise) {
    draw_twilight((dusk - now)/(dusk - dawn));
    g_time_remaining.innerHTML = hhmm(dusk - now);
  } else if (now < sunset) {
    draw_day((dusk - now)/(dusk - dawn));
    g_time_remaining.innerHTML = hhmm(dusk - now);
  } else if (now < dusk) {
    draw_twilight((dusk - now)/(dusk - dawn));
    g_time_remaining.innerHTML = hhmm(dusk - now);
  } else {
    draw_night((tomorrow_dawn - now)/(tomorrow_dawn - dusk));
    g_time_remaining.innerHTML = hhmm(tomorrow_dawn - now);
  }
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
