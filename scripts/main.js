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

//========================================================
// Mock data

const mockWeather = {
  city: "Введи город",
  date: "сегодня",
  condition: "Кайфово",
  temperature: "23°C",
  wind: "5 km/h",
  humidity: "80%",
  feelsLike: "25°C",
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

  const activeButton = unitToggle.querySelector(
    ".weather-controls__unit-button--active",
  );

  activeButton.classList.remove("weather-controls__unit-button--active");
  clickedButton.classList.add("weather-controls__unit-button--active");
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
  temperatureElement.textContent = weatherData.temperature;
  windElement.textContent = weatherData.wind;
  humidityElement.textContent = weatherData.humidity;
  feelsLikeElement.textContent = weatherData.feelsLike;
}

async function fetchWeather(city) {
const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
  console.log("City not found");
  return;
}

  const transformedData = transformWeatherData(data);
  console.log(transformedData);
  renderWeatherCard(transformedData);
}

function transformWeatherData(data){
  return {
    city: data.name,
    date: "Today",
    condition: data.weather[0].main,
    temperature: `${Math.round(data.main.temp)}°C`,
    wind: `${data.wind.speed} m/s`,
    humidity: `${data.main.humidity}%`,
    feelsLike: `${Math.round(data.main.feels_like)}°C`,
  }
}

//========================================================
// Init

renderWeatherCard(mockWeather);