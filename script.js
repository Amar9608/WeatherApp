const apiKey = ' 514675b74a6d4129bb044255251702 ';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const temperature = document.querySelector('.temperature');
const locationName = document.querySelector('.location');
const dateElement = document.querySelector('.date');
const weatherCondition = document.querySelector('.weather-condition');
const weatherIconElement = document.getElementById('weather-icon');
const cloudiness = document.getElementById('cloudiness');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const errorMessage = document.querySelector('.error-message');
const weatherSection = document.querySelector('.weather-section');
const locationItems = document.querySelectorAll('.locations li'); // Get all locations in the list

// Event Listener for Manual Search
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        errorMessage.textContent = 'Please enter a valid city name!';
    }
});

// Event Listener for Clicking on a Location List Item
locationItems.forEach(item => {
    item.addEventListener('click', () => {
        const city = item.textContent; // Get city name from clicked item
        cityInput.value = city; // Set search bar value
        getWeather(city); // Fetch weather for selected city
    });
});

async function getWeather(city) {
    try {
        console.log(`Fetching weather for: ${city}`);

        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        if (!response.ok) {
            throw new Error('City not found or API key invalid!');
        }

        const data = await response.json();
        console.log(data); // Log full response to check data format
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        errorMessage.textContent = error.message;
    }
}

function updateWeatherUI(data) {
    const { location, current } = data;
    const currentDate = new Date();

    temperature.innerHTML = `${Math.round(current.temp_c)}&deg;C`;
    locationName.textContent = location.name;
    dateElement.textContent = currentDate.toLocaleString();
    weatherCondition.textContent = current.condition.text;

    // Fix for weather icon issue
    if (weatherIconElement) {
        weatherIconElement.src = `https:${current.condition.icon}`;
        weatherIconElement.alt = current.condition.text;
    } else {
        console.error("Weather icon element not found!");
    }

    cloudiness.textContent = `${current.condition.text}`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    errorMessage.textContent = '';

    updateBackground(current.condition.text.toLowerCase());
}

function updateBackground(weatherType) {
    const backgrounds = {
        clear: 'url("Assets/clear-sky.jpg")',
        sunny: 'url("Assets/sunny.jpg")',
        cloudy: 'url("Assets/cloudy.jpg")',
        mist: 'url("Assets/mist.jpg")',
        rain: 'url("Assets/rainy.jpg")',
        snow: 'url("Assets/snowy.jpg")',
        default: 'url("Assets/bg.jpg")'
    };

    weatherSection.style.backgroundImage = backgrounds[weatherType] || backgrounds.default;
}

// Handle Enter Key for Search
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});
