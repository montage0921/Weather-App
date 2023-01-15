import "./style.css";

const searchBtn = document.querySelector(`.search-btn`);
const searchBar = document.querySelector(`.search`);

const api = `987f97d506dd4207a9f40954231201`;

searchBtn.addEventListener(`click`, function (e) {
  e.preventDefault();

  //validation
  if (searchBar.validity.valueMissing)
    searchBar.setAttribute(`placeholder`, `Enter a city name!!!!`);

  let city = searchBar.value;

  getWeatherData(city);
});

async function getWeatherData(city) {
  // get current weather data
  const responseCurrent = fetch(
    `http://api.weatherapi.com/v1/current.json?key=987f97d506dd4207a9f40954231201&q=${city}&aqi=no`
  );

  // get future weather data
  const responseFuture = fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=987f97d506dd4207a9f40954231201&q=${city}&days=1&aqi=no&alerts=no`
  );

  //get geoCoding (lat,lng) of the city
  // this is used to get correct local time
  const responseGeoCoding = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCTnMU5cLNYyQJ93XqxsQf3DZVlnu5RJcE`
  );

  const responses = await Promise.all([
    responseCurrent,
    responseFuture,
    responseGeoCoding,
  ]);

  const currentWeatherAll = await responses[0].json();
  const futureWeatherAll = await responses[1].json();
  const geoCode = await responses[2].json();

  const { lat, lng } = geoCode.results[0].geometry.location;

  //For future weather, only need for next 4 hours
  const futureWeather = futureWeatherAll.forecast.forecastday[0].hour.slice(
    0,
    4
  );

  // get a city's corresponding time zone
  const responseTimeZone = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${futureWeather[0].time_epoch}&key=AIzaSyCTnMU5cLNYyQJ93XqxsQf3DZVlnu5RJcE`
  );
  const timeZone = await responseTimeZone.json();

  //get time with AM or PM. e.g: 1AM, 5PM...
  let date = new Date();
  let options = { timeZone: timeZone.timeZoneId, hour: `numeric` };
  let formatter = new Intl.DateTimeFormat([], options);

  let currentHour = Number(formatter.format(date).split(` `)[0]);

  const futureHours = [];
  for (let i = 0; i <= 3; i++) {
    currentHour++;
    if (currentHour > 12) futureHours[i] = currentHour - 12 + `PM`;
    else futureHours[i] = currentHour + `AM`;
  }
}
