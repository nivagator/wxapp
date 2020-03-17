// set variables
let lat = 38.9071923;
let long = -77.0368707;
let today;
let api;
let revapi;
let tempDescription = document.querySelector('.temp-description');
let tempDegree = document.querySelector('.temp-degree');
let locTimezone = document.querySelector('.loc-timezone');
let degreeSection = document.querySelector('.temp-degree');
let locLink = document.querySelector('.loc-link');
const degreeSpan = document.querySelector('.degree-section span');
const feelsDegrees = document.querySelector('.feels-degrees');
const feelSpan = document.querySelector('.feelslike span')

// on load, populate default wx/location 
window.addEventListener('load', ()=> {
  geoFindMe();
});

// function to switch between F and C
function changeUnits(){
  let tempval = tempDegree.textContent
  let feelstempval = feelsDegrees.textContent
  if(degreeSpan.textContent === "F") {
    let celcius = (tempval - 32) * (5 / 9);
    let feelsCelcius = (feelstempval -32) * (5 / 9);
    degreeSpan.textContent = "C";
    degreeSection.textContent = celcius.toFixed(1); //C to one decimal
    feelSpan.textContent = "C";
    feelsDegrees.textContent = feelsCelcius.toFixed(1); //C to one decimal
    for (let step = 0; step <5; step++) {
      let dayX = document.getElementById('day-'+[step]);
      let dayX_hi = dayX.querySelector('.hi .value');
      let dayX_lo = dayX.querySelector('.lo .value');
      let hi = (dayX_hi.textContent - 32) * (5 / 9);
      let lo = (dayX_lo.textContent - 32) * (5 / 9);
      console.log(lo);
      dayX_hi.innerHTML = hi.toFixed(1);
      dayX_lo.innerHTML = lo.toFixed(1);
    };
  }else{
    ftemp = (tempval * (9/5)) + 32
    ffeelslike = (feelstempval * (9/5)) + 32
    degreeSpan.textContent = "F";
    degreeSection.textContent = Math.round(ftemp); //F to no decimals
    feelSpan.textContent = "F";
    feelsDegrees.textContent = Math.round(ffeelslike); //F to no decimals
    for (let step = 0; step <5; step++) {
      let dayX = document.getElementById('day-'+[step]);
      let dayX_hi = dayX.querySelector('.hi .value');
      let dayX_lo = dayX.querySelector('.lo .value');
      let hi = (dayX_hi.textContent * (9 / 5)) + 32;
      let lo = (dayX_lo.textContent * (9 / 5)) + 32;
      console.log(lo);
      dayX_hi.innerHTML = Math.round(hi);
      dayX_lo.innerHTML = Math.round(lo);
    };
  }
}

// function to call user location from the browser
function geoFindMe() {
  const status = document.querySelector('#status');
  function success(position) {
    lat  = position.coords.latitude.toFixed(4);
    long = position.coords.longitude.toFixed(4);
    getWeather(lat, long)
    getLoc(lat,long)
    status.textContent = '';
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
    getWeather(lat,long);
    getLoc(lat,long);
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
    getWeather(lat,long);
    getLoc(lat,long);
  } else {
    status.textContent = 'Locating...'
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// function set icons
function setIcons(icon, iconID, icon_color){
  const skycons = new Skycons({color: icon_color});
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon])
}

//function to set weather dom elements
function setWxDOM(temperature, summary, apparentTemperature) {
  tempDegree.textContent = Math.round(temperature);
  tempDescription.textContent = summary;
  feelsDegrees.textContent = Math.round(apparentTemperature)
  degreeSpan.textContent = "F";
  feelSpan.textContent = "F";
}

function convertDate(date) {
  let days_arr = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  let short_date = (date.getMonth() + 1) + '/' + date.getDate()
  let weekday = days_arr[date.getDay()]
  let arry = [ weekday, short_date ]
  return arry
}  

function setfcstDOM(daily) {
  for (let step = 0; step <5; step++) {
    let time = new Date(daily[step].time * 1000)
    let dateArry = convertDate(time)
    let dayX = document.getElementById('day-'+[step])
    dayX.querySelector('.weekday').textContent = dateArry[0]
    dayX.querySelector('.date').textContent = dateArry[1]
    dayX.querySelector('.hi .value').textContent = Math.round(daily[step].temperatureHigh)
    dayX.querySelector('.lo .value').textContent = Math.round(daily[step].temperatureLow)
    let dayX_icon = '.day'+[step]+'-icon'
    setIcons(daily[step].icon, document.querySelector(dayX_icon), "lightgrey")
  }
}

// function to call weather api
function getWeather(lat, long){
  api = `https://gavingreer.com/api/forecast/${lat},${long}`;
  // console.log(api)
  fetch(api)
  .then(response => {
    return response.json();
  })
  .then(data => {
    // console.log(data);
    const { temperature, summary, icon, apparentTemperature, time } = data.currently;
    const daily = data.daily.data;
    // set wx elements
    setWxDOM(temperature, summary, apparentTemperature);
    // set icon
    setIcons(icon, document.querySelector('.icon'), "rgb(61, 61, 61)");
    // today = new Date(time * 1000)
    // let arry = convertDate(today);
    // console.log(arry[1])
    setfcstDOM(daily)
  })
}

// reverse geolocation api call
function getLoc(lat,long) {
  revapi =`https://us1.locationiq.com/v1/reverse.php?key=pk.623808e23f86a40926f8ecefb0b48b52&lat=${lat}&lon=${long}&format=json`
  // console.log(revapi)
  fetch(revapi)
    .then(response => {
      return response.json();
    })
    .then(revdata => {
      const { city, state } = revdata.address;
      locTimezone.textContent = `${city}, ${state}`;
      locLink.href = `https://www.openstreetmap.org/#map=12/${lat}/${long}`;
    });
}

// get random city from file
function getCity() {
  document.querySelector('#status').textContent=''
  fetch('cities.json')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
        }
        response.json().then(function(data) {
          let rand = getRandomInt(data.length);
          lat = data[rand].latitude;
          long = data[rand].longitude;
          console.log('#' + rand + ' of ' + data.length + ' - ' + data[rand].city + ' - ' + lat + ', ' + long);
          getWeather(lat,long);
          getLoc(lat,long);
        });
      }
    )
    .catch(function(err){
      console.log('Fetch Error :-S', err)
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// change temp to C/F event listener
document.querySelector('.temp-degree').addEventListener('click', changeUnits);
// use my location event listener
document.querySelector('#find-me').addEventListener('click', geoFindMe);
// get city listener
document.querySelector('#get-city').addEventListener('click', getCity);
