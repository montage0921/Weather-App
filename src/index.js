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

  const currentWeatherPro = getCurrentWeather(city);

  const futureWeatherPro = getFutureWeather(city);

  const futureHourPro = getFutureHour(city);

  const curWeatherObjPro = handleCurWeatherData(currentWeatherPro);
});

////////////////////Async function//////////
//////////////////////////////////////////////

//1. fetch current weather data from api
async function getCurrentWeather(city) {
  // get current weather data
  const responseCurrent = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=987f97d506dd4207a9f40954231201&q=${city}&aqi=no`
  );

  const currentWeatherData = await responseCurrent.json();

  return currentWeatherData;
}

//2. fetch future weather data from api
async function getFutureWeather(city) {
  const responseFuture = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=987f97d506dd4207a9f40954231201&q=${city}&days=1&aqi=no&alerts=no`
  );

  const futureWeatherAll = await responseFuture.json();

  const futureWeatherData = futureWeatherAll.forecast.forecastday[0].hour.slice(
    0,
    4
  );

  return futureWeatherData;
}

//3. get geo location info (lat,lng) from api
async function getGeoAPIData(city) {
  const responseGeoCode = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCTnMU5cLNYyQJ93XqxsQf3DZVlnu5RJcE`
  );

  const geoCode = await responseGeoCode.json();

  const { lat, lng } = geoCode.results[0].geometry.location;

  return { lat, lng };
}

//4. get time zone of the city from api
async function getTimeZoneAPI(city) {
  const geoCodePro = await getGeoAPIData(city);
  const futureWeatherPro = await getFutureWeather(city);

  const { lat, lng } = await geoCodePro;

  const futureWeatherData = await futureWeatherPro;

  const timeEpoch = futureWeatherData[0].time_epoch;

  const responseTimeZone = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timeEpoch}&key=AIzaSyCTnMU5cLNYyQJ93XqxsQf3DZVlnu5RJcE`
  );

  const timeZone = await responseTimeZone.json();

  return timeZone;
}

//5. get futureHour
async function getFutureHour(city) {
  const timeZonePro = getTimeZoneAPI(city);
  const timeZone = await timeZonePro;

  let date = new Date();
  let options = { timeZone: timeZone.timeZoneId, hour: `numeric` };
  let formatter = new Intl.DateTimeFormat([], options);

  let currentHour = Number(formatter.format(date).split(` `)[0]);
  let amOrPm = formatter.format(date).split(` `)[1];

  const futureHours = [];

  for (let i = 0; i <= 3; i++) {
    currentHour++;

    if (amOrPm == `AM`) {
      if (currentHour > 12) futureHours[i] = currentHour - 12 + `PM`;
      else if (currentHour == 12) futureHours[i] = `12PM`;
      else futureHours[i] = currentHour + `AM`;
    } else if (amOrPm == `PM`) {
      if (currentHour > 12) futureHours[i] = currentHour - 12 + `AM`;
      else if (currentHour == 12) futureHours[i] = `12AM`;
      else futureHours[i] = currentHour + `PM`;
    }
  }

  return futureHours;
}

//handle weather data

async function handleCurWeatherData(current) {
  const currentData = await current;

  const updateTime = getUpdateTime();
  console.log(currentData);

  const currentObj = {};

  currentObj.currentTemp = Math.round(currentData.current.temp_c);
  currentObj.feelsLike = Math.round(currentData.current.feelslike_c);
  currentObj.icon = currentData.current.condition.icon;
  currentObj.weather = currentData.current.condition.text;

  return currentObj;
}

function getUpdateTime() {
  const date = new Date();

  //get update time
  const hour = date.getHours();
  const min = date.getMinutes();
  const updateTime = hour + ":" + min;
  return updateTime;
}
