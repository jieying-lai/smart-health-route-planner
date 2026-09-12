window.App = window.App || {};

window.App.PollutionMap = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    const waqiApiKey = '27fd825a35ab8ec84902c17823ea00f8f7433dbd'; // User provided key
    const locationIqKey = 'pk.450e8cc609ea4f382ea5b9673fd7a5a8';

    container.innerHTML = `
        <h1>Real-Time Air Pollution</h1>
        
        <div class="card">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: var(--text-dim);">Search Location</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="pollution-search" placeholder="Search location..." style="margin-bottom: 0;" />
                    <button id="pollution-search-btn" class="btn btn-primary" style="padding: 14px;">🔍</button>
                </div>
            </div>
            
            <div id="pollution-search-results" style="margin-top: 10px; max-height: 150px; overflow-y: auto; display: none; background: rgba(0,0,0,0.5); border-radius: 8px;"></div>
        </div>
        
        <div class="card" style="text-align: center; margin-bottom: 20px;">
            <h2 id="aqi-display" style="font-size: 4rem; margin: 10px 0;">--</h2>
            <p id="aqi-status" style="font-size: 1.5rem; font-weight: bold;">Loading Data...</p>
            <p id="aqi-city" style="opacity: 0.7;">Detecting location...</p>
        </div>

        <h3>Major Cities AQI</h3>
        <div id="cities-aqi" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">
            <div class="card" style="padding: 15px; text-align: center; margin: 0;">
                <p style="opacity: 0.7; font-size: 0.85rem;">Loading...</p>
            </div>
        </div>

        <div class="card" style="height: 400px; position: relative; overflow: hidden; padding: 0;">
            <div id="pollution-map" style="width: 100%; height: 100%; background: #1e293b;"></div>
        </div>

        <div class="card">
            <h3>Health Advice</h3>
            <p id="health-advice">Please wait while we analyze the air quality...</p>
        </div>
    `;

    setTimeout(() => {
        if (window.L) {
            try {
                const map = L.map(container.querySelector('#pollution-map')).setView([3.1390, 101.6869], 13);

                // Base Map (LocationIQ)
                L.tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${locationIqKey}`, {
                    attribution: '&copy; LocationIQ',
                    maxZoom: 18
                }).addTo(map);

                // WAQI Overlay Layer (Real-time Tiles)
                L.tileLayer(`https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${waqiApiKey}`, {
                    attribution: '&copy; WAQI',
                    opacity: 0.7
                }).addTo(map);

                // Function to get Color based on AQI
                const getAqiColor = (aqi) => {
                    if (aqi <= 50) return '#009966'; // Good
                    if (aqi <= 100) return '#ffde33'; // Moderate
                    if (aqi <= 150) return '#ff9933'; // Unhealthy for Sensitive
                    if (aqi <= 200) return '#cc0033'; // Unhealthy
                    if (aqi <= 300) return '#660099'; // Very Unhealthy
                    return '#7e0023'; // Hazardous
                };

                const getHealthAdvice = (aqi) => {
                    if (aqi <= 50) return "Air quality is good. Enjoy your outdoor activities!";
                    if (aqi <= 100) return "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.";
                    if (aqi <= 150) return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
                    if (aqi <= 200) return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
                    return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
                };

                // Fetch Data for User Location
                const fetchAqi = async (lat, lon) => {
                    try {
                        const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiApiKey}`);
                        const data = await response.json();

                        if (data.status === 'ok') {
                            const aqi = data.data.aqi;
                            const city = data.data.city.name;
                            const color = getAqiColor(aqi);

                            // Update UI
                            const aqiDisplay = container.querySelector('#aqi-display');
                            const aqiStatus = container.querySelector('#aqi-status');
                            const aqiCity = container.querySelector('#aqi-city');
                            const healthAdvice = container.querySelector('#health-advice');

                            aqiDisplay.textContent = aqi;
                            aqiDisplay.style.color = color;
                            aqiCity.textContent = `Station: ${city}`;
                            healthAdvice.textContent = getHealthAdvice(aqi);

                            // Set Status Text
                            if (aqi <= 50) aqiStatus.textContent = "Good";
                            else if (aqi <= 100) aqiStatus.textContent = "Moderate";
                            else if (aqi <= 150) aqiStatus.textContent = "Unhealthy for Sensitive Groups";
                            else if (aqi <= 200) aqiStatus.textContent = "Unhealthy";
                            else aqiStatus.textContent = "Hazardous";
                            aqiStatus.style.color = color;

                            // Add Marker to Map
                            L.circle([lat, lon], {
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.5,
                                radius: 500
                            }).addTo(map).bindPopup(`
                                <strong>AQI: ${aqi}</strong><br>
                                ${city}
                            `).openPopup();

                            // Notify Assistant
                            if (window.assistant) {
                                if (aqi > 100) {
                                    window.assistant.say(`Warning! Air quality is bad (${aqi}). Please wear a mask! 😷`);
                                    if (typeof window.assistant.setMood === 'function') {
                                        window.assistant.setMood('worried');
                                    }
                                } else {
                                    window.assistant.say(`Air quality is good (${aqi}). Great for a walk! 🌳`);
                                    if (typeof window.assistant.setMood === 'function') {
                                        window.assistant.setMood('happy');
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error("WAQI Fetch Error", e);
                        container.querySelector('#aqi-status').textContent = "Data Unavailable";
                    }
                };

                // Use Global Location Service
                window.getLocation().then(coords => {
                    map.setView([coords.lat, coords.lon], 12);
                    fetchAqi(coords.lat, coords.lon);
                }).catch(error => {
                    console.error('Location service error:', error);
                    // Fallback to KL
                    fetchAqi(3.1390, 101.6869);
                });

                // Search functionality with autocomplete
                const searchBtn = container.querySelector('#pollution-search-btn');
                const searchInput = container.querySelector('#pollution-search');
                const resultsContainer = container.querySelector('#pollution-search-results');
                let userLocation = null;

                // Store user location for distance calculation
                window.getLocation().then(coords => {
                    userLocation = coords;
                }).catch(() => {
                    userLocation = null;
                });

                const performSearch = async () => {
                    const query = searchInput.value.trim();
                    if (!query) return;

                    try {
                        let searchUrl = `https://us1.locationiq.com/v1/search.php?key=${locationIqKey}&q=${encodeURIComponent(query)}&format=json&countrycodes=my`;

                        if (userLocation) {
                            const delta = 0.5;
                            const viewbox = `${userLocation.lon - delta},${userLocation.lat + delta},${userLocation.lon + delta},${userLocation.lat - delta}`;
                            searchUrl += `&viewbox=${viewbox}&bounded=1`;
                        }

                        const response = await fetch(searchUrl);
                        const data = await response.json();

                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'block';

                        if (Array.isArray(data) && data.length > 0) {
                            let sortedData = data;
                            if (userLocation) {
                                sortedData = data.sort((a, b) => {
                                    const distA = Math.sqrt(Math.pow(a.lat - userLocation.lat, 2) + Math.pow(a.lon - userLocation.lon, 2));
                                    const distB = Math.sqrt(Math.pow(b.lat - userLocation.lat, 2) + Math.pow(b.lon - userLocation.lon, 2));
                                    return distA - distB;
                                });
                            }

                            for (const place of sortedData.slice(0, 5)) {
                                const item = document.createElement('div');
                                item.style.padding = '10px';
                                item.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                                item.style.cursor = 'pointer';

                                let distanceText = '';
                                if (userLocation) {
                                    const R = 6371;
                                    const dLat = (place.lat - userLocation.lat) * Math.PI / 180;
                                    const dLon = (place.lon - userLocation.lon) * Math.PI / 180;
                                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(place.lat * Math.PI / 180) *
                                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    const distance = R * c;
                                    distanceText = ` (${distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(1) + 'km'} away)`;
                                }

                                const displayName = place.display_name.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim() || place.display_name;

                                item.innerHTML = `
                                    <div style="font-weight: 500;">${displayName.split(',')[0]}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">
                                        ${displayName.split(',').slice(1, 3).join(',')}${distanceText}
                                    </div>
                                `;

                                item.addEventListener('click', () => {
                                    const lat = parseFloat(place.lat);
                                    const lon = parseFloat(place.lon);

                                    map.setView([lat, lon], 12);
                                    fetchAqi(lat, lon);

                                    resultsContainer.style.display = 'none';
                                    searchInput.value = displayName.split(',')[0];

                                    if (window.assistant) {
                                        window.assistant.say(`Checking air quality at ${displayName.split(',')[0]}...`);
                                    }
                                });

                                resultsContainer.appendChild(item);
                            }
                        } else {
                            resultsContainer.innerHTML = '<div style="padding: 10px; color: var(--text-dim);">No results found</div>';
                        }
                    } catch (error) {
                        console.error('Search error:', error);
                        resultsContainer.innerHTML = '<div style="padding: 10px; color: var(--text-dim);">Search failed. Please try again.</div>';
                    }
                };

                searchBtn.addEventListener('click', performSearch);
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') performSearch();
                });

                // Fetch multiple cities AQI
                const fetchMultipleCities = async () => {
                    const cities = [
                        { name: 'Kuala Lumpur', coords: '@3.1390;101.6869' },
                        { name: 'Penang', coords: '@5.4141;100.3288' },
                        { name: 'Johor Bahru', coords: '@1.4927;103.7414' },
                        { name: 'Kuching', coords: '@1.5535;110.3593' },
                        { name: 'Kota Kinabalu', coords: '@5.9804;116.0735' },
                        { name: 'Ipoh', coords: '@4.5975;101.0901' }
                    ];

                    const citiesContainer = container.querySelector('#cities-aqi');
                    citiesContainer.innerHTML = '';

                    for (const city of cities) {
                        try {
                            const response = await fetch(`https://api.waqi.info/feed/geo:${city.coords}/?token=${waqiApiKey}`);
                            const data = await response.json();

                            if (data.status === 'ok') {
                                const aqi = data.data.aqi;
                                const color = getAqiColor(aqi);

                                const card = document.createElement('div');
                                card.className = 'card';
                                card.style.padding = '15px';
                                card.style.textAlign = 'center';
                                card.style.margin = '0';
                                card.style.cursor = 'pointer';
                                card.style.borderLeft = `4px solid ${color}`;
                                card.innerHTML = `
                                    <h3 style="font-size: 2rem; margin: 5px 0; color: ${color};">${aqi}</h3>
                                    <p style="font-size: 0.85rem; opacity: 0.9;">${city.name}</p>
                                `;

                                card.addEventListener('click', () => {
                                    const coords = city.coords.replace('@', '').split(';');
                                    map.setView([parseFloat(coords[0]), parseFloat(coords[1])], 12);
                                    fetchAqi(parseFloat(coords[0]), parseFloat(coords[1]));
                                });

                                citiesContainer.appendChild(card);
                            }
                        } catch (e) {
                            console.error(`Failed to fetch ${city.name}:`, e);
                        }
                    }
                };

                // Load major cities AQI
                fetchMultipleCities();

                // Add click event to map for interactive pollution checking
                let clickMarker = null; // Store the marker to remove it on next click

                map.on('click', async function (e) {
                    const lat = e.latlng.lat;
                    const lon = e.latlng.lng;

                    // Remove previous click marker if exists
                    if (clickMarker) {
                        map.removeLayer(clickMarker);
                    }

                    // Zoom in slightly (10% more) from current zoom level
                    const currentZoom = map.getZoom();
                    const newZoom = Math.min(currentZoom + 1, 18); // Increase by 1 level, max 18

                    map.setView([lat, lon], newZoom, {
                        animate: true,
                        duration: 0.5
                    });

                    // Show loading indicator on the marker position
                    clickMarker = L.circle([lat, lon], {
                        color: '#888',
                        fillColor: '#888',
                        fillOpacity: 0.3,
                        radius: 300
                    }).addTo(map).bindPopup(`
                        <div style="text-align: center;">
                            <strong>Loading...</strong><br>
                            Fetching air quality data...
                        </div>
                    `).openPopup();

                    // Fetch AQI data for clicked location
                    try {
                        const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiApiKey}`);
                        const data = await response.json();

                        if (data.status === 'ok') {
                            const aqi = data.data.aqi;
                            const city = data.data.city.name;
                            const color = getAqiColor(aqi);

                            // Update the main AQI display
                            const aqiDisplay = container.querySelector('#aqi-display');
                            const aqiStatus = container.querySelector('#aqi-status');
                            const aqiCity = container.querySelector('#aqi-city');
                            const healthAdvice = container.querySelector('#health-advice');

                            aqiDisplay.textContent = aqi;
                            aqiDisplay.style.color = color;
                            aqiCity.textContent = `Station: ${city}`;
                            healthAdvice.textContent = getHealthAdvice(aqi);

                            // Set Status Text
                            if (aqi <= 50) aqiStatus.textContent = "Good";
                            else if (aqi <= 100) aqiStatus.textContent = "Moderate";
                            else if (aqi <= 150) aqiStatus.textContent = "Unhealthy for Sensitive Groups";
                            else if (aqi <= 200) aqiStatus.textContent = "Unhealthy";
                            else aqiStatus.textContent = "Hazardous";
                            aqiStatus.style.color = color;

                            // Update marker with actual data
                            map.removeLayer(clickMarker);
                            clickMarker = L.circle([lat, lon], {
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.5,
                                radius: 500
                            }).addTo(map).bindPopup(`
                                <div style="text-align: center;">
                                    <strong style="font-size: 1.2rem; color: ${color};">AQI: ${aqi}</strong><br>
                                    <span style="font-weight: bold;">${aqiStatus.textContent}</span><br>
                                    <span style="font-size: 0.85rem; opacity: 0.8;">${city}</span><br>
                                    <span style="font-size: 0.75rem; margin-top: 5px; display: block;">${getHealthAdvice(aqi)}</span>
                                </div>
                            `).openPopup();

                            // Notify assistant
                            if (window.assistant) {
                                window.assistant.say(`Air quality at this location: AQI ${aqi} (${aqiStatus.textContent}) 🌍`);
                            }
                        } else {
                            // No data available for this location
                            map.removeLayer(clickMarker);
                            clickMarker = L.circle([lat, lon], {
                                color: '#666',
                                fillColor: '#666',
                                fillOpacity: 0.3,
                                radius: 300
                            }).addTo(map).bindPopup(`
                                <div style="text-align: center;">
                                    <strong>No Data Available</strong><br>
                                    <span style="font-size: 0.85rem;">No air quality station found near this location</span>
                                </div>
                            `).openPopup();

                            if (window.assistant) {
                                window.assistant.say("Sorry, no air quality data available for this location 😕");
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching AQI for clicked location:', error);

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
                                <span style="font-size: 0.85rem;">Failed to fetch air quality data</span>
                            </div>
                        `).openPopup();

                        if (window.assistant) {
                            window.assistant.say("Oops! Failed to get air quality data. Please try again 😓");
                        }
                    }
                });

            } catch (e) {
                console.error("Map init failed", e);
            }
        }
    }, 100);

    return container;
};
