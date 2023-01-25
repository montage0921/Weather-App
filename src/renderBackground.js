import { getFutureHour } from ".";

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

export default renderBackgroundImg;
