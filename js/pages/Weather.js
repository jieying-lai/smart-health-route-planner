window.App = window.App || {};

window.App.Weather = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    const locationIqKey = 'pk.450e8cc609ea4f382ea5b9673fd7a5a8';

    container.innerHTML = `
        <h1>Weather Forecast</h1>
        
        <!-- Current Weather - Premium Design -->
        <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 30px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
            
            <div style="position: relative; z-index: 1;">
                <p id="location" style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 10px; color: white;">📍 Detecting...</p>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                    <div>
                        <h2 id="temperature" style="font-size: 4.5rem; font-weight: 200; margin: 0; color: white;">--°</h2>
                        <p id="description" style="font-size: 1.3rem; text-transform: capitalize; opacity: 0.95; color: white; margin-top: 5px;">Loading...</p>
                    </div>
                    <div id="weather-icon" style="font-size: 6rem; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));">🌤️</div>
                </div>
                
                <div style="display: flex; gap: 15px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div style="flex: 1; text-align: center;">
                        <p style="font-size: 0.85rem; opacity: 0.8; color: white;">Feels Like</p>
                        <strong id="feels-like" style="font-size: 1.3rem; color: white;">--°</strong>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <p style="font-size: 0.85rem; opacity: 0.8; color: white;">Humidity</p>
                        <strong id="humidity" style="font-size: 1.3rem; color: white;">--%</strong>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <p style="font-size: 0.85rem; opacity: 0.8; color: white;">Wind</p>
                        <strong id="wind" style="font-size: 1.3rem; color: white;">--</strong>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <p style="font-size: 0.85rem; opacity: 0.8; color: white;">UV Index</p>
                        <strong id="uv-index" style="font-size: 1.3rem; color: white;">--</strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- Interactive Map -->
        <h3 style="margin-top: 25px; margin-bottom: 15px;">🗺️ Interactive Weather Map</h3>
        <div class="card" style="height: 400px; position: relative; overflow: hidden; padding: 0; margin-bottom: 20px;">
            <div id="weather-map" style="width: 100%; height: 100%; background: #1e293b;"></div>
        </div>

        <!-- Hourly Forecast -->
        <h3 style="margin-top: 25px; margin-bottom: 15px;">📅 Hourly Forecast</h3>
        <div id="hourly-forecast" style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 20px;">
            <div class="card" style="min-width: 100px; text-align: center; margin-bottom: 0; padding: 18px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1));">
                <p style="font-size: 0.85rem; opacity: 0.7;">Loading...</p>
            </div>
        </div>

        <!-- Weekly Forecast -->
        <h3 style="margin-bottom: 15px;">🗓️ 7-Day Forecast</h3>
        <div id="daily-forecast" style="display: flex; flex-direction: column; gap: 10px;">
            <div class="card" style="padding: 15px; margin: 0;">
                <p style="opacity: 0.7;">Loading...</p>
            </div>
        </div>
    `;

    // Fetch Weather Data
    const fetchWeather = async (lat, lon, cityName = 'Your Location') => {
        try {
            console.log(`Fetching weather for lat:${lat}, lon:${lon}`);

            // Open-Meteo API with daily forecast and UV index
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

            const response = await fetch(weatherUrl);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            console.log('Weather data:', data);

            // Current weather
            const temp = Math.round(data.current.temperature_2m);
            const feelsLike = Math.round(data.current.apparent_temperature);
            const humidity = data.current.relative_humidity_2m;
            const windSpeed = Math.round(data.current.wind_speed_10m);
            const weatherCode = data.current.weather_code;
            const uvIndex = data.daily.uv_index_max[0] ? Math.round(data.daily.uv_index_max[0]) : 0;

            // Weather mapping
            const weatherMap = {
                0: { desc: 'Clear sky', icon: '☀️', gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)' },
                1: { desc: 'Mainly clear', icon: '🌤️', gradient: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' },
                2: { desc: 'Partly cloudy', icon: '⛅', gradient: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)' },
                3: { desc: 'Overcast', icon: '☁️', gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)' },
                45: { desc: 'Foggy', icon: '🌫️', gradient: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)' },
                48: { desc: 'Foggy', icon: '🌫️', gradient: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)' },
                51: { desc: 'Light drizzle', icon: '🌦️', gradient: 'linear-gradient(135deg, #7DD3FC 0%, #3B82F6 100%)' },
                61: { desc: 'Light rain', icon: '🌧️', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' },
                63: { desc: 'Rain', icon: '🌧️', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' },
                65: { desc: 'Heavy rain', icon: '🌧️', gradient: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)' },
                71: { desc: 'Light snow', icon: '🌨️', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' },
                80: { desc: 'Rain showers', icon: '🌦️', gradient: 'linear-gradient(135deg, #7DD3FC 0%, #3B82F6 100%)' },
                95: { desc: 'Thunderstorm', icon: '⛈️', gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)' }
            };

            const weather = weatherMap[weatherCode] || weatherMap[1];

            // Update main card gradient
            const mainCard = container.querySelector('.card');
            mainCard.style.background = weather.gradient;

            // Get UV level description and color
            const getUVLevel = (uv) => {
                if (uv <= 2) return { level: 'Low', color: '#10b981' };
                if (uv <= 5) return { level: 'Moderate', color: '#f59e0b' };
                if (uv <= 7) return { level: 'High', color: '#f97316' };
                if (uv <= 10) return { level: 'Very High', color: '#dc2626' };
                return { level: 'Extreme', color: '#7e22ce' };
            };
            const uvLevel = getUVLevel(uvIndex);

            // Update display
            container.querySelector('#temperature').textContent = `${temp}°`;
            container.querySelector('#location').textContent = `📍 ${cityName}`;
            container.querySelector('#description').textContent = weather.desc;
            container.querySelector('#weather-icon').textContent = weather.icon;
            container.querySelector('#feels-like').textContent = `${feelsLike}°`;
            container.querySelector('#humidity').textContent = `${humidity}%`;
            container.querySelector('#wind').textContent = `${windSpeed} km/h`;
            const uvElement = container.querySelector('#uv-index');
            uvElement.innerHTML = `${uvIndex}<br><span style="font-size: 0.75rem; opacity: 0.9;">${uvLevel.level}</span>`;
            uvElement.style.color = uvLevel.color;

            // AI reactions
            if (window.assistant) {
                if (temp > 30) {
                    window.assistant.say(`It's hot (${temp}°C)! Stay cool! 🥵`);
                } else if (weatherCode >= 61 && weatherCode <= 65) {
                    window.assistant.say(`It's raining! Umbrella time! ☔`);
                }
            }

            // Hourly Forecast
            const hourlyContainer = container.querySelector('#hourly-forecast');
            hourlyContainer.innerHTML = '';
            const currentHour = new Date().getHours();

            for (let i = 0; i < 8; i++) {
                const hourIndex = currentHour + i;
                if (hourIndex >= data.hourly.temperature_2m.length) break;

                const hourTemp = Math.round(data.hourly.temperature_2m[hourIndex]);
                const hourCode = data.hourly.weather_code[hourIndex];
                const hourWeather = weatherMap[hourCode] || weatherMap[1];

                const time = new Date();
                time.setHours(currentHour + i, 0, 0, 0);
                const timeStr = i === 0 ? 'Now' : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

                const card = document.createElement('div');
                card.className = 'card';
                card.style.cssText = 'min-width: 100px; text-align: center; margin-bottom: 0; padding: 18px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.2);';
                card.innerHTML = `
                    <p style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 10px;">${timeStr}</p>
                    <div style="font-size: 2.2rem; margin: 12px 0;">${hourWeather.icon}</div>
                    <strong style="font-size: 1.2rem;">${hourTemp}°</strong>
                `;
                hourlyContainer.appendChild(card);
            }

            // Daily Forecast (7 days)
            const dailyContainer = container.querySelector('#daily-forecast');
            dailyContainer.innerHTML = '';
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 0; i < 7; i++) {
                if (i >= data.daily.temperature_2m_max.length) break;

                const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
                const minTemp = Math.round(data.daily.temperature_2m_min[i]);
                const code = data.daily.weather_code[i];
                const dayWeather = weatherMap[code] || weatherMap[1];

                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[date.getDay()];

                const card = document.createElement('div');
                card.className = 'card';
                card.style.cssText = 'padding: 18px; margin: 0; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));';
                card.innerHTML = `
                    <div style="flex: 1;">
                        <strong style="font-size: 1.1rem;">${dayName}</strong>
                        <p style="font-size: 0.85rem; opacity: 0.6; margin-top: 3px;">${dayWeather.desc}</p>
                    </div>
                    <div style="font-size: 2rem; margin: 0 20px;">${dayWeather.icon}</div>
                    <div style="text-align: right;">
                        <strong style="font-size: 1.2rem;">${maxTemp}°</strong>
                        <span style="opacity: 0.5; margin-left: 8px;">${minTemp}°</span>
                    </div>
                `;
                dailyContainer.appendChild(card);
            }

            return { temp, weather, weatherCode };

        } catch (error) {
            console.error('Weather error:', error);
            container.querySelector('#description').textContent = 'Failed to load';
            if (window.assistant) window.assistant.say('Weather error 😔');
            return null;
        }
    };

    // Initialize Map
    setTimeout(() => {
        if (window.L) {
            try {
                const map = L.map(container.querySelector('#weather-map')).setView([3.1390, 101.6869], 13);

                // Base Map (LocationIQ)
                L.tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${locationIqKey}`, {
                    attribution: '&copy; LocationIQ',
                    maxZoom: 18
                }).addTo(map);

                // Function to get weather icon color based on temperature
                const getTempColor = (temp) => {
                    if (temp >= 35) return '#dc2626'; // Very hot - red
                    if (temp >= 30) return '#f97316'; // Hot - orange
                    if (temp >= 25) return '#f59e0b'; // Warm - amber
                    if (temp >= 20) return '#10b981'; // Pleasant - green
                    if (temp >= 15) return '#3b82f6'; // Cool - blue
                    return '#6366f1'; // Cold - indigo
                };

                let clickMarker = null;

                // Add click event to map for interactive weather checking
                map.on('click', async function (e) {
                    const lat = e.latlng.lat;
                    const lon = e.latlng.lng;

                    // Remove previous click marker if exists
                    if (clickMarker) {
                        map.removeLayer(clickMarker);
                    }

                    // Zoom in slightly from current zoom level
                    const currentZoom = map.getZoom();
                    const newZoom = Math.min(currentZoom + 1, 18);

                    map.setView([lat, lon], newZoom, {
                        animate: true,
                        duration: 0.5
                    });

                    // Show loading indicator
                    clickMarker = L.circle([lat, lon], {
                        color: '#888',
                        fillColor: '#888',
                        fillOpacity: 0.3,
                        radius: 300
                    }).addTo(map).bindPopup(`
                        <div style="text-align: center;">
                            <strong>Loading...</strong><br>
                            Fetching weather data...
                        </div>
                    `).openPopup();

                    // Get city name from reverse geocoding
                    let cityName = 'Unknown Location';
                    try {
                        const geoUrl = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`;
                        const geoResponse = await fetch(geoUrl);
                        const geoData = await geoResponse.json();
                        // Prioritize neighborhood/suburb/area names first for specific locations like "Bukit Tinggi"
                        cityName = geoData.address?.neighbourhood ||
                            geoData.address?.suburb ||
                            geoData.address?.village ||
                            geoData.address?.town ||
                            geoData.address?.city ||
                            geoData.address?.county ||
                            geoData.address?.state ||
                            'Unknown Location';
                    } catch (e) {
                        console.log('Geocoding failed, using default name');
                    }

                    // Fetch weather data for clicked location
                    const weatherData = await fetchWeather(lat, lon, cityName);

                    if (weatherData) {
                        const { temp, weather, weatherCode } = weatherData;
                        const color = getTempColor(temp);

                        // Update marker with actual weather data
                        map.removeLayer(clickMarker);
                        clickMarker = L.circle([lat, lon], {
                            color: color,
                            fillColor: color,
                            fillOpacity: 0.5,
                            radius: 500
                        }).addTo(map).bindPopup(`
                            <div style="text-align: center; min-width: 150px;">
                                <div style="font-size: 2.5rem; margin: 5px 0;">${weather.icon}</div>
                                <strong style="font-size: 1.5rem; color: ${color};">${temp}°C</strong><br>
                                <span style="font-weight: bold; text-transform: capitalize;">${weather.desc}</span><br>
                                <span style="font-size: 0.85rem; opacity: 0.8;">${cityName}</span>
                            </div>
                        `).openPopup();

                        // Notify assistant
                        if (window.assistant) {
                            window.assistant.say(`Weather at ${cityName}: ${temp}°C, ${weather.desc} ${weather.icon}`);
                        }
                    } else {
                        // Show error on marker
                        map.removeLayer(clickMarker);
                        clickMarker = L.circle([lat, lon], {
                            color: '#ff0000',
                            fillColor: '#ff0000',
                            fillOpacity: 0.3,
                            radius: 300
                        }).addTo(map).bindPopup(`
                            <div style="text-align: center;">
                                <strong>Error</strong><br>
                                <span style="font-size: 0.85rem;">Failed to fetch weather data</span>
                            </div>
                        `).openPopup();

                        if (window.assistant) {
                            window.assistant.say("Oops! Failed to get weather data. Please try again 😓");
                        }
                    }
                });

                // Load initial weather for user location
                window.getLocation().then(coords => {
                    map.setView([coords.lat, coords.lon], 12);
                    fetchWeather(coords.lat, coords.lon).then(weatherData => {
                        if (weatherData) {
                            const { temp, weather } = weatherData;
                            const color = getTempColor(temp);

                            // Add marker for user's location
                            L.circle([coords.lat, coords.lon], {
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.5,
                                radius: 500
                            }).addTo(map).bindPopup(`
                                <div style="text-align: center; min-width: 150px;">
                                    <div style="font-size: 2.5rem; margin: 5px 0;">${weather.icon}</div>
                                    <strong style="font-size: 1.5rem; color: ${color};">${temp}°C</strong><br>
                                    <span style="font-weight: bold; text-transform: capitalize;">${weather.desc}</span><br>
                                    <span style="font-size: 0.85rem; opacity: 0.8;">Your Location</span>
                                </div>
                            `);
                        }
                    });
                }).catch(error => {
                    console.error('Location service error:', error);
                    // Fallback to KL
                    fetchWeather(3.1390, 101.6869, 'Kuala Lumpur');
                });

            } catch (e) {
                console.error("Map init failed", e);
            }
        }
    }, 100);

    return container;
};
