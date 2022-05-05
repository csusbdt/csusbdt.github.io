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

// init

let date = new Date();
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
    long = guess_longitude(date);
  }  
}

g_lat.value  = lat;
g_long.value = long;

function update() {
  date = new Date();  
  g_local_time.innerHTML = time_string(date);
  const sun_today  = SunCalc.getTimes(date, lat, long);
  const sunrise    = sun_today.sunrise.getTime();
  const sunset     = sun_today.sunset.getTime();
  const now        = date.getTime();
  if (now < sunrise) {
    g_time.innerHTML = hhmm(sunrise - now) + " to sunrise";
  } else if (now < sunset) {
    g_time.innerHTML = hhmm(sunset - now) + " to sunset";        
  } else {
    const tomorrow_sunrise = SunCalc.getTimes(now + hrs24, lat, long).sunrise.getTime();
    g_time.innerHTML = hhmm(tomorrow_sunrise - now) + " to sunrise";        
  }  
}

update();
setTimeout(update, 60 * 1000);


// notes

//  let local_time             = get_local_time(); //new Date();

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
