const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardDiv = document.querySelector(".weather-cards");

const API_KEY = "3e29e565ae24a23c765c5f0fafc0d57f"; // API KEY from OpenWeatherMap API

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    const createWeatherCard = (weatherItem) => {
        return `
            <li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem[0].ion}@2x.png" alt="weather-icon">
                        <h4>Temperator: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </li>
        `;
    }

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        // Filter the forecast to get only forecast par day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate))  {
               return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
        })
    }).catch(() => {
        alert("An error occured while fetching the weather forecast")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra space
    if(!cityName) return; // Return if cityName is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitud, longitude and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates")
    })
}

searchButton.addEventListener("click", getCityCoordinates);