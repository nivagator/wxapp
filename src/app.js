let lat = 38.9071923;
let long = -77.0368707;
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
  getWeather(lat,long)
  getLoc(lat,long)
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
  }else{
    ftemp = (tempval * (9/5)) + 32
    ffeelslike = (feelstempval * (9/5)) + 32
    degreeSpan.textContent = "F";
    degreeSection.textContent = Math.round(ftemp); //F to no decimals
    feelSpan.textContent = "F";
    feelsDegrees.textContent = Math.round(ffeelslike); //F to no decimals
  }
}

// function to call user location from the browser
function geoFindMe() {
  const status = document.querySelector('#status');
  const button = document.querySelector('#find-me');
  
  function success(position) {
    lat  = position.coords.latitude.toFixed(4);
    long = position.coords.longitude.toFixed(4);
    
    getWeather(lat, long)
    getLoc(lat,long)
    status.textContent = '';
    button.textContent = "Use my location";
    button.classList.add('hide');
  }

  function error() {
    button.textContent = "Use my location"
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    button.textContent = "Use my location"
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    button.textContent = 'Locating…'
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// function set icons
function setIcons(icon, iconID){
  const skycons = new Skycons({color: "white"});
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

// function to call weather api
function getWeather(lat, long){
  api = `https://gavingreer.com/api/forecast/${lat},${long}`;
  console.log(api)
  fetch(api)
  .then(response => {
    return response.json();
  })
  .then(data => {
    // console.log(data);
    const { temperature, summary, icon, apparentTemperature } = data.currently;
    // set wx elements
    setWxDOM(temperature, summary, apparentTemperature)
    // set icon
    setIcons(icon, document.querySelector('.icon'));
  })
}

// reverse geolocation api call
function getLoc(lat,long) {
  revapi =`https://us1.locationiq.com/v1/reverse.php?key=pk.623808e23f86a40926f8ecefb0b48b52&lat=${lat}&lon=${long}&format=json`
  console.log(revapi)
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
          document.querySelector('#find-me').classList.remove('hide');
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
