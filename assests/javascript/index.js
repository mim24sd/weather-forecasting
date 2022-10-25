const apiKey = "8cf248a4fd398e2908cf52a9f187375b";
const mainSection = document.getElementById("main");

getWeather();

async function getWeather() {
  try {
    const city = await getCityLocation();
    const curentWeather = await getCurrentWeather(city);
    const dailyForecastingWeatherList = await getForecastingWeather(city);

    showWeather(curentWeather, dailyForecastingWeatherList);
  } catch {
    showErrorMassage();
  }
}

async function getCityLocation() {
  const fetchedData = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=Rasht,IR&appid=${apiKey}`
  );
  const cityList = await fetchedData.json();

  return cityList[0];
}

async function getCurrentWeather(thisCity) {
  const fetchedData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${thisCity.lat}&lon=${thisCity.lon}&appid=${apiKey}`
  );
  return await fetchedData.json();
}

async function getForecastingWeather(thisCity) {
  const fetchedData = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${thisCity.lat}&lon=${thisCity.lon}&appid=${apiKey}`
  );
  const threeHoursForecastingWeatherFullInfo = await fetchedData.json();

  return filterForecastingWeatherByDay(
    threeHoursForecastingWeatherFullInfo.list
  );
}

function showWeather(curentWeather, dailyForecastingWeatherList) {
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
  <ul class="forecasting-weather-list">
    <li>
      <figure class="forecasting-weather-box">
        <img
          alt="forecasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForecastingWeatherList[0].weather[0].icon
          }@2x.png"
          class="forecasting-weather-icon"
        />
        <figcaption class="forecasting-weather-text-box">
          <p class="forecasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForecastingWeatherList[0].main.temp
          )}</p>
          <p>Today</p>
        </figcaption>
      </figure>
    </li>
    <li>
      <figure class="forecasting-weather-box">
        <img
          alt="forecasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForecastingWeatherList[1].weather[0].icon
          }@2x.png"
          class="forecasting-weather-icon"
        />
        <figcaption class="forecasting-weather-text-box">
          <p class="forecasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForecastingWeatherList[1].main.temp
          )}</p>
          <p>${
            convertTimeStampToDate(dailyForecastingWeatherList[1].dt).dayOfWeek
          }</p>
        </figcaption>
      </figure>
    </li>
    <li>
      <figure class="forecasting-weather-box">
        <img
          alt="forecasting weather image"
          src="http://openweathermap.org/img/wn/${
            dailyForecastingWeatherList[2].weather[0].icon
          }@2x.png"
          class="forecasting-weather-icon"
        />
        <figcaption class="forecasting-weather-text-box">
          <p class="forecasting-weather-paragraph">${convertKelvinToCelsius(
            dailyForecastingWeatherList[2].main.temp
          )}</p>
          <p>${
            convertTimeStampToDate(dailyForecastingWeatherList[2].dt).dayOfWeek
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
    year: dateTime.toLocaleDateString("en-US", { year: "numeric" }),
    month: dateTime.toLocaleDateString("en-US", { month: "short" }),
    dayOfMonth: dateTime.toLocaleDateString("en-US", { day: "numeric" }),
    dayOfWeek: dateTime.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

function convertKelvinToCelsius(kelvin) {
  return `${Math.floor(kelvin - 273.15)}&#8451`;
}

function convertMeterPerSecondToMilesPerHour(meterPerSecond) {
  return `${(meterPerSecond * 2.237).toFixed(2)}mph`;
}

function filterForecastingWeatherByDay(list) {
  return list.filter((listItem) => {
    return (
      new Date(listItem.dt_txt).getHours() ===
      new Date(list[0].dt_txt).getHours()
    );
  });
}
