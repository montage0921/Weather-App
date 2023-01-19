import "./style.css";

const searchBtn = document.querySelector(`.search-btn`);
const searchBar = document.querySelector(`.search`);
const weatherCard = document.querySelector(`.weather-card`);

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

  const futureWeatherObjPro = handleFutureWeatherData(futureWeatherPro);

  renderWeatherCard(curWeatherObjPro, futureWeatherObjPro, futureHourPro);
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

  const currentObj = {};

  currentObj.city = currentData.location.name;
  currentObj.updateTime = updateTime;
  currentObj.temp = Math.round(currentData.current.temp_c);
  currentObj.feelsLike = Math.round(currentData.current.feelslike_c);
  currentObj.icon = currentData.current.condition.icon;
  currentObj.code = currentData.current.condition.code;
  currentObj.weather = currentData.current.condition.text;
  currentObj.wind = Math.round(currentData.current.wind_kph);
  currentObj.gust = Math.round(currentData.current.gust_kph);
  currentObj.humidity = currentData.current.humidity;

  return currentObj;
}

async function handleFutureWeatherData(future) {
  const futureData = await future;

  const futureArr = [];
  for (let i = 0; i < 4; i++) {
    futureArr.push({
      icon: futureData[i].condition.icon,
      weather: futureData[i].condition.text,
      temperature: Math.round(futureData[i].temp_c),
      feelsLike: Math.round(futureData[i].feelslike_c),
    });
  }

  return futureArr;
}

async function renderWeatherCard(current, future, futureHours) {
  try {
    let htmlText = ``;
    const currentObj = await current;
    const futureArr = await future;
    const futureHoursArr = await futureHours;

    console.log(currentObj);
    console.log(futureArr);
    console.log(futureHoursArr);

    htmlText = `
   
        
    <div class="location">
      <img src="" alt="">
      <p>${currentObj.city}</p>
    </div>
  
   <div class="update-time">
    Updated at ${currentObj.updateTime}
    <input type="checkbox" name="" class="toggle-1">
   </div>
  
  
    <div class="current-weather    ">
      <img src="" alt="" class="weather-symbol" />
      <p class="temp">${currentObj.temp}
        <span class="temp-unit">°C</span>
      </p>
  
      <div class="feels-condition">
        <p class="feels">Feels ${currentObj.feelsLike}</p>
        <p class="weather-condition">${currentObj.weather}</p>
  
      </div>
      
    </div>
  
    <div class="detailed-weather hidden    ">
      <div class="wind">
        <p class="value">${currentObj.wind} <span>km/h</span></p>
        <p class="name">WIND</p>
      </div>
  
      <div class="gust">
        <p class="value" >${currentObj.gust} <span>km/h</span></p>
        <p class="name">WIND GUST</p>
      </div>
  
      <div class="humidity">
        <p class="value">${currentObj.humidity} <span>%</span></p>
        <p class="name">HUMIDITY</p>
      </div>
    </div>
  
  
    <div class="future-weather    ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[0].temperature}
            <span>°</span>
          </p>
        </div>
        <p class="feels">Feels ${futureArr[0].feelsLike}</p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[1].temperature}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[1].feelsLike}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[2].temperature}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[2].feelsLike}</p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[3].temperature}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels  ${futureArr[3].feelsLike}</p>
      </div>
    </div>
  
    <div class="future-weather-table  hidden 
  ">
      <div class="1">
        <p class="time">${futureHoursArr[0]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[0].temperature} <span>°</span></p>
        <p class="description">${futureArr[0].weather} </p>
      </div>
  
      <div class="2">
        <p class="time">${futureHoursArr[1]}</p>
        <img class="symbol"></i>
        <p class="temp">${futureArr[1].temperature} <span>°</span></p>
        <p class="description">${futureArr[1].weather} </p>
      </div>
  
      <div class="3">
        <p class="time">${futureHoursArr[2]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[2].temperature} <span>°</span></p>
        <p class="description">${futureArr[2].weather} </p>
      </div>
  
      <div class="4">
        <p class="time">${futureHoursArr[3]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[3].temperature} <span>°</span></p>
        <p class="description">${futureArr[3].weather} </p>
      </div>
  
    </div>
   
  
     <div class="expandBtn   ">
      <img class="" class="" src="" alt="">
     </div>
  

    `;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `hidden`;
    weatherCard.insertAdjacentHTML(`beforeend`, htmlText);
  } catch (error) {
    let htmlTextError = ` <div class="error-card ">
    <img src="" alt="" />
    <h2>A mystery land is waiting us to explore...</h2>
    <h2>Please try again</h2>
  </div>`;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `visible`;

    weatherCard.insertAdjacentHTML(`beforeend`, htmlTextError);
  }
}

function getUpdateTime() {
  const date = new Date();

  //get update time
  const hour = date.getHours() < 10 ? `0` + date.getHours() : date.getHours();
  const min =
    date.getMinutes() < 10 ? `0` + date.getMinutes() : date.getMinutes();

  const updateTime = hour + ":" + min;
  return updateTime;
}
