const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const apiKey = '2e27d69f30e2f798409b5a899ca38a47';

const weatherImg = document.querySelector('.weather');
const tempTxt = document.querySelector('.temp-txt');
const weatherCondition = document.querySelector('.weather-condition');
const humidityValue = document.querySelector('.humidity-value');
const windValue = document.querySelector('.wind-value');
const countryNames = document.querySelector('.country-names');
const countryDate = document.querySelector('.country-date');

const forecastItems = document.querySelectorAll('.forcast-item');

function getFormattedDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return new Intl.DateTimeFormat('en-US', options).format(date);  // e.g., "Fri, 06 Jun"
}

function getDayMonth(dateObj) {
  const options = { day: '2-digit', month: 'short' };
  return dateObj.toLocaleDateString('en-US', options);
}

function updateWeatherUI(data, cityName, country) {
  const iconCode = data.weather[0].icon;
  const temp = (data.main.temp - 273.15).toFixed(1);
  const weatherDesc = data.weather[0].main;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  tempTxt.innerText = `${temp}°C`;
  weatherCondition.innerText = weatherDesc;
  humidityValue.innerText = `${humidity}%`;
  windValue.innerText = `${windSpeed} km/s`;
  countryNames.innerText = `${cityName}, ${country}`;

  const today = new Date();
  countryDate.innerText = getFormattedDate(today.toISOString());
}

function updateForecastUI(forecastList) {
  let usedDates = new Set();
  let index = 0;

  for (let i = 0; i < forecastList.length && index < 4; i++) {
    const forecast = forecastList[i];
    const date = forecast.dt_txt.split(' ')[0];

    if (!usedDates.has(date)) {
      usedDates.add(date);

      const forecastDate = new Date(forecast.dt_txt);
      const iconCode = forecast.weather[0].icon;
      const temp = (forecast.main.temp - 273.15).toFixed(1);

      forecastItems[index].querySelector('.forcast-item-date').innerText = getDayMonth(forecastDate);
      forecastItems[index].querySelector('.forcast-img').src = `https://openweathermap.org/img/wn/${iconCode}.png`;
      forecastItems[index].querySelector('.forcast-temp').innerText = `${temp} °C`;

      index++;
    }
  }
}

function getWeatherDetails(name, lat, lon, country) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(weatherURL)
    .then(res => res.json())
    .then(data => updateWeatherUI(data, name, country))
    .catch(() => alert('Failed to fetch current weather'));

  fetch(forecastURL)
    .then(res => res.json())
    .then(data => updateForecastUI(data.list))
    .catch(() => alert('Failed to fetch forecast data'));
}

function getCityCoordinates() {
  const city = cityInput.value.trim();
  if (!city) return;

  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;

  fetch(geoURL)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert(`City "${city}" not found.`);
        return;
      }
      const { name, lat, lon, country } = data[0];
      getWeatherDetails(name, lat, lon, country);
    })
    .catch(() => alert('Failed to fetch city coordinates'));
}

searchBtn.addEventListener('click', getCityCoordinates);
const modeToggle = document.getElementById('mode-toggle');

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    modeToggle.innerText = '☀️ Light Mode';
  } else {
    modeToggle.innerText = '🌙 Dark Mode';
  }
});
