const apiKey = '376680d13d0d4f19bf9140732241610';
let tempChart;
const defaultCity = 'Bangladesh'; 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('city-input').value = defaultCity; 
    getWeather();
});


async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        console.log(data);
        
        updateUI(data);
        updateChart(data.forecast.forecastday); 
        updateForecast(data.forecast.forecastday); 
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function updateUI(data) {
    document.querySelector('.temp').textContent = `${data.current.temp_c}°`;
    document.querySelector('.city').textContent = `${data.location.name}, ${data.location.country}`;
    document.querySelector('.time').textContent = formatTime(data.location.localtime);
    document.querySelector('.humidity').textContent = `${data.current.humidity}%`;
    document.querySelector('.uv-index').textContent = data.current.uv;
    document.querySelector('.sunset').textContent = data.forecast.forecastday[0].astro.sunset;
    document.querySelector('.sunrise').textContent = data.forecast.forecastday[0].astro.sunrise;
    document.querySelector('.rainfall').textContent = `${data.current.precip_mm} mm`;
}


function formatTime(localtime) {
    const timeParts = localtime.split(' ');
    return timeParts[1];
}

function updateChart(forecastDays) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    const tempData = forecastDays.map(day => day.day.avgtemp_c);
    const labels = forecastDays.map(day => day.date);

    if (tempChart) {
        tempChart.destroy();
    }

    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: tempData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}


function updateForecast(forecastDays) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; 

    forecastDays.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow');
        
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = `${day.day.avgtemp_c}°C`;
        const icon = day.day.condition.icon;

        forecastCard.innerHTML = `
            <img src="https:${icon}" alt="${day.day.condition.text}" class="w-12 h-12 mx-auto">
            <p class="text-center font-bold">${date}</p>
            <p class="text-center">${temp}</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}

