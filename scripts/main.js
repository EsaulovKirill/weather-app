const API_KEY = "38d2c232dcaa66f3d3ec7034b86ecc70";

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
