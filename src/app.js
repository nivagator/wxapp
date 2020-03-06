//get location long and lat
window.addEventListener('load', ()=> {
  // const vs let?
  let long;
  let lat;
  let tempDescription = document.querySelector('.temp-description');
  let tempDegree = document.querySelector('.temp-degree');
  let locTimezone = document.querySelector('.loc-timezone');
  let degreeSection = document.querySelector('.temp-degree');
  const degreeSpan = document.querySelector('.degree-section span');
  const feelsDegrees = document.querySelector('.feels-degrees');
  const feelSpan = document.querySelector('.feelslike span')
  const host = window.location.host
  
  //if location exists in the browser
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => { // console.log(position); // show in browser console
      long = position.coords.longitude;
      lat = position.coords.latitude;
      
      // declare weather api 
      let api = `https://gavingreer.com/api/forecast/${lat},${long}` 
      console.log(api)
      
      // weather data   
      fetch(api)
        .then(response => {
          // convert to json
          return response.json();
        })
        .then(data => {
          // console.log(data);
          const { temperature, summary, icon, time, apparentTemperature } = data.currently;

          //Set DOM elements from the api
          tempDegree.textContent = Math.round(temperature);
          tempDescription.textContent = summary;
          feelsDegrees.textContent = Math.round(apparentTemperature)
          //locTimezone.textContent = data.timezone

          //set icon
          setIcons(icon, document.querySelector('.icon'));

          // change temp to C/F
          degreeSection.addEventListener('click', function(){
            changeUnits(temperature,apparentTemperature);
          });
        })

      // declare reverse geocoding api
      const revapi =`https://us1.locationiq.com/v1/reverse.php?key=pk.623808e23f86a40926f8ecefb0b48b52&lat=${lat}&lon=${long}&format=json`
      console.log(revapi)
      
      // location data
      fetch(revapi)
        .then(response => {
          return response.json();
        })
        .then(revdata => {
          // console.log(revdata);
          const { city, state } = revdata.address;
          // set dom elements from rev api
          locTimezone.textContent = `${city}, ${state}`
        });
    });
  };
  //}else{ // or default it to a location
  //  h1.textContent = 'app requires location services.'
  
  // function set icons
  function setIcons(icon, iconID){
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon])
  }

  // function to switch between F and C
  function changeUnits(temp,feelstemp){
    if(degreeSpan.textContent === "F") {
      // formula for celcius 
      let celcius = (temp - 32) * (5 / 9);
      let feelsCelcius = (feelstemp -32) * (5 / 9);
      degreeSpan.textContent = "C";
      degreeSection.textContent = celcius.toFixed(1); //C to one decimal
      feelSpan.textContent = "C";
      feelsDegrees.textContent = feelsCelcius.toFixed(1); //C to one decimal
    }else{
      degreeSpan.textContent = "F";
      degreeSection.textContent = Math.round(temp); //F to no decimals
      feelSpan.textContent = "F";
      feelsDegrees.textContent = Math.round(feelstemp); //F to no decimals
    }
  }
});