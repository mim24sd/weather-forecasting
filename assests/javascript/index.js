const apiKey = "8cf248a4fd398e2908cf52a9f187375b";
const mainSection = document.getElementById("main");

let city = {};
let curentWeather = {};
let dailyForcastingWeatherList = {};

getWeather();

async function getWeather() {
  await getCity();
  await getCurrentWeather(city);
  await getForcastingWeather(city);

  showWeather();
}
async function getCity() {
  try {
    const fetchedData = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=Rasht,IR&appid=${apiKey}`
    );
    const cityList = await fetchedData.json();

    city = cityList[0];
  } catch {
    showErrorMassage();
  }
}

async function getCurrentWeather(thisCity) {
  try {
    const fetchedData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${thisCity.lat}&lon=${thisCity.lon}&appid=${apiKey}`
    );
    curentWeather = await fetchedData.json();
  } catch {
    showErrorMassage();
  }
}

async function getForcastingWeather(thisCity) {
  try {
    const fetchedData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${thisCity.lat}&lon=${thisCity.lon}&appid=${apiKey}`
    );
    const threeHoursForcastingWeatherFullInfo = await fetchedData.json();

    dailyForcastingWeatherList = filterForcastingWeatherByDay(
      threeHoursForcastingWeatherFullInfo.list
    );
  } catch {
    showErrorMassage();
  }
}

function showWeather() {
  mainSection.innerHTML += `<section class="city-section">
    <h1 class="city-name">${curentWeather.name}</h1>
    <time datetime="2020-02-14">${
      convertTimeStampToDate(curentWeather.dt).dayOfWeek
    }, ${convertTimeStampToDate(curentWeather.dt).dayOfMonth} ${
    convertTimeStampToDate(curentWeather.dt).month
  } ${convertTimeStampToDate(curentWeather.dt).year}</time>
  </section>
  <section class="main-section">
    <img
      alt="today's weather image"
      src="http://openweathermap.org/img/wn/${
        curentWeather.weather[0].icon
      }@2x.png"
      class="main-image"
    />
    <h2 class="main-degree">${convertKelvinToCelsius(
      curentWeather.main.temp
    )}</h2>
    <p>${curentWeather.weather[0].description}</p>
    <ul class="main-icons-container">
      <li>
        <figure class="main-icon-container">
          <i class="fa fa-solid fa-wind main-icon"></i>
          <figcaption class="main-icon-detail">${convertMeterPerSecondToMilesPerHour(
            curentWeather.wind.speed
          )}</figcaption>
        </figure>
      </li>
      <li>
        <figure class="main-icon-container">
          <i class="fa fa-solid fa-droplet main-icon"></i>
          <figcaption class="main-icon-detail">${
            curentWeather.main.humidity
          }%</figcaption>
        </figure>
      </li>
    </ul>
  </section>
  <ul class="forcasting-weather-list">
    <li>
      <figure class="forcasting-weather-box">
        <img
          alt="forcasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForcastingWeatherList[0].weather[0].icon
          }@2x.png"
          class="forcasting-weather-icon"
        />
        <figcaption class="forcasting-weather-text-box">
          <p class="forcasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForcastingWeatherList[0].main.temp
          )}</p>
          <p>Today</p>
        </figcaption>
      </figure>
    </li>
    <li>
      <figure class="forcasting-weather-box">
        <img
          alt="forcasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForcastingWeatherList[1].weather[0].icon
          }@2x.png"
          class="forcasting-weather-icon"
        />
        <figcaption class="forcasting-weather-text-box">
          <p class="forcasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForcastingWeatherList[1].main.temp
          )}</p>
          <p>${
            convertTimeStampToDate(dailyForcastingWeatherList[1].dt).dayOfWeek
          }</p>
        </figcaption>
      </figure>
    </li>
    <li>
      <figure class="forcasting-weather-box">
        <img
          alt="forcasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForcastingWeatherList[2].weather[0].icon
          }@2x.png"
          class="forcasting-weather-icon"
        />
        <figcaption class="forcasting-weather-text-box">
          <p class="forcasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForcastingWeatherList[2].main.temp
          )}</p>
          <p>${
            convertTimeStampToDate(dailyForcastingWeatherList[2].dt).dayOfWeek
          }</p>
        </figcaption>
      </figure>
    </li>
  </ul>`;
}

function showErrorMassage() {
  mainSection.innerHTML += `<p class="error-message">Somthing went wrong. Please refresh the page!</p>`;
}

function convertTimeStampToDate(date) {
  const dateTime = new Date(date * 1000);

  return {
    year: dateTime.getFullYear(),
    month: convertMonthNumberToName(dateTime.getMonth()),
    dayOfMonth: dateTime.getDate(),
    dayOfWeek: convertDayOfWeekNumberToName(dateTime.getDay()),
  };
}

function convertMonthNumberToName(monthNumber) {
  switch (monthNumber) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
  }
}

function convertDayOfWeekNumberToName(dayOfWeekNumber) {
  switch (dayOfWeekNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}

function convertKelvinToCelsius(kelvin) {
  return `${Math.floor(kelvin - 273.15)}&#8451`;
}

function convertMeterPerSecondToMilesPerHour(meterPerSecond) {
  return `${(meterPerSecond * 2.237).toFixed(2)}mph`;
}

function filterForcastingWeatherByDay(list) {
  return list.filter((listItem) => {
    return (
      new Date(listItem.dt_txt).getHours() ===
      new Date(list[0].dt_txt).getHours()
    );
  });
}
