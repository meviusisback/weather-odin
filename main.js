function init() {
  document.getElementById("submit-button").addEventListener("click", handleSubmit);

  // Set initial focus on the location input
  const locationInput = document.getElementById('location-text');
  if (locationInput) {
    locationInput.focus();
  }
}

init();

function handleSubmit(event) {
  event.preventDefault();

  const locationInput = document.getElementById('location-text');
  const location = locationInput.value;

  const validation = validateLocation(location);
  if (!validation.isValid) {
    displayError(validation.message);
    return;
  }

  // Clear previous results
  const weatherBox = document.querySelector('.box');
  weatherBox.innerHTML = '<p>Loading weather data...</p>';
  weatherBox.classList.add('show');

  // Fetch weather data
  weatherFetch(location.trim());
}

function weatherFetch(location) {
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=GSPMHDELQFPNP36FHDL9GSBG9&contentType=json`,
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((err) => {
      displayError(err.message || 'Failed to fetch weather data');
    });
}

function displayWeather(data) {
  const weatherBox = document.querySelector('.box');

  const location = data.resolvedAddress;
  const currentConditions = data.currentConditions;
  const today = data.days[0];

  const weatherHTML = `
    <h2>${location}</h2>
    <div class="current-weather">
      <h3>Current Conditions</h3>
      <p><strong>Temperature:</strong> ${currentConditions.temp}°F</p>
      <p><strong>Feels like:</strong> ${currentConditions.feelslike}°F</p>
      <p><strong>Conditions:</strong> ${currentConditions.conditions}</p>
      <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} mph</p>
    </div>
    <div class="today-forecast">
      <h3>Today's Forecast</h3>
      <p><strong>High:</strong> ${today.tempmax}°F</p>
      <p><strong>Low:</strong> ${today.tempmin}°F</p>
      <p><strong>Description:</strong> ${today.description}</p>
    </div>
  `;

  weatherBox.innerHTML = weatherHTML;
  weatherBox.classList.add('show');
}

function displayError(message) {
  const weatherBox = document.querySelector('.box');
  weatherBox.innerHTML = `
    <div class="error-message">
      <h3>Error</h3>
      <p>${message}</p>
      <p>Please try again with a different location.</p>
    </div>
  `;
  weatherBox.classList.add('show');
}

function clearWeather() {
  const weatherBox = document.querySelector('.box');
  weatherBox.innerHTML = '';
  weatherBox.classList.remove('show');
}

function validateLocation(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, message: 'Location cannot be empty' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, message: 'Location must be at least 2 characters long' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, message: 'Location name is too long' };
  }

  // Check for invalid characters (only allow letters, numbers, spaces, commas, hyphens)
  const validPattern = /^[a-zA-Z0-9\s,\-\.]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, message: 'Location contains invalid characters' };
  }

  return { isValid: true };
}
