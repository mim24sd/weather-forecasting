import cityListJson from "./cityList.json" assert { type: "json" };

const apiKey = "8cf248a4fd398e2908cf52a9f187375b";
const baseUrl = "https://api.openweathermap.org/";

const mainSection = document.getElementById("main");
const selectedCity = document.getElementById("selected-city");
const cityNameList = document.getElementById("cities");

selectedCity.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(selectedCity.value);
  }
});

showDataList();
getWeather("Rasht");

function showDataList() {
  return (cityNameList.innerHTML = cityListJson
    .map((city) => {
      return `<option>${city.name}</option>`;
    })
    .join(""));
}

async function getWeather(cityName) {
  try {
    console.log(cityName);
    const city = getCityId(cityName);
    const currentWeather = await getCurrentWeather(city);
    const dailyForecastingWeatherList = await getForecastingWeather(city);

    showWeather(currentWeather, dailyForecastingWeatherList);
  } catch {
    showErrorMassage();
  }
}

function getCityId(name) {
  let id = 0;

  cityListJson.filter((city) => {
    if (city.name === name) {
      id = city.id;
    }
  });

  return id;
}

async function getCurrentWeather(id) {
  const fetchedData = await fetch(
    `${baseUrl}data/2.5/weather?id=${id}&appid=${apiKey}`
  );
  return await fetchedData.json();
}

async function getForecastingWeather(id) {
  const fetchedData = await fetch(
    `${baseUrl}data/2.5/forecast?id=${id}&appid=${apiKey}`
  );
  const threeHoursForecastingWeatherFullInfo = await fetchedData.json();

  return filterForecastingWeatherByDay(
    threeHoursForecastingWeatherFullInfo.list
  );
}

function showWeather(currentWeather, dailyForecastingWeatherList) {
  const dailyForcastingWeatherList = showDailyForecastingWeatherList(
    dailyForecastingWeatherList
  );
  const currentForcastingWeather = showCurrentWeather(currentWeather);

  mainSection.innerHTML = `
    ${currentForcastingWeather}
    <ul class="forecasting-weather-list">${dailyForcastingWeatherList}</ul>`;
}

function showErrorMassage() {
  mainSection.innerHTML = `<p class="error-message">Somthing went wrong. Please refresh the page!</p>`;
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

function handleCurrentWeatherDatas(currentWeather) {
  const date = convertTimeStampToDate(currentWeather.dt);

  return {
    cityName: currentWeather.name,

    currentIcon: currentWeather.weather[0].icon,
    currentDescription: currentWeather.weather[0].description,
    currentTemperature: convertKelvinToCelsius(currentWeather.main.temp),
    currentWindSpeed: convertMeterPerSecondToMilesPerHour(
      currentWeather.wind.speed
    ),
    currentHumidity: currentWeather.main.humidity,

    dayOfWeek: date.dayOfWeek,
    dayOfMonth: date.dayOfMonth,
    month: date.month,
    year: date.year,
  };
}

function showCurrentWeather(currentWeather) {
  const currentWeatherDatas = handleCurrentWeatherDatas(currentWeather);

  return `
  <section class="city-section">
    <h1 class="city-name">${currentWeatherDatas.cityName}</h1>
    <time datetime="2020-02-14">${currentWeatherDatas.dayOfWeek}, ${currentWeatherDatas.dayOfMonth} ${currentWeatherDatas.month} ${currentWeatherDatas.year}</time>
  </section>
  <section class="main-section">
    <img
      alt="today's weather image"
      src="http://openweathermap.org/img/wn/${currentWeatherDatas.currentIcon}@2x.png"
      class="main-image"
    />
    <h2 class="main-degree">${currentWeatherDatas.currentTemperature}</h2>
    <p>${currentWeatherDatas.currentDescription}</p>
    <ul class="main-icons-container">
      <li>
        <figure class="main-icon-container">
          <i class="fa fa-solid fa-wind main-icon"></i>
          <figcaption class="main-icon-detail">${currentWeatherDatas.currentWindSpeed}</figcaption>
        </figure>
      </li>
      <li>
        <figure class="main-icon-container">
          <i class="fa fa-solid fa-droplet main-icon"></i>
          <figcaption class="main-icon-detail">${currentWeatherDatas.currentHumidity}%</figcaption>
        </figure>
      </li>
    </ul>
  </section>`;
}

function handleDailyForecastingWeatherDatas(dailyForecastingWeatherList) {
  let dailyForcastingList = [];
  let dayOfWeek = "";

  for (let day = 0; day <= 2; day++) {
    dayOfWeek =
      day === 0
        ? "Today"
        : convertTimeStampToDate(dailyForecastingWeatherList[day].dt).dayOfWeek;

    dailyForcastingList.push({
      icon: dailyForecastingWeatherList[day].weather[0].icon,
      temperature: convertKelvinToCelsius(
        dailyForecastingWeatherList[day].main.temp
      ),
      dayOfWeek,
    });
  }

  return dailyForcastingList;
}

function showDailyForecastingWeatherList(dailyForecastingWeatherList) {
  const dailyForcastingList = handleDailyForecastingWeatherDatas(
    dailyForecastingWeatherList
  );

  return dailyForcastingList
    .map((dailyForcastingItem) => {
      return `<li>
      <figure class="forecasting-weather-box">
        <img
          alt="forecasting weather image"
          src="http://openweathermap.org/img/wn/${dailyForcastingItem.icon}@2x.png"
          class="forecasting-weather-icon"
        />
        <figcaption class="forecasting-weather-text-box">
          <p class="forecasting-weather-paragraph">
            ${dailyForcastingItem.temperature}
          </p>
          <p>
            ${dailyForcastingItem.dayOfWeek}
          </p>
        </figcaption>
      </figure>
    </li>`;
    })
    .join("");
}
