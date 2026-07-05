//========================================================
// API
const API_KEY = "38d2c232dcaa66f3d3ec7034b86ecc70";
const url = `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${API_KEY}&units=metric&lang=en`;

//========================================================
// DOM Elements

const unitToggle = document.querySelector(".weather-controls__unit-toggle");
const periodToggle = document.querySelector(".weather-controls__period-toggle");

const form = document.querySelector(".weather-controls__search-form");
const searchInput = document.querySelector(".weather-controls__search");

const cityElement = document.querySelector(".weather-card__city");
const dateElement = document.querySelector(".weather-card__date");
const conditionElement = document.querySelector(".weather-card__condition");
const temperatureElement = document.querySelector(".weather-card__temperature");
const windElement = document.querySelector(".weather-card__wind");
const humidityElement = document.querySelector(".weather-card__humidity");
const feelsLikeElement = document.querySelector(".weather-card__feels-like");
const errorElement = document.querySelector(".weather-controls__error");
const iconElement = document.querySelector(".weather-card__icon");
const forecastListElement = document.querySelector('.forecast__list')
const weatherCard = document.querySelector(".weather-card");
const forecastSection = document.querySelector(".forecast");

const state = {
  unit: "C",
  weather: null,
  tomorrowWeather: null,
  fiveDaysForecast: [],
};



//========================================================
// Event Listeners

unitToggle.addEventListener("click", function (event) {
  const clickedButton = event.target.closest(".weather-controls__unit-button");

  if (!clickedButton) {
    return;
  }

  if (
    clickedButton.classList.contains("weather-controls__unit-button--active")
  ) {
    return;
  }

  const selectedUnit = clickedButton.textContent.trim().replace("°", "");
  state.unit = selectedUnit;

  const activeButton = unitToggle.querySelector(
    ".weather-controls__unit-button--active",
  );

  activeButton.classList.remove("weather-controls__unit-button--active");
  clickedButton.classList.add("weather-controls__unit-button--active");

  if (state.weather) {
    renderWeatherCard(state.weather);
  }

  if (state.weather) {
  renderWeatherCard(state.weather);
}

if (!forecastSection.classList.contains("hidden")) {
  renderFiveDaysForecast(state.fiveDaysForecast);
}
});

//========================================================

periodToggle.addEventListener("click", function (event) {
  const clickedButton = event.target.closest(
    ".weather-controls__period-button",
  );

  if (!clickedButton) {
    return;
  }

  if (
    clickedButton.classList.contains("weather-controls__period-button--active")
  ) {
    return;
  }

  const activeButton = periodToggle.querySelector(
    ".weather-controls__period-button--active",
  );

  activeButton.classList.remove("weather-controls__period-button--active");
  clickedButton.classList.add("weather-controls__period-button--active");

  const selectedPeriod = clickedButton.textContent.trim();

  if (selectedPeriod === "Tomorrow" && state.tomorrowWeather) {
    renderWeatherCard(state.tomorrowWeather);
  }

  if (selectedPeriod === "Today" && state.weather) {
    renderWeatherCard(state.weather);
  }

  if (selectedPeriod === "Today" && state.weather) {
  forecastListElement.innerHTML = "";
  renderWeatherCard(state.weather);
}

if (selectedPeriod === "Tomorrow" && state.tomorrowWeather) {
  forecastListElement.innerHTML = "";
  renderWeatherCard(state.tomorrowWeather);
}

if (selectedPeriod === "5 days" && state.fiveDaysForecast.length > 0) {
  renderFiveDaysForecast(state.fiveDaysForecast);
}

if (selectedPeriod === "Today" && state.weather) {
  forecastSection.classList.add("hidden");
  weatherCard.classList.remove("hidden");
  forecastListElement.innerHTML = "";
  renderWeatherCard(state.weather);
}

if (selectedPeriod === "Tomorrow" && state.tomorrowWeather) {
  forecastSection.classList.add("hidden");
  weatherCard.classList.remove("hidden");
  forecastListElement.innerHTML = "";
  renderWeatherCard(state.tomorrowWeather);
}

if (selectedPeriod === "5 days" && state.fiveDaysForecast.length > 0) {
  weatherCard.classList.add("hidden");
  forecastSection.classList.remove("hidden");
  renderFiveDaysForecast(state.fiveDaysForecast);
}
});

//========================================================

form.addEventListener("submit", function (event) {
  event.preventDefault();

  handleSearch();
});

//========================================================
// Functions

function handleSearch() {
  const city = searchInput.value.trim();

  if (!city) return;
  saveLastCity(city);
  fetchWeather(city);

  searchInput.value = "";
  searchInput.focus();
}

function renderWeatherCard(weatherData) {
  cityElement.textContent = weatherData.city;
  dateElement.textContent = weatherData.date;
  conditionElement.textContent = weatherData.condition;
  temperatureElement.textContent = `${convertTemperature(weatherData.temperature)}°${state.unit}`;
  windElement.textContent = weatherData.wind;
  humidityElement.textContent = weatherData.humidity;
  feelsLikeElement.textContent = `${convertTemperature(weatherData.feelsLike)}°${state.unit}`;
  iconElement.src = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
  iconElement.alt = weatherData.condition;
}

function renderFiveDaysForecast(forecastList){
  forecastListElement.innerHTML = '';

  forecastList.forEach(function(forecastItem){
    const forecastCard = document.createElement('article');

    forecastCard.classList.add('forecast__card');

    forecastCard.innerHTML = `
      <p class="forecast__date">${forecastItem.date}</p>
      <img class="forecast__icon" src="https://openweathermap.org/img/wn/${forecastItem.icon}@2x.png" alt="${forecastItem.condition}">
      <p class="forecast__temp">${convertTemperature(forecastItem.temperature)}°${state.unit}</p>
      <p class="forecast__condition">${forecastItem.condition}</p>
    `;

    forecastListElement.appendChild(forecastCard)
  });
}

async function fetchWeather(city) {
  setLoading(true);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      showError("City not found");
      return;
    }

    const transformedData = transformWeatherData(data);
    state.weather = transformedData;
    showError("");
    renderWeatherCard(state.weather);
  } catch (error) {
    console.log("Request failed", error);
  } finally {
    setLoading(false);
  }
}

async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
  const response = await fetch(url);
  const data = await response.json();

  const tomorrowDate = getTomorrowDateString();

  const tomorrowForecast = data.list.filter(function (item) {
    return item.dt_txt.startsWith(tomorrowDate);
  });

  const tomorrowMiddayForecast = tomorrowForecast.find(function (item) {
    return item.dt_txt.includes("12:00:00");
  });

  const transformedForecast = transformForecastData(
    tomorrowMiddayForecast,
    data.city.name,
  );
  state.tomorrowWeather = transformedForecast;
  
  state.fiveDaysForecast = transformFiveDaysForecast(data.list, data.city.name)
  console.log(state.fiveDaysForecast)
}

function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

function transformWeatherData(data) {
  return {
    city: data.name,
    date: formatDate(data.dt, data.timezone),
    condition: data.weather[0].main,
    temperature: Math.round(data.main.temp),
    wind: `${data.wind.speed} m/s`,
    humidity: `${data.main.humidity}%`,
    feelsLike: Math.round(data.main.feels_like),
    icon: data.weather[0].icon,
  };
}

function transformForecastData(forecastItem, cityName) {
  return {
    city: cityName,
    date: formatForecastDate(forecastItem.dt_txt),
    condition: forecastItem.weather[0].main,
    temperature: Math.round(forecastItem.main.temp),
    wind: `${forecastItem.wind.speed} m/s`,
    humidity: `${forecastItem.main.humidity}%`,
    feelsLike: Math.round(forecastItem.main.feels_like),
    icon: forecastItem.weather[0].icon,
  };
}

function formatDate(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);

  const formattedDate = date.toLocaleString("ru-RU", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  return formattedDate[0].toUpperCase() + formattedDate.slice(1);
}

function transformFiveDaysForecast(forecastList, cityName){
  const dailyForecasts = forecastList.filter(function(item){
    return item.dt_txt.includes("12:00:00")
  })

  return dailyForecasts.map(function(item){
    return transformForecastData(item, cityName)
  })
}

function formatForecastDate(dateText) {
  const date = new Date(dateText)

  const formattedDate = date.toLocaleString("ru-RU", {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return formattedDate[0].toUpperCase() + formattedDate.slice(1)
}

function setLoading(isLoading) {
  searchInput.disabled = isLoading;

  if (isLoading) {
    searchInput.placeholder = "Loading...";
  } else {
    searchInput.placeholder = "Search Here";
  }
  searchInput.focus();
}

function showError(message) {
  errorElement.textContent = message;
}

function convertTemperature(temperature) {
  if (state.unit === "F") {
    return Math.round((temperature * 9) / 5 + 32);
  }

  return temperature;
}

function saveLastCity(city) {
  localStorage.setItem("lastCity", city);
}

function getLastCity() {
  return localStorage.getItem("lastCity" || "Moscow");
}

//========================================================
// Init

renderWeatherCard(fetchWeather(getLastCity()));
fetchForecast(getLastCity());
