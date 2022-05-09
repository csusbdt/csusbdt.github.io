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

//let date = new Date();
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
  const today            = new Date();
  const yesterday        = new Date(today.getTime() - milliseconds_per_day);
  const tomorrow         = new Date(today.getTime() + milliseconds_per_day);
  const sun_today        = SunCalc.getTimes(today    , lat, long);
  const sun_yesterday    = SunCalc.getTimes(yesterday, lat, long);
  const sun_tomorrow     = SunCalc.getTimes(tomorrow , lat, long);

  const now              = today                .getTime();
  const today_sunset     = sun_today    .sunset .getTime();
  const today_sunrise    = sun_today    .sunrise.getTime();
  const yesterday_sunset = sun_yesterday.sunset .getTime();
  const tomorrow_sunrise = sun_tomorrow .sunrise.getTime();

  g_local_time.innerHTML = time_string(today);
  if (now < today_sunrise) {
    g_time_from.innerHTML = "-" + hhmm(now - yesterday_sunset) + " sunset" ;
    g_time_to.innerHTML   = "+" + hhmm(today_sunrise    - now) + " sunrise";
  } else if (now < today_sunset) {
    g_time_from.innerHTML = "-" + hhmm(now - today_sunrise   ) + " sunrise";
    g_time_to.innerHTML   = "+" + hhmm(today_sunset     - now) + " sunset" ;
  } else { // now > today_sunset
    g_time_from.innerHTML = "-" + hhmm(now - today_sunset    ) + " sunset" ;
    g_time_to.innerHTML   = "+" + hhmm(tomorrow_sunrise - now) + " sunrise";    
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
