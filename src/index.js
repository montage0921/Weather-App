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
  const responseCurrent = fetch(
    `http://api.weatherapi.com/v1/current.json?key=987f97d506dd4207a9f40954231201&q=${city}&aqi=no`
  );
  const responseFuture = fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=987f97d506dd4207a9f40954231201&q=${city}&days=1&aqi=no&alerts=no`
  );
  const responses = await Promise.all([responseCurrent, responseFuture]);
  const currentWeatherAll = await responses[0].json();
  const futureWeatherAll = await responses[1].json();

  console.log(futureWeatherAll);

  const futureWeather = futureWeatherAll.forecast.forecastday[0].hour.slice(
    0,
    4
  );
  console.log(futureWeather);

  //weather.time is this:
  //2023-01-11 00:00, 2023-01-11 01:00...
  //we ONLY need the hour and need to add AM or PM after the hour accordingly
  const futureTime = futureWeather.map((weather) => {
    const time = +weather.time.split(` `)[1].split(`:`)[0];
    if (time < 12 && time !== 0) return `${time}AM`;
    else if (time === 0) return `12AM`;
    else return `${time}PM`;
  });

  console.log(futureTime);

  //   const result = await responseFuture.json();
  //   console.log(result);
}
