/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFutureHour": () => (/* binding */ getFutureHour)
/* harmony export */ });
/* harmony import */ var _renderBackground__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderBackground */ "./src/renderBackground.js");
// import "./style.css";



const searchBtn = document.querySelector(`.search-btn`);
const searchBar = document.querySelector(`.search`);
const weatherCard = document.querySelector(`.weather-card`);

const api = `987f97d506dd4207a9f40954231201`;

searchBtn.addEventListener(`click`, function (e) {
  e.preventDefault();

  //validation
  if (searchBar.validity.valueMissing) {
    searchBar.setAttribute(`placeholder`, `Enter a city name!!!!`);

    return;
  }

  let city = searchBar.value;

  const currentWeatherPro = getCurrentWeather(city);

  const futureWeatherPro = getFutureWeather(city);

  const futureHourPro = getFutureHour(city);

  const curWeatherObjPro = handleCurWeatherData(currentWeatherPro);

  const futureWeatherObjPro = handleFutureWeatherData(futureWeatherPro);

  renderWeatherCardC(curWeatherObjPro, futureWeatherObjPro, futureHourPro);

  searchBar.value = ``;
});

weatherCard.addEventListener(`click`, function (e) {
  const city = document.querySelector(`.location p`).textContent;

  const weatherCard = document.querySelector(`.weather-card`);
  const currentWeather = document.querySelector(`.current-weather`);
  const detailedWeather = document.querySelector(`.detailed-weather`);
  const futureWeather = document.querySelector(`.future-weather`);
  const futureWeatherTable = document.querySelector(`.future-weather-table`);
  const expandIcon = document.querySelector(`.expandBtn`);
  const expand = document.querySelector(`.expand`);

  const toggleBtn = e.target;

  const currentWeatherPro = getCurrentWeather(city);

  const futureWeatherPro = getFutureWeather(city);

  const futureHourPro = getFutureHour(city);

  const curWeatherObjPro = handleCurWeatherData(currentWeatherPro);

  const futureWeatherObjPro = handleFutureWeatherData(futureWeatherPro);

  if (e.target.classList.contains(`toggle-1`)) {
    if (weatherCard.classList.contains(`expand`)) {
      if (toggleBtn.checked) {
        console.log(`expand!!!!!! check!!!!`);
        renderWeatherCardFExpand(
          curWeatherObjPro,
          futureWeatherObjPro,
          futureHourPro
        );
      } else if (!toggleBtn.checked) {
        console.log(`expand!!!!!! no check!!!!`);
        renderWeatherCardCExpand(
          curWeatherObjPro,
          futureWeatherObjPro,
          futureHourPro
        );
      }
    } else {
      if (toggleBtn.checked) {
        renderWeatherCardF(
          curWeatherObjPro,
          futureWeatherObjPro,
          futureHourPro
        );
      } else if (!toggleBtn.checked) {
        renderWeatherCardC(
          curWeatherObjPro,
          futureWeatherObjPro,
          futureHourPro
        );
      }
    }
  } else if (e.target.classList.contains(`expand`)) {
    const expandBtn = e.target;

    weatherCard.classList.toggle(`expand`);
    currentWeather.classList.toggle(`expand`);
    detailedWeather.classList.toggle(`hidden`);
    futureWeather.classList.toggle(`hidden`);
    futureWeatherTable.classList.toggle(`hidden`);
    expandIcon.classList.toggle(`expand`);
    expand.classList.toggle(`toggle`);
  }
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
  currentObj.tempF = Math.round(currentData.current.temp_f);
  currentObj.feelsLike = Math.round(currentData.current.feelslike_c);
  currentObj.feelsLikeF = Math.round(currentData.current.feelslike_f);
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
      temperatureF: Math.round(futureData[i].temp_f),
      feelsLike: Math.round(futureData[i].feelslike_c),
      feelsLikeF: Math.round(futureData[i].feelslike_f),
    });
  }

  return futureArr;
}

async function renderWeatherCardC(current, future, futureHours) {
  try {
    let htmlText = ``;
    const currentObj = await current;
    const futureArr = await future;
    const futureHoursArr = await futureHours;

    htmlText = `
    <div class="location">
      <img src="" alt="">
      <p>${currentObj.city}</p>
    </div>
  
   <div class="update-time">
    Updated at ${currentObj.updateTime}
    <input type="checkbox" name="" class="toggle-1">
   </div>
  
  
    <div class="current-weather">
      <img src="" alt="" class="weather-symbol" />
      <p class="temp">${currentObj.temp}
        <span class="temp-unit">°C</span>
      </p>
  
      <div class="feels-condition">
        <p class="feels">Feels ${currentObj.feelsLike} </p>
        <p class="weather-condition">${currentObj.weather}</p>
  
      </div>
      
    </div>
  
    <div class="detailed-weather hidden">
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
  
  
    <div class="future-weather ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[0].temperature}
            <span>°</span>
          </p>
        </div>
        <p class="feels">Feels  ${futureArr[0].feelsLike} </span></p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[1].temperature}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[1].feelsLike} </p>
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
      
        <p class="feels">Feels ${futureArr[3].feelsLike} </p>
      </div>
    </div>
  
    <div class="future-weather-table  hidden 
  ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[0].temperature}<span>°</span></p>
        <p class="description">${futureArr[0].weather}</p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <img class="symbol"></i>
        <p class="temp">${futureArr[1].temperature}<span>°</span></p>
        <p class="description">${futureArr[1].weather}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[2].temperature}<span>°</span></p>
        <p class="description">${futureArr[2].weather}</p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[3].temperature}<span>°</span></p>
        <p class="description">${futureArr[3].weather}</p>
      </div>
  
    </div>
   
  
     <div class="expandBtn">
      <img class="expand" src="" alt="">
     </div>
  

    `;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `hidden`;
    weatherCard.insertAdjacentHTML(`beforeend`, htmlText);

    const currentIcon = document.querySelector(`.current-weather img`);
    currentIcon.style.content = `url(${currentObj.icon})`;

    const futureIcons = document.querySelectorAll(
      `.future-weather .hourly-weather img`
    );

    futureIcons.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    const futureIconsTable = document.querySelectorAll(
      `.future-weather-table .hourly-weather img`
    );

    futureIconsTable.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    (0,_renderBackground__WEBPACK_IMPORTED_MODULE_0__["default"])(currentObj.code, weatherCard);
  } catch (error) {
    let htmlTextError = ` <div class="error-card ">
    <img src="" alt="" />
    <h2>A mystery land is waiting us to explore...</h2>
    <h2>Please try again</h2>
  </div>`;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `visible`;
    weatherCard.style.backgroundImage = `none`;

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

async function renderWeatherCardF(current, future, futureHours) {
  try {
    let htmlText = ``;
    const currentObj = await current;
    const futureArr = await future;
    const futureHoursArr = await futureHours;

    htmlText = `
   
        
    <div class="location">
      <img src="" alt="">
      <p>${currentObj.city}</p>
    </div>
  
   <div class="update-time">
    Updated at ${currentObj.updateTime}
    <input type="checkbox" checked="false" name="" class="toggle-1">
   </div>
  
  
    <div class="current-weather ">
      <img src="" alt="" class="weather-symbol" />
      <p class="temp">${currentObj.tempF}
        <span class="temp-unit">°F</span>
      </p>
  
      <div class="feels-condition">
        <p class="feels">Feels ${currentObj.feelsLikeF} </p>
        <p class="weather-condition">${currentObj.weather}</p>
  
      </div>
      
    </div>
  
    <div class="detailed-weather hidden">
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
  
  
    <div class="future-weather">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[0].temperatureF}
            <span>°</span>
          </p>
        </div>
        <p class="feels">Feels ${futureArr[0].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[1].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[1].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[2].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[2].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[3].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[3].feelsLikeF}</p>
      </div>
    </div>
  
    <div class="future-weather-table  hidden 
  ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[0].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[0].weather} </p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <img class="symbol"></i>
        <p class="temp">${futureArr[1].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[1].weather}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[2].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[2].weather} </p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[3].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[3].weather} </p>
      </div>
  
    </div>
   
  
     <div class="expandBtn">
      <img class="expand" src="" alt="">
     </div>
  

    `;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `hidden`;
    weatherCard.insertAdjacentHTML(`beforeend`, htmlText);

    const currentIcon = document.querySelector(`.current-weather img`);
    currentIcon.style.content = `url(${currentObj.icon})`;

    const futureIcons = document.querySelectorAll(
      `.future-weather .hourly-weather img`
    );

    futureIcons.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    const futureIconsTable = document.querySelectorAll(
      `.future-weather-table .hourly-weather img`
    );

    futureIconsTable.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    (0,_renderBackground__WEBPACK_IMPORTED_MODULE_0__["default"])(currentObj.code, weatherCard);
  } catch (error) {
    let htmlTextError = ` <div class="error-card ">
    <img src="" alt="" />
    <h2>A mystery land is waiting us to explore...</h2>
    <h2>Please try again</h2>
  </div>`;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `visible`;
    weatherCard.style.backgroundImage = `none`;

    weatherCard.insertAdjacentHTML(`beforeend`, htmlTextError);
  }
}

async function renderWeatherCardFExpand(current, future, futureHours) {
  try {
    let htmlText = ``;
    const currentObj = await current;
    const futureArr = await future;
    const futureHoursArr = await futureHours;

    htmlText = `
   
        
    <div class="location">
      <img src="" alt="">
      <p>${currentObj.city}</p>
    </div>
  
   <div class="update-time">
    Updated at ${currentObj.updateTime}
    <input type="checkbox" checked="false" name="" class="toggle-1">
   </div>
  
  
    <div class="current-weather expand">
      <img src="" alt="" class="weather-symbol" />
      <p class="temp">${currentObj.tempF}
        <span class="temp-unit">°F</span>
      </p>
  
      <div class="feels-condition">
        <p class="feels">Feels ${currentObj.feelsLikeF} </p>
        <p class="weather-condition">${currentObj.weather}</p>
  
      </div>
      
    </div>
  
    <div class="detailed-weather ">
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
  
  
    <div class="future-weather hidden">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[0].temperatureF}
            <span>°</span>
          </p>
        </div>
        <p class="feels">Feels ${futureArr[0].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[1].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[1].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[2].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[2].feelsLikeF}</p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <div class="weather-temp">
          <img class="weather-symbol"></img>
          <p class="temp">${futureArr[3].temperatureF}
            <span>°</span>
          </p>
        </div>
      
        <p class="feels">Feels ${futureArr[3].feelsLikeF}</p>
      </div>
    </div>
  
    <div class="future-weather-table   
  ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[0].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[0].weather} </p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <img class="symbol"></i>
        <p class="temp">${futureArr[1].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[1].weather}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[2].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[2].weather} </p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[3].temperatureF} <span>°</span></p>
        <p class="description">${futureArr[3].weather} </p>
      </div>
  
    </div>
   
  
     <div class="expandBtn expand">
      <img class="expand toggle" src="" alt="">
     </div>
  

    `;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `hidden`;
    weatherCard.insertAdjacentHTML(`beforeend`, htmlText);

    const currentIcon = document.querySelector(`.current-weather img`);
    currentIcon.style.content = `url(${currentObj.icon})`;

    const futureIcons = document.querySelectorAll(
      `.future-weather .hourly-weather img`
    );

    futureIcons.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    const futureIconsTable = document.querySelectorAll(
      `.future-weather-table .hourly-weather img`
    );

    futureIconsTable.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    (0,_renderBackground__WEBPACK_IMPORTED_MODULE_0__["default"])(currentObj.code, weatherCard);
  } catch (error) {
    let htmlTextError = ` <div class="error-card ">
    <img src="" alt="" />
    <h2>A mystery land is waiting us to explore...</h2>
    <h2>Please try again</h2>
  </div>`;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `visible`;
    weatherCard.style.backgroundImage = `none`;

    weatherCard.insertAdjacentHTML(`beforeend`, htmlTextError);
  }
}

async function renderWeatherCardCExpand(current, future, futureHours) {
  try {
    let htmlText = ``;
    const currentObj = await current;
    const futureArr = await future;
    const futureHoursArr = await futureHours;

    htmlText = `
   
        
    <div class="location">
      <img src="" alt="">
      <p>${currentObj.city}</p>
    </div>
  
   <div class="update-time">
    Updated at ${currentObj.updateTime}
    <input type="checkbox" name="" class="toggle-1">
   </div>
  
  
    <div class="current-weather expand">
      <img src="" alt="" class="weather-symbol" />
      <p class="temp">${currentObj.temp}
        <span class="temp-unit">°F</span>
      </p>
  
      <div class="feels-condition">
        <p class="feels">Feels ${currentObj.feelsLike} </p>
        <p class="weather-condition">${currentObj.weather}</p>
  
      </div>
      
    </div>
  
    <div class="detailed-weather ">
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
  
  
    <div class="future-weather hidden">
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
      
        <p class="feels">Feels ${futureArr[3].feelsLike}</p>
      </div>
    </div>
  
    <div class="future-weather-table   
  ">
      <div class="hourly-weather 1">
        <p class="time">${futureHoursArr[0]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[0].temperature} <span>°</span></p>
        <p class="description">${futureArr[0].weather} </p>
      </div>
  
      <div class="hourly-weather 2">
        <p class="time">${futureHoursArr[1]}</p>
        <img class="symbol"></i>
        <p class="temp">${futureArr[1].temperature} <span>°</span></p>
        <p class="description">${futureArr[1].weather}</p>
      </div>
  
      <div class="hourly-weather 3">
        <p class="time">${futureHoursArr[2]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[2].temperature} <span>°</span></p>
        <p class="description">${futureArr[2].weather} </p>
      </div>
  
      <div class="hourly-weather 4">
        <p class="time">${futureHoursArr[3]}</p>
        <img class="symbol"></img>
        <p class="temp">${futureArr[3].temperature} <span>°</span></p>
        <p class="description">${futureArr[3].weather} </p>
      </div>
  
    </div>
   
  
     <div class="expandBtn expand">
      <img class="expand toggle" src="" alt="">
     </div>
  

    `;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `hidden`;
    weatherCard.insertAdjacentHTML(`beforeend`, htmlText);

    const currentIcon = document.querySelector(`.current-weather img`);
    currentIcon.style.content = `url(${currentObj.icon})`;

    const futureIcons = document.querySelectorAll(
      `.future-weather .hourly-weather img`
    );

    futureIcons.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    const futureIconsTable = document.querySelectorAll(
      `.future-weather-table .hourly-weather img`
    );

    futureIconsTable.forEach(
      (icon, i) => (icon.style.content = `url(${futureArr[i].icon})`)
    );

    (0,_renderBackground__WEBPACK_IMPORTED_MODULE_0__["default"])(currentObj.code, weatherCard);
  } catch (error) {
    let htmlTextError = ` <div class="error-card ">
    <img src="" alt="" />
    <h2>A mystery land is waiting us to explore...</h2>
    <h2>Please try again</h2>
  </div>`;

    weatherCard.innerHTML = ``;
    weatherCard.style.overflow = `visible`;
    weatherCard.style.backgroundImage = `none`;

    weatherCard.insertAdjacentHTML(`beforeend`, htmlTextError);
  }
}


/***/ }),

/***/ "./src/renderBackground.js":
/*!*********************************!*\
  !*** ./src/renderBackground.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.js");


function renderBackgroundImg(code, weatherCard, time, feelsFont) {
  switch (code) {
    case 1000:
      weatherCard.style.backgroundImage = `url(assets/clear-sky.jpg)`;
      break;

    case 1003:
      weatherCard.style.backgroundImage = `url(assets/few-clouds.jpg)`;
      break;

    case 1006:
      weatherCard.style.backgroundImage = `url(assets/scattered-clouds.jpg)`;
      break;

    case 1009:
    case 1063:
    case 1066:
    case 1069:
    case 1072:
    case 1087:
      weatherCard.style.backgroundImage = `url(assets/broken-clouds.jpg)`;
      break;

    case 1030:
    case 1135:
    case 1147:
      weatherCard.style.backgroundImage = `url(assets/mist.jpg)`;
      break;

    case 1114:
      weatherCard.style.backgroundImage = `url(assets/blowing-snow.jpg)`;
      break;

    case 1117:
    case 1222:
    case 1225:
    case 1252:
      weatherCard.style.backgroundImage = `url(assets/blizzard.jpg)`;
      break;

    case 1150:
    case 1153:
    case 1168:
    case 1171:
    case 1180:
    case 1183:
    case 1240:
      weatherCard.style.backgroundImage = `url(assets/shower-rain.jpg)`;
      weatherCard.style.color = `black`;

      break;

    case 1186:
    case 1189:
    case 1198:
    case 1243:
      weatherCard.style.backgroundImage = `url(assets/rain.jpg)`;
      break;

    case 1192:
    case 1195:
    case 1201:
    case 1246:
      weatherCard.style.backgroundImage = `url(assets/heavy-rain.jpg)`;
      break;

    case 1204:
    case 1210:
    case 1213:
    case 1249:
    case 1255:
      weatherCard.style.backgroundImage = `url(assets/light-snow.jpg)`;
      break;

    case 1207:
    case 1216:
    case 1219:
    case 1258:
      weatherCard.style.backgroundImage = `url(assets/snow.jpg)`;
      break;

    case 1237:
    case 1261:
    case 1264:
      weatherCard.style.backgroundImage = `url(assets/hail.jpg)`;
      break;

    case 1273:
    case 1276:
    case 1279:
    case 1282:
      weatherCard.style.backgroundImage = `url(assets/thunderstorm.jpg)`;
      break;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderBackgroundImg);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9yZW5kZXJCYWNrZ3JvdW5kLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQgcmVuZGVyQmFja2dyb3VuZEltZyBmcm9tIFwiLi9yZW5kZXJCYWNrZ3JvdW5kXCI7XG5pbXBvcnQgeyB0ZSB9IGZyb20gXCJkYXRlLWZucy9sb2NhbGVcIjtcblxuY29uc3Qgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnNlYXJjaC1idG5gKTtcbmNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5zZWFyY2hgKTtcbmNvbnN0IHdlYXRoZXJDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLndlYXRoZXItY2FyZGApO1xuXG5jb25zdCBhcGkgPSBgOTg3Zjk3ZDUwNmRkNDIwN2E5ZjQwOTU0MjMxMjAxYDtcblxuc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgZnVuY3Rpb24gKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIC8vdmFsaWRhdGlvblxuICBpZiAoc2VhcmNoQmFyLnZhbGlkaXR5LnZhbHVlTWlzc2luZykge1xuICAgIHNlYXJjaEJhci5zZXRBdHRyaWJ1dGUoYHBsYWNlaG9sZGVyYCwgYEVudGVyIGEgY2l0eSBuYW1lISEhIWApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGNpdHkgPSBzZWFyY2hCYXIudmFsdWU7XG5cbiAgY29uc3QgY3VycmVudFdlYXRoZXJQcm8gPSBnZXRDdXJyZW50V2VhdGhlcihjaXR5KTtcblxuICBjb25zdCBmdXR1cmVXZWF0aGVyUHJvID0gZ2V0RnV0dXJlV2VhdGhlcihjaXR5KTtcblxuICBjb25zdCBmdXR1cmVIb3VyUHJvID0gZ2V0RnV0dXJlSG91cihjaXR5KTtcblxuICBjb25zdCBjdXJXZWF0aGVyT2JqUHJvID0gaGFuZGxlQ3VyV2VhdGhlckRhdGEoY3VycmVudFdlYXRoZXJQcm8pO1xuXG4gIGNvbnN0IGZ1dHVyZVdlYXRoZXJPYmpQcm8gPSBoYW5kbGVGdXR1cmVXZWF0aGVyRGF0YShmdXR1cmVXZWF0aGVyUHJvKTtcblxuICByZW5kZXJXZWF0aGVyQ2FyZEMoY3VyV2VhdGhlck9ialBybywgZnV0dXJlV2VhdGhlck9ialBybywgZnV0dXJlSG91clBybyk7XG5cbiAgc2VhcmNoQmFyLnZhbHVlID0gYGA7XG59KTtcblxud2VhdGhlckNhcmQuYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBmdW5jdGlvbiAoZSkge1xuICBjb25zdCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmxvY2F0aW9uIHBgKS50ZXh0Q29udGVudDtcblxuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC53ZWF0aGVyLWNhcmRgKTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY3VycmVudC13ZWF0aGVyYCk7XG4gIGNvbnN0IGRldGFpbGVkV2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5kZXRhaWxlZC13ZWF0aGVyYCk7XG4gIGNvbnN0IGZ1dHVyZVdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZnV0dXJlLXdlYXRoZXJgKTtcbiAgY29uc3QgZnV0dXJlV2VhdGhlclRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmZ1dHVyZS13ZWF0aGVyLXRhYmxlYCk7XG4gIGNvbnN0IGV4cGFuZEljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZXhwYW5kQnRuYCk7XG4gIGNvbnN0IGV4cGFuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5leHBhbmRgKTtcblxuICBjb25zdCB0b2dnbGVCdG4gPSBlLnRhcmdldDtcblxuICBjb25zdCBjdXJyZW50V2VhdGhlclBybyA9IGdldEN1cnJlbnRXZWF0aGVyKGNpdHkpO1xuXG4gIGNvbnN0IGZ1dHVyZVdlYXRoZXJQcm8gPSBnZXRGdXR1cmVXZWF0aGVyKGNpdHkpO1xuXG4gIGNvbnN0IGZ1dHVyZUhvdXJQcm8gPSBnZXRGdXR1cmVIb3VyKGNpdHkpO1xuXG4gIGNvbnN0IGN1cldlYXRoZXJPYmpQcm8gPSBoYW5kbGVDdXJXZWF0aGVyRGF0YShjdXJyZW50V2VhdGhlclBybyk7XG5cbiAgY29uc3QgZnV0dXJlV2VhdGhlck9ialBybyA9IGhhbmRsZUZ1dHVyZVdlYXRoZXJEYXRhKGZ1dHVyZVdlYXRoZXJQcm8pO1xuXG4gIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoYHRvZ2dsZS0xYCkpIHtcbiAgICBpZiAod2VhdGhlckNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKGBleHBhbmRgKSkge1xuICAgICAgaWYgKHRvZ2dsZUJ0bi5jaGVja2VkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBleHBhbmQhISEhISEgY2hlY2shISEhYCk7XG4gICAgICAgIHJlbmRlcldlYXRoZXJDYXJkRkV4cGFuZChcbiAgICAgICAgICBjdXJXZWF0aGVyT2JqUHJvLFxuICAgICAgICAgIGZ1dHVyZVdlYXRoZXJPYmpQcm8sXG4gICAgICAgICAgZnV0dXJlSG91clByb1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICghdG9nZ2xlQnRuLmNoZWNrZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGV4cGFuZCEhISEhISBubyBjaGVjayEhISFgKTtcbiAgICAgICAgcmVuZGVyV2VhdGhlckNhcmRDRXhwYW5kKFxuICAgICAgICAgIGN1cldlYXRoZXJPYmpQcm8sXG4gICAgICAgICAgZnV0dXJlV2VhdGhlck9ialBybyxcbiAgICAgICAgICBmdXR1cmVIb3VyUHJvXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0b2dnbGVCdG4uY2hlY2tlZCkge1xuICAgICAgICByZW5kZXJXZWF0aGVyQ2FyZEYoXG4gICAgICAgICAgY3VyV2VhdGhlck9ialBybyxcbiAgICAgICAgICBmdXR1cmVXZWF0aGVyT2JqUHJvLFxuICAgICAgICAgIGZ1dHVyZUhvdXJQcm9cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRvZ2dsZUJ0bi5jaGVja2VkKSB7XG4gICAgICAgIHJlbmRlcldlYXRoZXJDYXJkQyhcbiAgICAgICAgICBjdXJXZWF0aGVyT2JqUHJvLFxuICAgICAgICAgIGZ1dHVyZVdlYXRoZXJPYmpQcm8sXG4gICAgICAgICAgZnV0dXJlSG91clByb1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoYGV4cGFuZGApKSB7XG4gICAgY29uc3QgZXhwYW5kQnRuID0gZS50YXJnZXQ7XG5cbiAgICB3ZWF0aGVyQ2FyZC5jbGFzc0xpc3QudG9nZ2xlKGBleHBhbmRgKTtcbiAgICBjdXJyZW50V2VhdGhlci5jbGFzc0xpc3QudG9nZ2xlKGBleHBhbmRgKTtcbiAgICBkZXRhaWxlZFdlYXRoZXIuY2xhc3NMaXN0LnRvZ2dsZShgaGlkZGVuYCk7XG4gICAgZnV0dXJlV2VhdGhlci5jbGFzc0xpc3QudG9nZ2xlKGBoaWRkZW5gKTtcbiAgICBmdXR1cmVXZWF0aGVyVGFibGUuY2xhc3NMaXN0LnRvZ2dsZShgaGlkZGVuYCk7XG4gICAgZXhwYW5kSWNvbi5jbGFzc0xpc3QudG9nZ2xlKGBleHBhbmRgKTtcbiAgICBleHBhbmQuY2xhc3NMaXN0LnRvZ2dsZShgdG9nZ2xlYCk7XG4gIH1cbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vL0FzeW5jIGZ1bmN0aW9uLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLzEuIGZldGNoIGN1cnJlbnQgd2VhdGhlciBkYXRhIGZyb20gYXBpXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcihjaXR5KSB7XG4gIC8vIGdldCBjdXJyZW50IHdlYXRoZXIgZGF0YVxuICBjb25zdCByZXNwb25zZUN1cnJlbnQgPSBhd2FpdCBmZXRjaChcbiAgICBgaHR0cDovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9jdXJyZW50Lmpzb24/a2V5PTk4N2Y5N2Q1MDZkZDQyMDdhOWY0MDk1NDIzMTIwMSZxPSR7Y2l0eX0mYXFpPW5vYFxuICApO1xuXG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlQ3VycmVudC5qc29uKCk7XG5cbiAgcmV0dXJuIGN1cnJlbnRXZWF0aGVyRGF0YTtcbn1cblxuLy8yLiBmZXRjaCBmdXR1cmUgd2VhdGhlciBkYXRhIGZyb20gYXBpXG5hc3luYyBmdW5jdGlvbiBnZXRGdXR1cmVXZWF0aGVyKGNpdHkpIHtcbiAgY29uc3QgcmVzcG9uc2VGdXR1cmUgPSBhd2FpdCBmZXRjaChcbiAgICBgaHR0cDovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT05ODdmOTdkNTA2ZGQ0MjA3YTlmNDA5NTQyMzEyMDEmcT0ke2NpdHl9JmRheXM9MSZhcWk9bm8mYWxlcnRzPW5vYFxuICApO1xuXG4gIGNvbnN0IGZ1dHVyZVdlYXRoZXJBbGwgPSBhd2FpdCByZXNwb25zZUZ1dHVyZS5qc29uKCk7XG5cbiAgY29uc3QgZnV0dXJlV2VhdGhlckRhdGEgPSBmdXR1cmVXZWF0aGVyQWxsLmZvcmVjYXN0LmZvcmVjYXN0ZGF5WzBdLmhvdXIuc2xpY2UoXG4gICAgMCxcbiAgICA0XG4gICk7XG5cbiAgcmV0dXJuIGZ1dHVyZVdlYXRoZXJEYXRhO1xufVxuXG4vLzMuIGdldCBnZW8gbG9jYXRpb24gaW5mbyAobGF0LGxuZykgZnJvbSBhcGlcbmFzeW5jIGZ1bmN0aW9uIGdldEdlb0FQSURhdGEoY2l0eSkge1xuICBjb25zdCByZXNwb25zZUdlb0NvZGUgPSBhd2FpdCBmZXRjaChcbiAgICBgaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPSR7Y2l0eX0ma2V5PUFJemFTeUNUbk1VNWNMTll5UUo5M1hxeHNRZjNEWlZsbnU1UkpjRWBcbiAgKTtcblxuICBjb25zdCBnZW9Db2RlID0gYXdhaXQgcmVzcG9uc2VHZW9Db2RlLmpzb24oKTtcblxuICBjb25zdCB7IGxhdCwgbG5nIH0gPSBnZW9Db2RlLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb247XG5cbiAgcmV0dXJuIHsgbGF0LCBsbmcgfTtcbn1cblxuLy80LiBnZXQgdGltZSB6b25lIG9mIHRoZSBjaXR5IGZyb20gYXBpXG5hc3luYyBmdW5jdGlvbiBnZXRUaW1lWm9uZUFQSShjaXR5KSB7XG4gIGNvbnN0IGdlb0NvZGVQcm8gPSBhd2FpdCBnZXRHZW9BUElEYXRhKGNpdHkpO1xuICBjb25zdCBmdXR1cmVXZWF0aGVyUHJvID0gYXdhaXQgZ2V0RnV0dXJlV2VhdGhlcihjaXR5KTtcblxuICBjb25zdCB7IGxhdCwgbG5nIH0gPSBhd2FpdCBnZW9Db2RlUHJvO1xuXG4gIGNvbnN0IGZ1dHVyZVdlYXRoZXJEYXRhID0gYXdhaXQgZnV0dXJlV2VhdGhlclBybztcblxuICBjb25zdCB0aW1lRXBvY2ggPSBmdXR1cmVXZWF0aGVyRGF0YVswXS50aW1lX2Vwb2NoO1xuXG4gIGNvbnN0IHJlc3BvbnNlVGltZVpvbmUgPSBhd2FpdCBmZXRjaChcbiAgICBgaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3RpbWV6b25lL2pzb24/bG9jYXRpb249JHtsYXR9JTJDJHtsbmd9JnRpbWVzdGFtcD0ke3RpbWVFcG9jaH0ma2V5PUFJemFTeUNUbk1VNWNMTll5UUo5M1hxeHNRZjNEWlZsbnU1UkpjRWBcbiAgKTtcblxuICBjb25zdCB0aW1lWm9uZSA9IGF3YWl0IHJlc3BvbnNlVGltZVpvbmUuanNvbigpO1xuXG4gIHJldHVybiB0aW1lWm9uZTtcbn1cblxuLy81LiBnZXQgZnV0dXJlSG91clxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEZ1dHVyZUhvdXIoY2l0eSkge1xuICBjb25zdCB0aW1lWm9uZVBybyA9IGdldFRpbWVab25lQVBJKGNpdHkpO1xuICBjb25zdCB0aW1lWm9uZSA9IGF3YWl0IHRpbWVab25lUHJvO1xuXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgbGV0IG9wdGlvbnMgPSB7IHRpbWVab25lOiB0aW1lWm9uZS50aW1lWm9uZUlkLCBob3VyOiBgbnVtZXJpY2AgfTtcbiAgbGV0IGZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFtdLCBvcHRpb25zKTtcblxuICBsZXQgY3VycmVudEhvdXIgPSBOdW1iZXIoZm9ybWF0dGVyLmZvcm1hdChkYXRlKS5zcGxpdChgIGApWzBdKTtcblxuICBsZXQgYW1PclBtID0gZm9ybWF0dGVyLmZvcm1hdChkYXRlKS5zcGxpdChgIGApWzFdO1xuXG4gIGNvbnN0IGZ1dHVyZUhvdXJzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gMzsgaSsrKSB7XG4gICAgY3VycmVudEhvdXIrKztcblxuICAgIGlmIChhbU9yUG0gPT0gYEFNYCkge1xuICAgICAgaWYgKGN1cnJlbnRIb3VyID4gMTIpIGZ1dHVyZUhvdXJzW2ldID0gY3VycmVudEhvdXIgLSAxMiArIGBQTWA7XG4gICAgICBlbHNlIGlmIChjdXJyZW50SG91ciA9PSAxMikgZnV0dXJlSG91cnNbaV0gPSBgMTJQTWA7XG4gICAgICBlbHNlIGZ1dHVyZUhvdXJzW2ldID0gY3VycmVudEhvdXIgKyBgQU1gO1xuICAgIH0gZWxzZSBpZiAoYW1PclBtID09IGBQTWApIHtcbiAgICAgIGlmIChjdXJyZW50SG91ciA+IDEyKSBmdXR1cmVIb3Vyc1tpXSA9IGN1cnJlbnRIb3VyIC0gMTIgKyBgQU1gO1xuICAgICAgZWxzZSBpZiAoY3VycmVudEhvdXIgPT0gMTIpIGZ1dHVyZUhvdXJzW2ldID0gYDEyQU1gO1xuICAgICAgZWxzZSBmdXR1cmVIb3Vyc1tpXSA9IGN1cnJlbnRIb3VyICsgYFBNYDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnV0dXJlSG91cnM7XG59XG5cbi8vaGFuZGxlIHdlYXRoZXIgZGF0YVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVDdXJXZWF0aGVyRGF0YShjdXJyZW50KSB7XG4gIGNvbnN0IGN1cnJlbnREYXRhID0gYXdhaXQgY3VycmVudDtcblxuICBjb25zdCB1cGRhdGVUaW1lID0gZ2V0VXBkYXRlVGltZSgpO1xuXG4gIGNvbnN0IGN1cnJlbnRPYmogPSB7fTtcblxuICBjdXJyZW50T2JqLmNpdHkgPSBjdXJyZW50RGF0YS5sb2NhdGlvbi5uYW1lO1xuICBjdXJyZW50T2JqLnVwZGF0ZVRpbWUgPSB1cGRhdGVUaW1lO1xuICBjdXJyZW50T2JqLnRlbXAgPSBNYXRoLnJvdW5kKGN1cnJlbnREYXRhLmN1cnJlbnQudGVtcF9jKTtcbiAgY3VycmVudE9iai50ZW1wRiA9IE1hdGgucm91bmQoY3VycmVudERhdGEuY3VycmVudC50ZW1wX2YpO1xuICBjdXJyZW50T2JqLmZlZWxzTGlrZSA9IE1hdGgucm91bmQoY3VycmVudERhdGEuY3VycmVudC5mZWVsc2xpa2VfYyk7XG4gIGN1cnJlbnRPYmouZmVlbHNMaWtlRiA9IE1hdGgucm91bmQoY3VycmVudERhdGEuY3VycmVudC5mZWVsc2xpa2VfZik7XG4gIGN1cnJlbnRPYmouaWNvbiA9IGN1cnJlbnREYXRhLmN1cnJlbnQuY29uZGl0aW9uLmljb247XG4gIGN1cnJlbnRPYmouY29kZSA9IGN1cnJlbnREYXRhLmN1cnJlbnQuY29uZGl0aW9uLmNvZGU7XG4gIGN1cnJlbnRPYmoud2VhdGhlciA9IGN1cnJlbnREYXRhLmN1cnJlbnQuY29uZGl0aW9uLnRleHQ7XG4gIGN1cnJlbnRPYmoud2luZCA9IE1hdGgucm91bmQoY3VycmVudERhdGEuY3VycmVudC53aW5kX2twaCk7XG4gIGN1cnJlbnRPYmouZ3VzdCA9IE1hdGgucm91bmQoY3VycmVudERhdGEuY3VycmVudC5ndXN0X2twaCk7XG4gIGN1cnJlbnRPYmouaHVtaWRpdHkgPSBjdXJyZW50RGF0YS5jdXJyZW50Lmh1bWlkaXR5O1xuXG4gIHJldHVybiBjdXJyZW50T2JqO1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVGdXR1cmVXZWF0aGVyRGF0YShmdXR1cmUpIHtcbiAgY29uc3QgZnV0dXJlRGF0YSA9IGF3YWl0IGZ1dHVyZTtcblxuICBjb25zdCBmdXR1cmVBcnIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICBmdXR1cmVBcnIucHVzaCh7XG4gICAgICBpY29uOiBmdXR1cmVEYXRhW2ldLmNvbmRpdGlvbi5pY29uLFxuICAgICAgd2VhdGhlcjogZnV0dXJlRGF0YVtpXS5jb25kaXRpb24udGV4dCxcbiAgICAgIHRlbXBlcmF0dXJlOiBNYXRoLnJvdW5kKGZ1dHVyZURhdGFbaV0udGVtcF9jKSxcbiAgICAgIHRlbXBlcmF0dXJlRjogTWF0aC5yb3VuZChmdXR1cmVEYXRhW2ldLnRlbXBfZiksXG4gICAgICBmZWVsc0xpa2U6IE1hdGgucm91bmQoZnV0dXJlRGF0YVtpXS5mZWVsc2xpa2VfYyksXG4gICAgICBmZWVsc0xpa2VGOiBNYXRoLnJvdW5kKGZ1dHVyZURhdGFbaV0uZmVlbHNsaWtlX2YpLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZ1dHVyZUFycjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyV2VhdGhlckNhcmRDKGN1cnJlbnQsIGZ1dHVyZSwgZnV0dXJlSG91cnMpIHtcbiAgdHJ5IHtcbiAgICBsZXQgaHRtbFRleHQgPSBgYDtcbiAgICBjb25zdCBjdXJyZW50T2JqID0gYXdhaXQgY3VycmVudDtcbiAgICBjb25zdCBmdXR1cmVBcnIgPSBhd2FpdCBmdXR1cmU7XG4gICAgY29uc3QgZnV0dXJlSG91cnNBcnIgPSBhd2FpdCBmdXR1cmVIb3VycztcblxuICAgIGh0bWxUZXh0ID0gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIj5cbiAgICAgIDxwPiR7Y3VycmVudE9iai5jaXR5fTwvcD5cbiAgICA8L2Rpdj5cbiAgXG4gICA8ZGl2IGNsYXNzPVwidXBkYXRlLXRpbWVcIj5cbiAgICBVcGRhdGVkIGF0ICR7Y3VycmVudE9iai51cGRhdGVUaW1lfVxuICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiXCIgY2xhc3M9XCJ0b2dnbGUtMVwiPlxuICAgPC9kaXY+XG4gIFxuICBcbiAgICA8ZGl2IGNsYXNzPVwiY3VycmVudC13ZWF0aGVyXCI+XG4gICAgICA8aW1nIHNyYz1cIlwiIGFsdD1cIlwiIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIiAvPlxuICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtjdXJyZW50T2JqLnRlbXB9XG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGVtcC11bml0XCI+wrBDPC9zcGFuPlxuICAgICAgPC9wPlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJmZWVscy1jb25kaXRpb25cIj5cbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7Y3VycmVudE9iai5mZWVsc0xpa2V9IDwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJ3ZWF0aGVyLWNvbmRpdGlvblwiPiR7Y3VycmVudE9iai53ZWF0aGVyfTwvcD5cbiAgXG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgIDwvZGl2PlxuICBcbiAgICA8ZGl2IGNsYXNzPVwiZGV0YWlsZWQtd2VhdGhlciBoaWRkZW5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3aW5kXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIj4ke2N1cnJlbnRPYmoud2luZH0gPHNwYW4+a20vaDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibmFtZVwiPldJTkQ8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiZ3VzdFwiPlxuICAgICAgICA8cCBjbGFzcz1cInZhbHVlXCIgPiR7Y3VycmVudE9iai5ndXN0fSA8c3Bhbj5rbS9oPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJuYW1lXCI+V0lORCBHVVNUPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImh1bWlkaXR5XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIj4ke2N1cnJlbnRPYmouaHVtaWRpdHl9IDxzcGFuPiU8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5IVU1JRElUWTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBcbiAgXG4gICAgPGRpdiBjbGFzcz1cImZ1dHVyZS13ZWF0aGVyIFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDFcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclswXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclswXS50ZW1wZXJhdHVyZX1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwIGNsYXNzPVwiZmVlbHNcIj5GZWVscyAgJHtmdXR1cmVBcnJbMF0uZmVlbHNMaWtlfSA8L3NwYW4+PC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDJcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclsxXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsxXS50ZW1wZXJhdHVyZX1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzFdLmZlZWxzTGlrZX0gPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDNcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclsyXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsyXS50ZW1wZXJhdHVyZX1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzJdLmZlZWxzTGlrZX08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgNFwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzNdfTwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItdGVtcFwiPlxuICAgICAgICAgIDxpbWcgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiPjwvaW1nPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzNdLnRlbXBlcmF0dXJlfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtmdXR1cmVBcnJbM10uZmVlbHNMaWtlfSA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgXG4gICAgPGRpdiBjbGFzcz1cImZ1dHVyZS13ZWF0aGVyLXRhYmxlICBoaWRkZW4gXG4gIFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDFcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclswXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2ltZz5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMF0udGVtcGVyYXR1cmV9PHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMF0ud2VhdGhlcn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgMlwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzFdfTwvcD5cbiAgICAgICAgPGltZyBjbGFzcz1cInN5bWJvbFwiPjwvaT5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMV0udGVtcGVyYXR1cmV9PHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMV0ud2VhdGhlcn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgM1wiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzJdfTwvcD5cbiAgICAgICAgPGltZyBjbGFzcz1cInN5bWJvbFwiPjwvaW1nPlxuICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsyXS50ZW1wZXJhdHVyZX08c3Bhbj7CsDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Z1dHVyZUFyclsyXS53ZWF0aGVyfTwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciA0XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbM119PC9wPlxuICAgICAgICA8aW1nIGNsYXNzPVwic3ltYm9sXCI+PC9pbWc+XG4gICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzNdLnRlbXBlcmF0dXJlfTxzcGFuPsKwPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPiR7ZnV0dXJlQXJyWzNdLndlYXRoZXJ9PC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgIDwvZGl2PlxuICAgXG4gIFxuICAgICA8ZGl2IGNsYXNzPVwiZXhwYW5kQnRuXCI+XG4gICAgICA8aW1nIGNsYXNzPVwiZXhwYW5kXCIgc3JjPVwiXCIgYWx0PVwiXCI+XG4gICAgIDwvZGl2PlxuICBcblxuICAgIGA7XG5cbiAgICB3ZWF0aGVyQ2FyZC5pbm5lckhUTUwgPSBgYDtcbiAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5vdmVyZmxvdyA9IGBoaWRkZW5gO1xuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHQpO1xuXG4gICAgY29uc3QgY3VycmVudEljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY3VycmVudC13ZWF0aGVyIGltZ2ApO1xuICAgIGN1cnJlbnRJY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7Y3VycmVudE9iai5pY29ufSlgO1xuXG4gICAgY29uc3QgZnV0dXJlSWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlciAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29ucy5mb3JFYWNoKFxuICAgICAgKGljb24sIGkpID0+IChpY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7ZnV0dXJlQXJyW2ldLmljb259KWApXG4gICAgKTtcblxuICAgIGNvbnN0IGZ1dHVyZUljb25zVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlci10YWJsZSAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29uc1RhYmxlLmZvckVhY2goXG4gICAgICAoaWNvbiwgaSkgPT4gKGljb24uc3R5bGUuY29udGVudCA9IGB1cmwoJHtmdXR1cmVBcnJbaV0uaWNvbn0pYClcbiAgICApO1xuXG4gICAgcmVuZGVyQmFja2dyb3VuZEltZyhjdXJyZW50T2JqLmNvZGUsIHdlYXRoZXJDYXJkKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsZXQgaHRtbFRleHRFcnJvciA9IGAgPGRpdiBjbGFzcz1cImVycm9yLWNhcmQgXCI+XG4gICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIiAvPlxuICAgIDxoMj5BIG15c3RlcnkgbGFuZCBpcyB3YWl0aW5nIHVzIHRvIGV4cGxvcmUuLi48L2gyPlxuICAgIDxoMj5QbGVhc2UgdHJ5IGFnYWluPC9oMj5cbiAgPC9kaXY+YDtcblxuICAgIHdlYXRoZXJDYXJkLmlubmVySFRNTCA9IGBgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLm92ZXJmbG93ID0gYHZpc2libGVgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGBub25lYDtcblxuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHRFcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VXBkYXRlVGltZSgpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgLy9nZXQgdXBkYXRlIHRpbWVcbiAgY29uc3QgaG91ciA9IGRhdGUuZ2V0SG91cnMoKSA8IDEwID8gYDBgICsgZGF0ZS5nZXRIb3VycygpIDogZGF0ZS5nZXRIb3VycygpO1xuICBjb25zdCBtaW4gPVxuICAgIGRhdGUuZ2V0TWludXRlcygpIDwgMTAgPyBgMGAgKyBkYXRlLmdldE1pbnV0ZXMoKSA6IGRhdGUuZ2V0TWludXRlcygpO1xuXG4gIGNvbnN0IHVwZGF0ZVRpbWUgPSBob3VyICsgXCI6XCIgKyBtaW47XG4gIHJldHVybiB1cGRhdGVUaW1lO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXJXZWF0aGVyQ2FyZEYoY3VycmVudCwgZnV0dXJlLCBmdXR1cmVIb3Vycykge1xuICB0cnkge1xuICAgIGxldCBodG1sVGV4dCA9IGBgO1xuICAgIGNvbnN0IGN1cnJlbnRPYmogPSBhd2FpdCBjdXJyZW50O1xuICAgIGNvbnN0IGZ1dHVyZUFyciA9IGF3YWl0IGZ1dHVyZTtcbiAgICBjb25zdCBmdXR1cmVIb3Vyc0FyciA9IGF3YWl0IGZ1dHVyZUhvdXJzO1xuXG4gICAgaHRtbFRleHQgPSBgXG4gICBcbiAgICAgICAgXG4gICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uXCI+XG4gICAgICA8aW1nIHNyYz1cIlwiIGFsdD1cIlwiPlxuICAgICAgPHA+JHtjdXJyZW50T2JqLmNpdHl9PC9wPlxuICAgIDwvZGl2PlxuICBcbiAgIDxkaXYgY2xhc3M9XCJ1cGRhdGUtdGltZVwiPlxuICAgIFVwZGF0ZWQgYXQgJHtjdXJyZW50T2JqLnVwZGF0ZVRpbWV9XG4gICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9XCJmYWxzZVwiIG5hbWU9XCJcIiBjbGFzcz1cInRvZ2dsZS0xXCI+XG4gICA8L2Rpdj5cbiAgXG4gIFxuICAgIDxkaXYgY2xhc3M9XCJjdXJyZW50LXdlYXRoZXIgXCI+XG4gICAgICA8aW1nIHNyYz1cIlwiIGFsdD1cIlwiIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIiAvPlxuICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtjdXJyZW50T2JqLnRlbXBGfVxuICAgICAgICA8c3BhbiBjbGFzcz1cInRlbXAtdW5pdFwiPsKwRjwvc3Bhbj5cbiAgICAgIDwvcD5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiZmVlbHMtY29uZGl0aW9uXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiZmVlbHNcIj5GZWVscyAke2N1cnJlbnRPYmouZmVlbHNMaWtlRn0gPC9wPlxuICAgICAgICA8cCBjbGFzcz1cIndlYXRoZXItY29uZGl0aW9uXCI+JHtjdXJyZW50T2JqLndlYXRoZXJ9PC9wPlxuICBcbiAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgPC9kaXY+XG4gIFxuICAgIDxkaXYgY2xhc3M9XCJkZXRhaWxlZC13ZWF0aGVyIGhpZGRlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cIndpbmRcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ2YWx1ZVwiPiR7Y3VycmVudE9iai53aW5kfSA8c3Bhbj5rbS9oPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJuYW1lXCI+V0lORDwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJndXN0XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIiA+JHtjdXJyZW50T2JqLmd1c3R9IDxzcGFuPmttL2g8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5XSU5EIEdVU1Q8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaHVtaWRpdHlcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ2YWx1ZVwiPiR7Y3VycmVudE9iai5odW1pZGl0eX0gPHNwYW4+JTwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibmFtZVwiPkhVTUlESVRZPC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIFxuICBcbiAgICA8ZGl2IGNsYXNzPVwiZnV0dXJlLXdlYXRoZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAxXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMF19PC9wPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci10ZW1wXCI+XG4gICAgICAgICAgPGltZyBjbGFzcz1cIndlYXRoZXItc3ltYm9sXCI+PC9pbWc+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMF0udGVtcGVyYXR1cmVGfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzBdLmZlZWxzTGlrZUZ9PC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDJcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclsxXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsxXS50ZW1wZXJhdHVyZUZ9XG4gICAgICAgICAgICA8c3Bhbj7CsDwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICAgIDxwIGNsYXNzPVwiZmVlbHNcIj5GZWVscyAke2Z1dHVyZUFyclsxXS5mZWVsc0xpa2VGfTwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAzXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMl19PC9wPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci10ZW1wXCI+XG4gICAgICAgICAgPGltZyBjbGFzcz1cIndlYXRoZXItc3ltYm9sXCI+PC9pbWc+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMl0udGVtcGVyYXR1cmVGfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtmdXR1cmVBcnJbMl0uZmVlbHNMaWtlRn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgNFwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzNdfTwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItdGVtcFwiPlxuICAgICAgICAgIDxpbWcgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiPjwvaW1nPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzNdLnRlbXBlcmF0dXJlRn1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzNdLmZlZWxzTGlrZUZ9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIFxuICAgIDxkaXYgY2xhc3M9XCJmdXR1cmUtd2VhdGhlci10YWJsZSAgaGlkZGVuIFxuICBcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAxXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMF19PC9wPlxuICAgICAgICA8aW1nIGNsYXNzPVwic3ltYm9sXCI+PC9pbWc+XG4gICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzBdLnRlbXBlcmF0dXJlRn0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMF0ud2VhdGhlcn0gPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDJcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclsxXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2k+XG4gICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzFdLnRlbXBlcmF0dXJlRn0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMV0ud2VhdGhlcn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgM1wiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzJdfTwvcD5cbiAgICAgICAgPGltZyBjbGFzcz1cInN5bWJvbFwiPjwvaW1nPlxuICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsyXS50ZW1wZXJhdHVyZUZ9IDxzcGFuPsKwPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPiR7ZnV0dXJlQXJyWzJdLndlYXRoZXJ9IDwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciA0XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbM119PC9wPlxuICAgICAgICA8aW1nIGNsYXNzPVwic3ltYm9sXCI+PC9pbWc+XG4gICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzNdLnRlbXBlcmF0dXJlRn0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbM10ud2VhdGhlcn0gPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgIDwvZGl2PlxuICAgXG4gIFxuICAgICA8ZGl2IGNsYXNzPVwiZXhwYW5kQnRuXCI+XG4gICAgICA8aW1nIGNsYXNzPVwiZXhwYW5kXCIgc3JjPVwiXCIgYWx0PVwiXCI+XG4gICAgIDwvZGl2PlxuICBcblxuICAgIGA7XG5cbiAgICB3ZWF0aGVyQ2FyZC5pbm5lckhUTUwgPSBgYDtcbiAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5vdmVyZmxvdyA9IGBoaWRkZW5gO1xuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHQpO1xuXG4gICAgY29uc3QgY3VycmVudEljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY3VycmVudC13ZWF0aGVyIGltZ2ApO1xuICAgIGN1cnJlbnRJY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7Y3VycmVudE9iai5pY29ufSlgO1xuXG4gICAgY29uc3QgZnV0dXJlSWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlciAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29ucy5mb3JFYWNoKFxuICAgICAgKGljb24sIGkpID0+IChpY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7ZnV0dXJlQXJyW2ldLmljb259KWApXG4gICAgKTtcblxuICAgIGNvbnN0IGZ1dHVyZUljb25zVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlci10YWJsZSAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29uc1RhYmxlLmZvckVhY2goXG4gICAgICAoaWNvbiwgaSkgPT4gKGljb24uc3R5bGUuY29udGVudCA9IGB1cmwoJHtmdXR1cmVBcnJbaV0uaWNvbn0pYClcbiAgICApO1xuXG4gICAgcmVuZGVyQmFja2dyb3VuZEltZyhjdXJyZW50T2JqLmNvZGUsIHdlYXRoZXJDYXJkKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsZXQgaHRtbFRleHRFcnJvciA9IGAgPGRpdiBjbGFzcz1cImVycm9yLWNhcmQgXCI+XG4gICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIiAvPlxuICAgIDxoMj5BIG15c3RlcnkgbGFuZCBpcyB3YWl0aW5nIHVzIHRvIGV4cGxvcmUuLi48L2gyPlxuICAgIDxoMj5QbGVhc2UgdHJ5IGFnYWluPC9oMj5cbiAgPC9kaXY+YDtcblxuICAgIHdlYXRoZXJDYXJkLmlubmVySFRNTCA9IGBgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLm92ZXJmbG93ID0gYHZpc2libGVgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGBub25lYDtcblxuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHRFcnJvcik7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyV2VhdGhlckNhcmRGRXhwYW5kKGN1cnJlbnQsIGZ1dHVyZSwgZnV0dXJlSG91cnMpIHtcbiAgdHJ5IHtcbiAgICBsZXQgaHRtbFRleHQgPSBgYDtcbiAgICBjb25zdCBjdXJyZW50T2JqID0gYXdhaXQgY3VycmVudDtcbiAgICBjb25zdCBmdXR1cmVBcnIgPSBhd2FpdCBmdXR1cmU7XG4gICAgY29uc3QgZnV0dXJlSG91cnNBcnIgPSBhd2FpdCBmdXR1cmVIb3VycztcblxuICAgIGh0bWxUZXh0ID0gYFxuICAgXG4gICAgICAgIFxuICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIj5cbiAgICAgIDxwPiR7Y3VycmVudE9iai5jaXR5fTwvcD5cbiAgICA8L2Rpdj5cbiAgXG4gICA8ZGl2IGNsYXNzPVwidXBkYXRlLXRpbWVcIj5cbiAgICBVcGRhdGVkIGF0ICR7Y3VycmVudE9iai51cGRhdGVUaW1lfVxuICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPVwiZmFsc2VcIiBuYW1lPVwiXCIgY2xhc3M9XCJ0b2dnbGUtMVwiPlxuICAgPC9kaXY+XG4gIFxuICBcbiAgICA8ZGl2IGNsYXNzPVwiY3VycmVudC13ZWF0aGVyIGV4cGFuZFwiPlxuICAgICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIiBjbGFzcz1cIndlYXRoZXItc3ltYm9sXCIgLz5cbiAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7Y3VycmVudE9iai50ZW1wRn1cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZW1wLXVuaXRcIj7CsEY8L3NwYW4+XG4gICAgICA8L3A+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImZlZWxzLWNvbmRpdGlvblwiPlxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtjdXJyZW50T2JqLmZlZWxzTGlrZUZ9IDwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJ3ZWF0aGVyLWNvbmRpdGlvblwiPiR7Y3VycmVudE9iai53ZWF0aGVyfTwvcD5cbiAgXG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgIDwvZGl2PlxuICBcbiAgICA8ZGl2IGNsYXNzPVwiZGV0YWlsZWQtd2VhdGhlciBcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3aW5kXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIj4ke2N1cnJlbnRPYmoud2luZH0gPHNwYW4+a20vaDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibmFtZVwiPldJTkQ8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiZ3VzdFwiPlxuICAgICAgICA8cCBjbGFzcz1cInZhbHVlXCIgPiR7Y3VycmVudE9iai5ndXN0fSA8c3Bhbj5rbS9oPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJuYW1lXCI+V0lORCBHVVNUPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImh1bWlkaXR5XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIj4ke2N1cnJlbnRPYmouaHVtaWRpdHl9IDxzcGFuPiU8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5IVU1JRElUWTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBcbiAgXG4gICAgPGRpdiBjbGFzcz1cImZ1dHVyZS13ZWF0aGVyIGhpZGRlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDFcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclswXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclswXS50ZW1wZXJhdHVyZUZ9XG4gICAgICAgICAgICA8c3Bhbj7CsDwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtmdXR1cmVBcnJbMF0uZmVlbHNMaWtlRn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgMlwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzFdfTwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItdGVtcFwiPlxuICAgICAgICAgIDxpbWcgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiPjwvaW1nPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzFdLnRlbXBlcmF0dXJlRn1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzFdLmZlZWxzTGlrZUZ9PC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDNcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclsyXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsyXS50ZW1wZXJhdHVyZUZ9XG4gICAgICAgICAgICA8c3Bhbj7CsDwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICAgIDxwIGNsYXNzPVwiZmVlbHNcIj5GZWVscyAke2Z1dHVyZUFyclsyXS5mZWVsc0xpa2VGfTwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciA0XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbM119PC9wPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci10ZW1wXCI+XG4gICAgICAgICAgPGltZyBjbGFzcz1cIndlYXRoZXItc3ltYm9sXCI+PC9pbWc+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbM10udGVtcGVyYXR1cmVGfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtmdXR1cmVBcnJbM10uZmVlbHNMaWtlRn08L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgXG4gICAgPGRpdiBjbGFzcz1cImZ1dHVyZS13ZWF0aGVyLXRhYmxlICAgXG4gIFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDFcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclswXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2ltZz5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMF0udGVtcGVyYXR1cmVGfSA8c3Bhbj7CsDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Z1dHVyZUFyclswXS53ZWF0aGVyfSA8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgMlwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzFdfTwvcD5cbiAgICAgICAgPGltZyBjbGFzcz1cInN5bWJvbFwiPjwvaT5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMV0udGVtcGVyYXR1cmVGfSA8c3Bhbj7CsDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Z1dHVyZUFyclsxXS53ZWF0aGVyfTwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAzXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMl19PC9wPlxuICAgICAgICA8aW1nIGNsYXNzPVwic3ltYm9sXCI+PC9pbWc+XG4gICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzJdLnRlbXBlcmF0dXJlRn0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMl0ud2VhdGhlcn0gPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDRcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclszXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2ltZz5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbM10udGVtcGVyYXR1cmVGfSA8c3Bhbj7CsDwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Z1dHVyZUFyclszXS53ZWF0aGVyfSA8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgPC9kaXY+XG4gICBcbiAgXG4gICAgIDxkaXYgY2xhc3M9XCJleHBhbmRCdG4gZXhwYW5kXCI+XG4gICAgICA8aW1nIGNsYXNzPVwiZXhwYW5kIHRvZ2dsZVwiIHNyYz1cIlwiIGFsdD1cIlwiPlxuICAgICA8L2Rpdj5cbiAgXG5cbiAgICBgO1xuXG4gICAgd2VhdGhlckNhcmQuaW5uZXJIVE1MID0gYGA7XG4gICAgd2VhdGhlckNhcmQuc3R5bGUub3ZlcmZsb3cgPSBgaGlkZGVuYDtcbiAgICB3ZWF0aGVyQ2FyZC5pbnNlcnRBZGphY2VudEhUTUwoYGJlZm9yZWVuZGAsIGh0bWxUZXh0KTtcblxuICAgIGNvbnN0IGN1cnJlbnRJY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmN1cnJlbnQtd2VhdGhlciBpbWdgKTtcbiAgICBjdXJyZW50SWNvbi5zdHlsZS5jb250ZW50ID0gYHVybCgke2N1cnJlbnRPYmouaWNvbn0pYDtcblxuICAgIGNvbnN0IGZ1dHVyZUljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAuZnV0dXJlLXdlYXRoZXIgLmhvdXJseS13ZWF0aGVyIGltZ2BcbiAgICApO1xuXG4gICAgZnV0dXJlSWNvbnMuZm9yRWFjaChcbiAgICAgIChpY29uLCBpKSA9PiAoaWNvbi5zdHlsZS5jb250ZW50ID0gYHVybCgke2Z1dHVyZUFycltpXS5pY29ufSlgKVxuICAgICk7XG5cbiAgICBjb25zdCBmdXR1cmVJY29uc1RhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAuZnV0dXJlLXdlYXRoZXItdGFibGUgLmhvdXJseS13ZWF0aGVyIGltZ2BcbiAgICApO1xuXG4gICAgZnV0dXJlSWNvbnNUYWJsZS5mb3JFYWNoKFxuICAgICAgKGljb24sIGkpID0+IChpY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7ZnV0dXJlQXJyW2ldLmljb259KWApXG4gICAgKTtcblxuICAgIHJlbmRlckJhY2tncm91bmRJbWcoY3VycmVudE9iai5jb2RlLCB3ZWF0aGVyQ2FyZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbGV0IGh0bWxUZXh0RXJyb3IgPSBgIDxkaXYgY2xhc3M9XCJlcnJvci1jYXJkIFwiPlxuICAgIDxpbWcgc3JjPVwiXCIgYWx0PVwiXCIgLz5cbiAgICA8aDI+QSBteXN0ZXJ5IGxhbmQgaXMgd2FpdGluZyB1cyB0byBleHBsb3JlLi4uPC9oMj5cbiAgICA8aDI+UGxlYXNlIHRyeSBhZ2FpbjwvaDI+XG4gIDwvZGl2PmA7XG5cbiAgICB3ZWF0aGVyQ2FyZC5pbm5lckhUTUwgPSBgYDtcbiAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5vdmVyZmxvdyA9IGB2aXNpYmxlYDtcbiAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgbm9uZWA7XG5cbiAgICB3ZWF0aGVyQ2FyZC5pbnNlcnRBZGphY2VudEhUTUwoYGJlZm9yZWVuZGAsIGh0bWxUZXh0RXJyb3IpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcldlYXRoZXJDYXJkQ0V4cGFuZChjdXJyZW50LCBmdXR1cmUsIGZ1dHVyZUhvdXJzKSB7XG4gIHRyeSB7XG4gICAgbGV0IGh0bWxUZXh0ID0gYGA7XG4gICAgY29uc3QgY3VycmVudE9iaiA9IGF3YWl0IGN1cnJlbnQ7XG4gICAgY29uc3QgZnV0dXJlQXJyID0gYXdhaXQgZnV0dXJlO1xuICAgIGNvbnN0IGZ1dHVyZUhvdXJzQXJyID0gYXdhaXQgZnV0dXJlSG91cnM7XG5cbiAgICBodG1sVGV4dCA9IGBcbiAgIFxuICAgICAgICBcbiAgICA8ZGl2IGNsYXNzPVwibG9jYXRpb25cIj5cbiAgICAgIDxpbWcgc3JjPVwiXCIgYWx0PVwiXCI+XG4gICAgICA8cD4ke2N1cnJlbnRPYmouY2l0eX08L3A+XG4gICAgPC9kaXY+XG4gIFxuICAgPGRpdiBjbGFzcz1cInVwZGF0ZS10aW1lXCI+XG4gICAgVXBkYXRlZCBhdCAke2N1cnJlbnRPYmoudXBkYXRlVGltZX1cbiAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cIlwiIGNsYXNzPVwidG9nZ2xlLTFcIj5cbiAgIDwvZGl2PlxuICBcbiAgXG4gICAgPGRpdiBjbGFzcz1cImN1cnJlbnQtd2VhdGhlciBleHBhbmRcIj5cbiAgICAgIDxpbWcgc3JjPVwiXCIgYWx0PVwiXCIgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiIC8+XG4gICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2N1cnJlbnRPYmoudGVtcH1cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZW1wLXVuaXRcIj7CsEY8L3NwYW4+XG4gICAgICA8L3A+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImZlZWxzLWNvbmRpdGlvblwiPlxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtjdXJyZW50T2JqLmZlZWxzTGlrZX0gPC9wPlxuICAgICAgICA8cCBjbGFzcz1cIndlYXRoZXItY29uZGl0aW9uXCI+JHtjdXJyZW50T2JqLndlYXRoZXJ9PC9wPlxuICBcbiAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgPC9kaXY+XG4gIFxuICAgIDxkaXYgY2xhc3M9XCJkZXRhaWxlZC13ZWF0aGVyIFwiPlxuICAgICAgPGRpdiBjbGFzcz1cIndpbmRcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ2YWx1ZVwiPiR7Y3VycmVudE9iai53aW5kfSA8c3Bhbj5rbS9oPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJuYW1lXCI+V0lORDwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJndXN0XCI+XG4gICAgICAgIDxwIGNsYXNzPVwidmFsdWVcIiA+JHtjdXJyZW50T2JqLmd1c3R9IDxzcGFuPmttL2g8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5XSU5EIEdVU1Q8L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaHVtaWRpdHlcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ2YWx1ZVwiPiR7Y3VycmVudE9iai5odW1pZGl0eX0gPHNwYW4+JTwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibmFtZVwiPkhVTUlESVRZPC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIFxuICBcbiAgICA8ZGl2IGNsYXNzPVwiZnV0dXJlLXdlYXRoZXIgaGlkZGVuXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgMVwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzBdfTwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItdGVtcFwiPlxuICAgICAgICAgIDxpbWcgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiPjwvaW1nPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzBdLnRlbXBlcmF0dXJlfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzBdLmZlZWxzTGlrZX08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgMlwiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzFdfTwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItdGVtcFwiPlxuICAgICAgICAgIDxpbWcgY2xhc3M9XCJ3ZWF0aGVyLXN5bWJvbFwiPjwvaW1nPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGVtcFwiPiR7ZnV0dXJlQXJyWzFdLnRlbXBlcmF0dXJlfVxuICAgICAgICAgICAgPHNwYW4+wrA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgICA8cCBjbGFzcz1cImZlZWxzXCI+RmVlbHMgJHtmdXR1cmVBcnJbMV0uZmVlbHNMaWtlfTwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAzXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMl19PC9wPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci10ZW1wXCI+XG4gICAgICAgICAgPGltZyBjbGFzcz1cIndlYXRoZXItc3ltYm9sXCI+PC9pbWc+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMl0udGVtcGVyYXR1cmV9XG4gICAgICAgICAgICA8c3Bhbj7CsDwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICAgIDxwIGNsYXNzPVwiZmVlbHNcIj5GZWVscyAke2Z1dHVyZUFyclsyXS5mZWVsc0xpa2V9PC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDRcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclszXX08L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWF0aGVyLXRlbXBcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwid2VhdGhlci1zeW1ib2xcIj48L2ltZz5cbiAgICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclszXS50ZW1wZXJhdHVyZX1cbiAgICAgICAgICAgIDxzcGFuPsKwPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgICAgPHAgY2xhc3M9XCJmZWVsc1wiPkZlZWxzICR7ZnV0dXJlQXJyWzNdLmZlZWxzTGlrZX08L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgXG4gICAgPGRpdiBjbGFzcz1cImZ1dHVyZS13ZWF0aGVyLXRhYmxlICAgXG4gIFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDFcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclswXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2ltZz5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbMF0udGVtcGVyYXR1cmV9IDxzcGFuPsKwPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPiR7ZnV0dXJlQXJyWzBdLndlYXRoZXJ9IDwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICAgIDxkaXYgY2xhc3M9XCJob3VybHktd2VhdGhlciAyXCI+XG4gICAgICAgIDxwIGNsYXNzPVwidGltZVwiPiR7ZnV0dXJlSG91cnNBcnJbMV19PC9wPlxuICAgICAgICA8aW1nIGNsYXNzPVwic3ltYm9sXCI+PC9pPlxuICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsxXS50ZW1wZXJhdHVyZX0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMV0ud2VhdGhlcn08L3A+XG4gICAgICA8L2Rpdj5cbiAgXG4gICAgICA8ZGl2IGNsYXNzPVwiaG91cmx5LXdlYXRoZXIgM1wiPlxuICAgICAgICA8cCBjbGFzcz1cInRpbWVcIj4ke2Z1dHVyZUhvdXJzQXJyWzJdfTwvcD5cbiAgICAgICAgPGltZyBjbGFzcz1cInN5bWJvbFwiPjwvaW1nPlxuICAgICAgICA8cCBjbGFzcz1cInRlbXBcIj4ke2Z1dHVyZUFyclsyXS50ZW1wZXJhdHVyZX0gPHNwYW4+wrA8L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+JHtmdXR1cmVBcnJbMl0ud2VhdGhlcn0gPC9wPlxuICAgICAgPC9kaXY+XG4gIFxuICAgICAgPGRpdiBjbGFzcz1cImhvdXJseS13ZWF0aGVyIDRcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0aW1lXCI+JHtmdXR1cmVIb3Vyc0FyclszXX08L3A+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJzeW1ib2xcIj48L2ltZz5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZW1wXCI+JHtmdXR1cmVBcnJbM10udGVtcGVyYXR1cmV9IDxzcGFuPsKwPC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPiR7ZnV0dXJlQXJyWzNdLndlYXRoZXJ9IDwvcD5cbiAgICAgIDwvZGl2PlxuICBcbiAgICA8L2Rpdj5cbiAgIFxuICBcbiAgICAgPGRpdiBjbGFzcz1cImV4cGFuZEJ0biBleHBhbmRcIj5cbiAgICAgIDxpbWcgY2xhc3M9XCJleHBhbmQgdG9nZ2xlXCIgc3JjPVwiXCIgYWx0PVwiXCI+XG4gICAgIDwvZGl2PlxuICBcblxuICAgIGA7XG5cbiAgICB3ZWF0aGVyQ2FyZC5pbm5lckhUTUwgPSBgYDtcbiAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5vdmVyZmxvdyA9IGBoaWRkZW5gO1xuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHQpO1xuXG4gICAgY29uc3QgY3VycmVudEljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY3VycmVudC13ZWF0aGVyIGltZ2ApO1xuICAgIGN1cnJlbnRJY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7Y3VycmVudE9iai5pY29ufSlgO1xuXG4gICAgY29uc3QgZnV0dXJlSWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlciAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29ucy5mb3JFYWNoKFxuICAgICAgKGljb24sIGkpID0+IChpY29uLnN0eWxlLmNvbnRlbnQgPSBgdXJsKCR7ZnV0dXJlQXJyW2ldLmljb259KWApXG4gICAgKTtcblxuICAgIGNvbnN0IGZ1dHVyZUljb25zVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5mdXR1cmUtd2VhdGhlci10YWJsZSAuaG91cmx5LXdlYXRoZXIgaW1nYFxuICAgICk7XG5cbiAgICBmdXR1cmVJY29uc1RhYmxlLmZvckVhY2goXG4gICAgICAoaWNvbiwgaSkgPT4gKGljb24uc3R5bGUuY29udGVudCA9IGB1cmwoJHtmdXR1cmVBcnJbaV0uaWNvbn0pYClcbiAgICApO1xuXG4gICAgcmVuZGVyQmFja2dyb3VuZEltZyhjdXJyZW50T2JqLmNvZGUsIHdlYXRoZXJDYXJkKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsZXQgaHRtbFRleHRFcnJvciA9IGAgPGRpdiBjbGFzcz1cImVycm9yLWNhcmQgXCI+XG4gICAgPGltZyBzcmM9XCJcIiBhbHQ9XCJcIiAvPlxuICAgIDxoMj5BIG15c3RlcnkgbGFuZCBpcyB3YWl0aW5nIHVzIHRvIGV4cGxvcmUuLi48L2gyPlxuICAgIDxoMj5QbGVhc2UgdHJ5IGFnYWluPC9oMj5cbiAgPC9kaXY+YDtcblxuICAgIHdlYXRoZXJDYXJkLmlubmVySFRNTCA9IGBgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLm92ZXJmbG93ID0gYHZpc2libGVgO1xuICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGBub25lYDtcblxuICAgIHdlYXRoZXJDYXJkLmluc2VydEFkamFjZW50SFRNTChgYmVmb3JlZW5kYCwgaHRtbFRleHRFcnJvcik7XG4gIH1cbn1cbiIsImltcG9ydCB7IGdldEZ1dHVyZUhvdXIgfSBmcm9tIFwiLlwiO1xuXG5mdW5jdGlvbiByZW5kZXJCYWNrZ3JvdW5kSW1nKGNvZGUsIHdlYXRoZXJDYXJkLCB0aW1lLCBmZWVsc0ZvbnQpIHtcbiAgc3dpdGNoIChjb2RlKSB7XG4gICAgY2FzZSAxMDAwOlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvY2xlYXItc2t5LmpwZylgO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDEwMDM6XG4gICAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKGFzc2V0cy9mZXctY2xvdWRzLmpwZylgO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDEwMDY6XG4gICAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKGFzc2V0cy9zY2F0dGVyZWQtY2xvdWRzLmpwZylgO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDEwMDk6XG4gICAgY2FzZSAxMDYzOlxuICAgIGNhc2UgMTA2NjpcbiAgICBjYXNlIDEwNjk6XG4gICAgY2FzZSAxMDcyOlxuICAgIGNhc2UgMTA4NzpcbiAgICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoYXNzZXRzL2Jyb2tlbi1jbG91ZHMuanBnKWA7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTAzMDpcbiAgICBjYXNlIDExMzU6XG4gICAgY2FzZSAxMTQ3OlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvbWlzdC5qcGcpYDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMTE0OlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvYmxvd2luZy1zbm93LmpwZylgO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDExMTc6XG4gICAgY2FzZSAxMjIyOlxuICAgIGNhc2UgMTIyNTpcbiAgICBjYXNlIDEyNTI6XG4gICAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKGFzc2V0cy9ibGl6emFyZC5qcGcpYDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMTUwOlxuICAgIGNhc2UgMTE1MzpcbiAgICBjYXNlIDExNjg6XG4gICAgY2FzZSAxMTcxOlxuICAgIGNhc2UgMTE4MDpcbiAgICBjYXNlIDExODM6XG4gICAgY2FzZSAxMjQwOlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvc2hvd2VyLXJhaW4uanBnKWA7XG4gICAgICB3ZWF0aGVyQ2FyZC5zdHlsZS5jb2xvciA9IGBibGFja2A7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMTg2OlxuICAgIGNhc2UgMTE4OTpcbiAgICBjYXNlIDExOTg6XG4gICAgY2FzZSAxMjQzOlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvcmFpbi5qcGcpYDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMTkyOlxuICAgIGNhc2UgMTE5NTpcbiAgICBjYXNlIDEyMDE6XG4gICAgY2FzZSAxMjQ2OlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvaGVhdnktcmFpbi5qcGcpYDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMjA0OlxuICAgIGNhc2UgMTIxMDpcbiAgICBjYXNlIDEyMTM6XG4gICAgY2FzZSAxMjQ5OlxuICAgIGNhc2UgMTI1NTpcbiAgICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoYXNzZXRzL2xpZ2h0LXNub3cuanBnKWA7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTIwNzpcbiAgICBjYXNlIDEyMTY6XG4gICAgY2FzZSAxMjE5OlxuICAgIGNhc2UgMTI1ODpcbiAgICAgIHdlYXRoZXJDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoYXNzZXRzL3Nub3cuanBnKWA7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTIzNzpcbiAgICBjYXNlIDEyNjE6XG4gICAgY2FzZSAxMjY0OlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvaGFpbC5qcGcpYDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxMjczOlxuICAgIGNhc2UgMTI3NjpcbiAgICBjYXNlIDEyNzk6XG4gICAgY2FzZSAxMjgyOlxuICAgICAgd2VhdGhlckNhcmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChhc3NldHMvdGh1bmRlcnN0b3JtLmpwZylgO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyQmFja2dyb3VuZEltZztcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=