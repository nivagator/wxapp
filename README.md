# wxapp

Simple browser based weather app. Initially created by following [this Dev Ed guide on YouTube](https://www.youtube.com/watch?v=wPElVpR1rwA).  

Uses the [DarkSky API](https://darksky.net/dev) for weather data and [Skycons](https://darkskyapp.github.io/skycons/) for canvas icons. For localhost development, the [CORS-anywhere Heroku app](https://cors-anywhere.herokuapp.com/) is used. 

### Project todo
  - update timezone to display city/state
  - review darksky data and integrate more features 
    - daily/hourly forecast
  - change degree number formatting to no decimals for F and one for C
  - remove dependence on CORS-Anywhere proxy
  - clean javascript code, separate out specific functions from fetch(api)
    - review the [Mozilla developer site for geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) for JS function ideas.
