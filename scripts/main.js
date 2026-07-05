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

const state = {
  unit: "C",
  weather: null,
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

//========================================================
// Init

renderWeatherCard(fetchWeather("Moscow"));
