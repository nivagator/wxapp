//get location long and lat
window.addEventListener('load', ()=> {
  let long;
  let lat;
  let tempDescription = document.querySelector('.temp-description');
  let tempDegree = document.querySelector('.temp-degree');
  let locTimezone = document.querySelector('.loc-timezone');
  let degreeSection = document.querySelector('.temp-degree');
  const degreeSpan = document.querySelector('.degree-section span');
  //if location exists in the browser
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
      console.log(position); // show in browser console
      long = position.coords.longitude;
      lat = position.coords.latitude;
      
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/6641aefb61ccf2f202746e2db88500d3/${lat},${long}`;
      
      fetch(api)
        .then(response =>{
          //convert to json
          return response.json();
        })
        .then(data => {
          console.log(data);
          const { temperature, summary, icon } = data.currently;
          //Set DOM elements from the api
          tempDegree.textContent = temperature;
          tempDescription.textContent = summary;
          locTimezone.textContent = data.timezone
          // formula for celcius 
          let celcius = (temperature - 32) * (5 /9)

          //set icon
          setIcons(icon, document.querySelector('.icon'));

          // change temp to C/F
          degreeSection.addEventListener('click', () =>{
            if(degreeSpan.textContent === "F") {
              degreeSpan.textContent = "C";
              degreeSection.textContent = Math.floor(celcius);
            }else{
              degreeSpan.textContent = "F";
              degreeSection.textContent = temperature;
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