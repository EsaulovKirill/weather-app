const API_KEY = "";

const url = `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${API_KEY}&units=metric&lang=en`;

fetch(url)
  .then((res) => res.json())
  .then((data) => console.log(data));

//========================================================
const unitToggle = document.querySelector(".weather-controls__unit-toggle");

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

const periodToggle = document.querySelector(".weather-controls__period-toggle");

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

const form = document.querySelector(".weather-controls__search-form");
const searchInput = document.querySelector(".weather-controls__search");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (!city) {
    return;
  }
  console.log(city);
  const searchedWeather = {
    ...mockWeather,
    city: city
  }

  renderWeatherCard(searchedWeather)
  searchInput.value = "";
  searchInput.focus();
});


const mockWeather = {
  city: "Mosc222ow",
  date: "Tuesday, 20:52",
  condition: "Cloudy",
  temperature: "293°C",
  wind: "0 km/h",
  humidity: "0%",
  feelsLike: "0°C",
};

const cityElement = document.querySelector('.weather-card__city')
const dateElement = document.querySelector('.weather-card__date')
const conditionElement = document.querySelector('.weather-card__condition')
const temperatureElement = document.querySelector('.weather-card__temperature')
const windElement = document.querySelector('.weather-card__wind')
const humidityElement = document.querySelector('.weather-card__humidity')
const feelsLikeElement = document.querySelector('.weather-card__feels-like')

function renderWeatherCard (weatherData) {
  cityElement.textContent = weatherData.city
  dateElement.textContent = weatherData.date
  conditionElement.textContent = weatherData.condition
  temperatureElement.textContent = weatherData.temperature
  windElement.textContent = weatherData.wind
  humidityElement.textContent = weatherData.humidity
  feelsLikeElement.textContent = weatherData.feelsLike
}
renderWeatherCard(mockWeather)