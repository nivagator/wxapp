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

  //if location exists in the browser
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
      console.log(position); // show in browser console
      long = position.coords.longitude;
      lat = position.coords.latitude;
      
      // add condition if localhost, use proxy
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/6641aefb61ccf2f202746e2db88500d3/${lat},${long}?exclude=[hourly,minutely]`;
      console.log(api)
      const revapi =`https://us1.locationiq.com/v1/reverse.php?key=d3afc63e6da6d4&lat=${lat}&lon=${long}&format=json`
      console.log(revapi)

      //location data
      fetch(revapi)
        .then(response => {
          return response.json();
        })
        .then(revdata =>{
          console.log(revdata);
          const { city, state } = revdata.address;
          // set dom elements from rev api
          locTimezone.textContent = `${city}, ${state}`
        });
      
      // weather data   
      fetch(api)
        .then(response =>{
          //convert to json
          return response.json();
        })
        .then(data => {
          console.log(data);
          const { temperature, summary, icon, time, apparentTemperature } = data.currently;

          //Set DOM elements from the api
          tempDegree.textContent = Math.round(temperature);
          tempDescription.textContent = summary;
          feelsDegrees.textContent = Math.round(apparentTemperature)
          //locTimezone.textContent = data.timezone

          // formula for celcius 
          let celcius = (temperature - 32) * (5 / 9);
          let feelsCelcius = (apparentTemperature -32) * (5 / 9);

          //set icon
          setIcons(icon, document.querySelector('.icon'));

          // change temp to C/F
          degreeSection.addEventListener('click', () =>{
            if(degreeSpan.textContent === "F") {
              degreeSpan.textContent = "C";
              degreeSection.textContent = celcius.toFixed(1); //C to one decimal
              feelSpan.textContent = "C";
              feelsDegrees.textContent = feelsCelcius.toFixed(1); //C to one decimal
            }else{
              degreeSpan.textContent = "F";
              degreeSection.textContent = Math.round(temperature); //F to no decimals
              feelSpan.textContent = "F";
              feelsDegrees.textContent = Math.round(apparentTemperature); //F to no decimals
            }
          })
        });
    });
  //}else{ // or default it to a location
  //  h1.textContent = 'app requires location services.'
  }
  function setIcons(icon, iconID){
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon])
  }
});