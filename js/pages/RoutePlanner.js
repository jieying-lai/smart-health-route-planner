window.App = window.App || {};

window.App.RoutePlanner = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    const apiKey = 'pk.450e8cc609ea4f382ea5b9673fd7a5a8';

    container.innerHTML = `
        <h1>AWhere?</h1>
        
        <div class="card">
            <h2>Plan Your Journey</h2>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: var(--text-dim);">Start Location</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="start-input" placeholder="Detecting location..." style="margin-bottom: 0;" />
                    <button id="locate-btn" class="btn btn-primary" style="padding: 14px;">📍</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: var(--text-dim);">Destination</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="search-input" placeholder="Search destination..." style="margin-bottom: 0;" />
                    <button id="search-btn" class="btn btn-primary" style="padding: 14px;">🔍</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: var(--text-dim);">Transportation Mode</label>
                <div style="display: flex; gap: 10px;">
                    <button class="mode-btn active" data-mode="driving-car" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;">
                        🚗 Driving
                    </button>
                    <button class="mode-btn" data-mode="foot-walking" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;">
                        🚶 Walking
                    </button>
                    <button class="mode-btn" data-mode="cycling-regular" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;">
                        🚲 Cycling
                    </button>
                </div>
            </div>
            
            <div id="search-results" style="margin-top: 10px; max-height: 150px; overflow-y: auto; display: none; background: rgba(0,0,0,0.5); border-radius: 8px;"></div>
            
            ${window.appState.theme === 'oku' ? `
            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px; background: rgba(74, 222, 128, 0.1); padding: 10px; border-radius: 8px; border: 1px solid #4ade80;">
                <span style="font-size: 1.2rem;">♿</span>
                <span style="font-weight: 500; color: #4ade80;">OKU Mode Active (Wheelchair Friendly)</span>
            </div>` : ''}
            
            ${window.appState.theme === 'parent' ? `
            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px; background: rgba(251, 191, 36, 0.1); padding: 10px; border-radius: 8px; border: 1px solid #fbbf24;">
                <span style="font-size: 1.2rem;">👶</span>
                <span style="font-weight: 500; color: #fbbf24;">Parent Mode Active (Stroller Friendly)</span>
            </div>` : ''}
            
            ${window.appState.theme === 'elderly' ? `
            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px; background: rgba(139, 92, 246, 0.1); padding: 10px; border-radius: 8px; border: 1px solid #8b5cf6;">
                <span style="font-size: 1.2rem;">👴</span>
                <span style="font-weight: 500; color: #8b5cf6;">Elderly Mode Active (Senior Friendly)</span>
            </div>` : ''}
            
            <div style="margin-top: 20px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
                <label style="display: block; margin-bottom: 10px; font-size: 0.9rem; color: var(--text-dim);">
                    ${window.appState.theme === 'parent' ? '👶 Family-Friendly Places Near You' :
            window.appState.theme === 'oku' ? '♿ Accessible Places Near You' :
                window.appState.theme === 'elderly' ? '👴 Senior-Friendly Places Near You' :
                    'Quick Suggestions Near You'}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${window.appState.theme === 'parent' ? `
                        <button class="suggestion-btn" data-category="park" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🌳 Parks & Gardens</button>
                        <button class="suggestion-btn" data-category="botanical_garden" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🌺 Botanical Garden</button>
                        <button class="suggestion-btn" data-category="zoo" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🦁 Zoo</button>
                        <button class="suggestion-btn" data-category="aquarium" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🐠 Aquarium</button>
                        <button class="suggestion-btn" data-category="beach" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🏖️ Beach/Lakeside</button>
                        <button class="suggestion-btn" data-category="playground" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🎡 Playground</button>
                        <button class="suggestion-btn" data-category="baby_cafe" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fbbf24;">🍼 Baby-Friendly Cafe</button>
                    ` : window.appState.theme === 'oku' ? `
                        <button class="suggestion-btn" data-category="oku_spots" style="background: rgba(74, 222, 128, 0.2); border: 1px solid #4ade80; color: #4ade80;">♿ Accessible Spots</button>
                        <button class="suggestion-btn" data-category="shopping_mall">🛍️ Mall</button>
                        <button class="suggestion-btn" data-category="restaurant">🍴 Restaurant</button>
                        <button class="suggestion-btn" data-category="cafe">☕ Cafe</button>
                        <button class="suggestion-btn" data-category="park">🌳 Park</button>
                        <button class="suggestion-btn" data-category="hospital">🏥 Hospital</button>
                    ` : window.appState.theme === 'elderly' ? `
                        <button class="suggestion-btn" data-category="hospital">🏥 Hospital</button>
                        <button class="suggestion-btn" data-category="clinic">🏥 Clinic</button>
                        <button class="suggestion-btn" data-category="pharmacy">💊 Pharmacy</button>
                        <button class="suggestion-btn" data-category="park">🌳 Park</button>
                        <button class="suggestion-btn" data-category="restaurant">🍴 Restaurant</button>
                        <button class="suggestion-btn" data-category="shopping_mall">🛍️ Mall</button>
                    ` : `
                        <button class="suggestion-btn" data-category="food_court">🍽️ Food Court</button>
                        <button class="suggestion-btn" data-category="shopping_mall">🛍️ Mall</button>
                        <button class="suggestion-btn" data-category="restaurant">🍴 Restaurant</button>
                        <button class="suggestion-btn" data-category="cafe">☕ Cafe</button>
                        <button class="suggestion-btn" data-category="night_market">🌙 Night Market</button>
                        <button class="suggestion-btn" data-category="park">🌳 Park</button>
                        <button class="suggestion-btn" data-category="hospital">🏥 Hospital</button>
                    `}
                </div>
            </div>
        </div>

        <div class="card" style="height: 400px; position: relative; overflow: hidden; padding: 0;">
            <div id="route-map" style="width: 100%; height: 100%; background: #1e293b;"></div>
        </div>

        <h3 style="margin-top: 25px; margin-bottom: 15px;">🤖 AI Health Suggestions</h3>
        <div id="nearby-places"></div>
    `;

    setTimeout(() => {
        if (window.L) {
            try {
                const map = L.map(container.querySelector('#route-map')).setView([3.1390, 101.6869], 13);

                L.tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${apiKey}`, {
                    attribution: '&copy; LocationIQ &copy; OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(map);

                const startInput = container.querySelector('#start-input');
                const locateBtn = container.querySelector('#locate-btn');
                let userMarker = null;
                let destMarker = null;

                const reverseGeocode = async (lat, lon) => {
                    try {
                        startInput.value = "Fetching address...";
                        const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&accept-language=en`);
                        const data = await response.json();
                        if (data && data.display_name) {
                            const englishOnly = data.display_name.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim();
                            startInput.value = englishOnly || data.display_name;
                        } else {
                            startInput.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                        }
                    } catch (error) {
                        console.error("Reverse geocoding failed", error);
                        startInput.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                    }
                };

                window.getLocation().then(coords => {
                    if (userMarker) map.removeLayer(userMarker);
                    map.setView([coords.lat, coords.lon], 14);
                    userMarker = L.marker([coords.lat, coords.lon]).addTo(map).bindPopup("You are here").openPopup();
                    reverseGeocode(coords.lat, coords.lon);
                }).catch(error => {
                    console.error('Location service error:', error);
                    startInput.placeholder = "Location unavailable. Type manually.";
                });

                locateBtn.addEventListener('click', () => {
                    window.getLocation().then(coords => {
                        if (userMarker) map.removeLayer(userMarker);
                        map.setView([coords.lat, coords.lon], 14);
                        userMarker = L.marker([coords.lat, coords.lon]).addTo(map).bindPopup("You are here").openPopup();
                        reverseGeocode(coords.lat, coords.lon);
                    });
                });

                const searchBtn = container.querySelector('#search-btn');
                const searchInput = container.querySelector('#search-input');
                const resultsContainer = container.querySelector('#search-results');
                const modeBtns = container.querySelectorAll('.mode-btn');
                let selectedMode = 'driving-car';

                modeBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        modeBtns.forEach(b => {
                            b.style.background = 'rgba(255,255,255,0.05)';
                            b.style.borderColor = 'var(--glass-border)';
                            b.classList.remove('active');
                        });
                        btn.style.background = 'rgba(59, 130, 246, 0.2)';
                        btn.style.borderColor = '#3B82F6';
                        btn.classList.add('active');
                        selectedMode = btn.getAttribute('data-mode');
                    });
                });

                // Set initial active state style
                const activeBtn = container.querySelector('.mode-btn.active');
                if (activeBtn) {
                    activeBtn.style.background = 'rgba(59, 130, 246, 0.2)';
                    activeBtn.style.borderColor = '#3B82F6';
                }

                // Helper to check accessibility via Overpass
                const checkAccessibility = async (lat, lon) => {
                    try {
                        const isParent = window.appState.theme === 'parent';
                        const isOku = window.appState.theme === 'oku';

                        // Query for nodes/ways around the point with wheelchair tag AND parent facilities AND smoking areas
                        const query = `[out:json][timeout:5];(
                            node(around:20,${lat},${lon})["wheelchair"];
                            way(around:20,${lat},${lon})["wheelchair"];
                            node(around:20,${lat},${lon})["smoking"];
                            way(around:20,${lat},${lon})["smoking"];
                            ${isParent ? `node(around:20,${lat},${lon})["changing_table"];
                            way(around:20,${lat},${lon})["changing_table"];
                            node(around:20,${lat},${lon})["baby_feeding"];
                            way(around:20,${lat},${lon})["baby_feeding"];
                            node(around:20,${lat},${lon})["amenity"="baby_hatch"];
                            node(around:20,${lat},${lon})["shelter"];` : ''}
                        );out tags;`;
                        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
                        const res = await fetch(url);
                        const data = await res.json();

                        let result = {
                            status: 'unknown',
                            text: isParent ? 'Facilities Unknown' : 'Accessibility Unknown',
                            facilities: [],
                            hasSmokingArea: false
                        };

                        if (data.elements && data.elements.length > 0) {
                            // Check wheelchair accessibility
                            const wheelchairTag = data.elements.find(e => e.tags.wheelchair)?.tags.wheelchair;
                            if (wheelchairTag === 'yes' || wheelchairTag === 'designated') {
                                result.status = 'friendly';
                                result.text = isParent ? 'Stroller Friendly' : 'OKU Friendly';
                            } else if (wheelchairTag === 'limited') {
                                result.status = 'limited';
                                result.text = 'Partial Access';
                            } else if (wheelchairTag === 'no') {
                                result.status = 'no';
                                result.text = 'Not Accessible';
                            }

                            // Check parent-specific facilities
                            if (isParent) {
                                const hasChangingTable = data.elements.some(e => e.tags.changing_table === 'yes');
                                const hasBabyFeeding = data.elements.some(e => e.tags.baby_feeding === 'yes' || e.tags.amenity === 'baby_hatch');
                                const hasShelter = data.elements.some(e => e.tags.shelter === 'yes' || e.tags.covered === 'yes');

                                if (hasChangingTable) result.facilities.push('🚼');
                                if (hasBabyFeeding) result.facilities.push('🍼');
                                if (hasShelter) result.facilities.push('🌳');
                            }

                            // Check for smoking areas
                            const hasSmoking = data.elements.some(e => e.tags.smoking === 'designated' || e.tags.amenity === 'smoking_area');
                            if (hasSmoking) result.hasSmokingArea = true;
                        }
                        return result;
                    } catch (e) {
                        const isParent = window.appState.theme === 'parent';
                        return {
                            status: 'unknown',
                            text: isParent ? 'Facilities Unknown' : 'Accessibility Unknown',
                            facilities: []
                        };
                    }
                };

                const performSearch = async () => {
                    const query = searchInput.value;
                    if (!query) return;

                    try {
                        let searchUrl = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(query)}&format=json&countrycodes=my`;

                        if (userMarker) {
                            const userPos = userMarker.getLatLng();
                            const delta = 0.5;
                            const viewbox = `${userPos.lng - delta},${userPos.lat + delta},${userPos.lng + delta},${userPos.lat - delta}`;
                            searchUrl += `&viewbox=${viewbox}&bounded=1`;
                        }

                        const response = await fetch(searchUrl);
                        const data = await response.json();

                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'block';

                        if (Array.isArray(data)) {
                            let sortedData = data;
                            if (userMarker) {
                                const userPos = userMarker.getLatLng();
                                sortedData = data.sort((a, b) => {
                                    const distA = Math.sqrt(Math.pow(a.lat - userPos.lat, 2) + Math.pow(a.lon - userPos.lng, 2));
                                    const distB = Math.sqrt(Math.pow(b.lat - userPos.lat, 2) + Math.pow(b.lon - userPos.lng, 2));
                                    return distA - distB;
                                });
                            }

                            // Process results sequentially to fetch accessibility info if needed
                            // Note: For search, we don't filter strict to avoid empty results, but we show status
                            for (const place of sortedData.slice(0, 5)) {
                                const item = document.createElement('div');
                                item.style.padding = '10px';
                                item.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                                item.style.cursor = 'pointer';

                                let distanceText = '';
                                if (userMarker) {
                                    const userPos = userMarker.getLatLng();
                                    const R = 6371;
                                    const dLat = (place.lat - userPos.lat) * Math.PI / 180;
                                    const dLon = (place.lon - userPos.lng) * Math.PI / 180;
                                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                        Math.cos(userPos.lat * Math.PI / 180) * Math.cos(place.lat * Math.PI / 180) *
                                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    const distance = R * c;
                                    distanceText = ` (${distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(1) + 'km'} away)`;
                                }

                                let accessibilityBadge = '';
                                // Always check for smoking area and accessibility if needed
                                const acc = await checkAccessibility(place.lat, place.lon);

                                if (window.appState.theme === 'oku' || window.appState.theme === 'parent') {
                                    let color = '#9ca3af'; // gray unknown
                                    if (acc.status === 'friendly') color = window.appState.theme === 'parent' ? '#fbbf24' : '#4ade80'; // yellow for parent, green for oku
                                    if (acc.status === 'limited') color = '#facc15'; // yellow
                                    if (acc.status === 'no') color = '#f87171'; // red

                                    const facilityIcons = acc.facilities.length > 0 ? ` ${acc.facilities.join(' ')}` : '';
                                    accessibilityBadge += `<span style="display: inline-block; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: ${color}; color: #000; margin-left: 5px; font-weight: bold;">${acc.text}${facilityIcons}</span>`;
                                }



                                const displayName = place.display_name.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim() || place.display_name;

                                item.innerHTML = `
                                        <div style="font-weight: 500;">${displayName.split(',')[0]} ${accessibilityBadge}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">
                                            ${displayName.split(',').slice(1, 3).join(',')}${distanceText}
                                        </div>
                                    `;

                                item.addEventListener('click', () => {
                                    const lat = parseFloat(place.lat);
                                    const lon = parseFloat(place.lon);

                                    if (destMarker) map.removeLayer(destMarker);
                                    destMarker = L.marker([lat, lon]).addTo(map).bindPopup(displayName).openPopup();
                                    map.setView([lat, lon], 15);

                                    resultsContainer.style.display = 'none';
                                    searchInput.value = displayName;
                                });

                                resultsContainer.appendChild(item);
                            }
                        }
                    } catch (error) {
                        console.error("Search failed", error);
                    }
                };

                const routeBtn = document.createElement('button');
                routeBtn.className = 'btn btn-primary';
                routeBtn.style.width = '100%';
                routeBtn.style.marginTop = '15px';
                routeBtn.innerHTML = '🚗 Get Best Route';
                container.querySelector('.card').appendChild(routeBtn);

                let routeLayer = null;

                const calculateRoute = async () => {
                    if (!userMarker || !destMarker) {
                        alert("Please set both Start Location and Destination.");
                        return;
                    }

                    const start = userMarker.getLatLng();
                    const dest = destMarker.getLatLng();
                    const isOku = window.appState.theme === 'oku';
                    const isParent = window.appState.theme === 'parent';

                    let profile = selectedMode;
                    if (isOku) profile = 'wheelchair';
                    if (isParent) profile = 'foot-walking'; // Stroller-friendly walking routes

                    // If user explicitly chose a mode, we might want to respect it even in themes, 
                    // but for safety/accessibility themes usually override. 
                    // However, let's allow the user to override if they clicked a button *after* the theme set it?
                    // For now, let's stick to the requested logic:
                    // If not special theme, use selectedMode.
                    // If special theme, we might want to restrict, but the prompt didn't specify.
                    // Let's assume the buttons control the mode unless it's a strict override.
                    // Actually, let's just use selectedMode if it's set, but maybe default the selection based on theme?
                    // For simplicity and meeting the prompt "allow user to choose", we use selectedMode.
                    // BUT, we should probably update the default selectedMode based on theme on load.

                    // Override profile if theme dictates specific needs that match the mode?
                    // Let's trust the user's selection from the UI buttons.
                    profile = selectedMode;

                    // Special case: OKU users might need wheelchair even if they select walking? 
                    // Or maybe they are driving.
                    // If OKU is active and they select Walking, force Wheelchair?
                    if (isOku && profile === 'foot-walking') profile = 'wheelchair';


                    routeBtn.innerHTML = 'Calculating...';
                    routeBtn.disabled = true;

                    try {
                        const routeData = await window.RouteService.fetchRoute(start, dest, profile);
                        const routes = routeData.routes;

                        if (routes && routes.length > 0) {
                            const analyzeRoutesWithAI = async () => {
                                try {
                                    const weather = await window.DataService.getWeather(start.lat, start.lon);
                                    const pollution = await window.DataService.getPollution(start.lat, start.lon);
                                    const hour = new Date().getHours();
                                    const day = new Date().getDay(); // 0=Sunday, 6=Saturday
                                    const isWeekday = day >= 1 && day <= 5;

                                    // Traffic congestion prediction
                                    let trafficLevel = "Light";
                                    let trafficStress = "Low stress";

                                    if (isWeekday) {
                                        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
                                            trafficLevel = "Heavy (Rush Hour)";
                                            trafficStress = "High stress, increased pollution";
                                        } else if ((hour >= 12 && hour <= 14)) {
                                            trafficLevel = "Moderate (Lunch Hour)";
                                            trafficStress = "Moderate stress";
                                        }
                                    } else {
                                        if (hour >= 10 && hour <= 20) {
                                            trafficLevel = "Moderate (Weekend)";
                                            trafficStress = "Moderate stress";
                                        }
                                    }

                                    const routeSummary = routes.map((r, i) => `Route ${i + 1}: ${(r.distance / 1000).toFixed(1)}km, ${(r.duration / 60).toFixed(0)}min`).join('\\n');

                                    const prompt = `Analyze routes for HEALTH & WELL-BEING (SDG 3):
\${routeSummary}

CURRENT CONDITIONS:
- Mode: \${selectedMode}
- Weather: \${weather.temp}°C, \${weather.desc}
- Air Quality: AQI \${pollution.aqi} (\${pollution.status})
- Time: \${hour}:00 (\${isWeekday ? 'Weekday' : 'Weekend'})
- Traffic Prediction: \${trafficLevel} - \${trafficStress}

HEALTH FACTORS TO CONSIDER:
1. **Traffic Congestion**: \${trafficLevel} affects stress levels & air pollution exposure
2. **Air Quality**: AQI \${pollution.aqi} - \${pollution.aqi > 100 ? 'UNHEALTHY - avoid long exposure' : 'acceptable'}
3. **Weather Impact**: \${weather.temp > 32 ? 'Very hot - heat stress risk' : weather.temp < 20 ? 'Cool - comfortable' : 'Comfortable temperature'}
4. **Travel Time**: Longer routes = more stress, fatigue, pollution exposure
5. **Mental Health**: Rush hour traffic increases stress & anxiety

SPECIFIC ALERTS REQUIRED:
- If Mode is Driving AND Weather is Heavy Rain (codes 65, 81, 82, 95, 96, 99) -> ALERT: "Heavy Rain Ahead! Drive Carefully."
- If Mode is Pedestrian (Walking) AND AQI > 100 -> ALERT: "High Air Pollution! Wear a mask or avoid outdoor activity."
- If Mode is Cycling AND AQI > 100 -> ALERT: "High Air Pollution! Limit exertion."
- If Mode is Cycling -> MENTION: "Cycling lanes prioritized."

IMPORTANT: Prioritize HEALTH IMPACT over speed. Consider:
- Shorter routes reduce stress & pollution exposure
- Avoid rush hour routes if possible
- High AQI + traffic = worst health impact

For each route provide:
- Insight (max 12 words, focus on health impact)
- Warning (health risks or "none")

Recommend the route with BEST OVERALL HEALTH OUTCOME.

JSON format:
{"routes":[{"insight":"Fastest but rush hour traffic","warning":"High stress, pollution exposure"}],"recommended":1,"reason":"Route 1 recommended: less traffic stress, better air quality","mood":"happy"}`;

                                    const response = await fetch('https://api.jamaibase.com/api/v1/chat/completions', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Bearer jamai_pat_fcc821f53ee8e94560c4ea16f6f522702ad1fa959344d576',
                                            'Content-Type': 'application/json',
                                            'X-Project-ID': 'proj_8074cdfcfe8657ff8d03b1e8'
                                        },
                                        body: JSON.stringify({
                                            model: "ellm/gemini-2.5-flash",
                                            messages: [
                                                { role: "system", content: "You are a health-focused route advisor for SDG 3. Prioritize user health and well-being over speed. Respond with valid JSON only." },
                                                { role: "user", content: prompt }
                                            ],
                                            max_tokens: 300,
                                            temperature: 0.7
                                        })
                                    });

                                    const data = await response.json();
                                    const content = data.choices[0].message.content;
                                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                                    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                                } catch (e) {
                                    console.warn("AI analysis failed:", e);
                                    return null;
                                }
                            };

                            const aiAnalysis = await analyzeRoutesWithAI();
                            let selectedRouteIndex = aiAnalysis ? (aiAnalysis.recommended - 1) : 0;

                            const renderRoutes = () => {
                                if (routeLayer) {
                                    if (routeLayer instanceof L.LayerGroup) {
                                        routeLayer.clearLayers();
                                    } else {
                                        map.removeLayer(routeLayer);
                                    }
                                }
                                routeLayer = L.layerGroup().addTo(map);

                                routes.forEach((route, index) => {
                                    const isSelected = index === selectedRouteIndex;
                                    const style = isSelected
                                        ? { color: '#3B82F6', weight: 6, opacity: 0.9, zIndex: 1000 }
                                        : { color: '#94a3b8', weight: 4, opacity: 0.5, dashArray: '5, 10' };

                                    const layer = L.geoJSON(route.geometry, { style }).addTo(routeLayer);
                                    layer.on('click', () => {
                                        if (selectedRouteIndex !== index) {
                                            selectedRouteIndex = index;
                                            renderRoutes();
                                        }
                                    });
                                    if (isSelected) layer.bringToFront();
                                });

                                let infoHTML = '';

                                if (aiAnalysis) {
                                    infoHTML += `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                                        <strong>🤖 AI Health Recommendation:</strong><br>${aiAnalysis.reason}
                                    </div>`;
                                }

                                infoHTML += '<div style="display: flex; flex-direction: column; gap: 8px;">';

                                routes.forEach((route, index) => {
                                    const dist = (route.distance / 1000).toFixed(1);
                                    const dur = (route.duration / 60).toFixed(0);
                                    const isSelected = index === selectedRouteIndex;
                                    const isRecommended = aiAnalysis && index === (aiAnalysis.recommended - 1);
                                    const routeInfo = aiAnalysis ? aiAnalysis.routes[index] : null;

                                    const bgColor = isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)';
                                    const borderColor = isSelected ? '#3B82F6' : '#e5e7eb';

                                    infoHTML += `<div onclick="window.selectRoute(${index})" style="padding: 10px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${isRecommended ? '⭐ ' : ''}Route ${index + 1}${isRecommended ? ' (AI Recommended)' : ''}</strong>
                <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 2px;">${dist} km • ${dur} mins</div>
            </div>
            ${isSelected ? '<span style="color: #3B82F6; font-size: 1.2rem;">✓</span>' : ''}
        </div>
                                        ${routeInfo ? `<div style="margin-top: 6px; font-size: 0.8rem; font-style: italic;">
                                            ${routeInfo.warning !== 'none' ? '⚠️ ' : '💡 '}${routeInfo.insight}
                                            ${routeInfo.warning !== 'none' ? '<br><span style="color: #f59e0b;">⚠️ ' + routeInfo.warning + '</span>' : ''}
                                        </div>` : ''
                                        }
                                    </div>`;
                                });

                                infoHTML += '</div>';

                                const infoDiv = document.createElement('div');
                                infoDiv.style.marginTop = '10px';
                                infoDiv.innerHTML = infoHTML;

                                const oldInfo = container.querySelector('.route-info');
                                if (oldInfo) oldInfo.remove();

                                infoDiv.className = 'route-info';
                                container.querySelector('.card').appendChild(infoDiv);

                                window.selectRoute = (index) => {
                                    selectedRouteIndex = index;
                                    renderRoutes();
                                };

                                if (aiAnalysis && window.assistant) {
                                    window.assistant.say(aiAnalysis.reason);
                                    window.assistant.setMood(aiAnalysis.mood);
                                }
                            };

                            renderRoutes();
                            const allRoutesGeo = L.featureGroup(routes.map(r => L.geoJSON(r.geometry)));
                            map.fitBounds(allRoutesGeo.getBounds(), { padding: [50, 50] });

                        } else {
                            alert("No route found.");
                            routeBtn.innerHTML = '🚗 Get Best Route';
                        }

                    } catch (error) {
                        console.error("Route calculation failed", error);
                        alert(`Failed to calculate route: ${error.message} `);
                        routeBtn.innerHTML = '🚗 Get Best Route';
                    } finally {
                        routeBtn.disabled = false;
                        routeBtn.innerHTML = '🚗 Get Best Route';
                    }
                };

                routeBtn.addEventListener('click', calculateRoute);
                searchBtn.addEventListener('click', performSearch);
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') performSearch();
                });

                // Overpass API for category search
                const suggestionBtns = container.querySelectorAll('.suggestion-btn');

                suggestionBtns.forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const category = btn.getAttribute('data-category');
                        const btnText = btn.textContent;

                        try {
                            const coords = await window.getLocation();
                            btn.textContent = '🔍 Searching...';
                            btn.disabled = true;

                            const amenityMap = {
                                'food_court': 'food_court',
                                'shopping_mall': 'mall',
                                'restaurant': 'restaurant',
                                'cafe': 'cafe',
                                'night_market': 'marketplace',
                                'park': 'park',
                                'hospital': 'hospital',
                                'clinic': 'clinic',
                                'pharmacy': 'pharmacy',
                                // Parent mode categories
                                'botanical_garden': 'garden',
                                'zoo': 'zoo',
                                'aquarium': 'aquarium',
                                'beach': 'beach',
                                'playground': 'playground',
                                'baby_cafe': 'cafe'
                            };

                            const amenity = amenityMap[category] || category;
                            const radius = 5000;
                            const isOku = window.appState.theme === 'oku';
                            const isParent = window.appState.theme === 'parent';

                            const buildQuery = (filter) => {
                                if (category === 'oku_spots') {
                                    // Special query for ANY wheelchair accessible place of interest
                                    return `[out:json][timeout:25];(
                                        node["wheelchair"~"yes|designated"]["amenity"](around:${radius},${coords.lat},${coords.lon});
                                        node["wheelchair"~"yes|designated"]["shop"](around:${radius},${coords.lat},${coords.lon});
                                        node["wheelchair"~"yes|designated"]["tourism"](around:${radius},${coords.lat},${coords.lon});
                                        node["wheelchair"~"yes|designated"]["leisure"](around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'botanical_garden') {
                                    return `[out:json][timeout:25];(
                                        node["leisure"="garden"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["leisure"="garden"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["leisure"="park"]["garden:type"="botanical"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["leisure"="park"]["garden:type"="botanical"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'zoo') {
                                    return `[out:json][timeout:25];(
                                        node["tourism"="zoo"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["tourism"="zoo"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["zoo"="wildlife"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'aquarium') {
                                    return `[out:json][timeout:25];(
                                        node["tourism"="aquarium"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["tourism"="aquarium"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'beach') {
                                    return `[out:json][timeout:25];(
                                        node["natural"="beach"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["natural"="beach"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["leisure"="beach_resort"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["water"="lake"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["water"="lake"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'playground') {
                                    return `[out:json][timeout:25];(
                                        node["leisure"="playground"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["leisure"="playground"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["amenity"="playground"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'baby_cafe') {
                                    return `[out:json][timeout:25];(
                                        node["amenity"="cafe"]["kids_area"="yes"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["amenity"="cafe"]["family_friendly"="yes"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["amenity"="cafe"]["highchair"="yes"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["amenity"="cafe"]["changing_table"="yes"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else if (category === 'shopping_mall') {
                                    return `[out:json][timeout:25];(
                                        node["shop"="mall"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["shop"="mall"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        node["building"="retail"]["name"~"[Mm]all"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                        way["building"="retail"]["name"~"[Mm]all"]${filter}(around:${radius},${coords.lat},${coords.lon});
                                    );out center;`;
                                } else {
                                    return `[out:json][timeout:25];(node["amenity"="${amenity}"]${filter}(around:${radius},${coords.lat},${coords.lon});way["amenity"="${amenity}"]${filter}(around:${radius},${coords.lat},${coords.lon}););out center;`;
                                }
                            };

                            // For OKU spots, we don't need the extra filter arg since the query itself is the filter
                            let overpassQuery = buildQuery(category === 'oku_spots' ? '' : (isOku ? '["wheelchair"~"yes|limited|designated"]' : ''));
                            let overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

                            let response = await fetch(overpassUrl);
                            let data = await response.json();
                            let isFallback = false;

                            // Fallback Logic: If OKU mode is on but no results, try without filter
                            if (isOku && (!data.elements || data.elements.length === 0)) {
                                if (window.assistant) {
                                    window.assistant.say(`No strictly accessible ${btnText.replace(/[🍽️🛍️🍴☕🌳🏥🌙]/g, '').trim()} found. Searching for all nearby options...`);
                                }

                                isFallback = true;
                                overpassQuery = buildQuery('');
                                overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
                                response = await fetch(overpassUrl);
                                data = await response.json();
                            }

                            if (data.elements && data.elements.length > 0) {
                                const places = await Promise.all(data.elements.map(async element => {
                                    const lat = element.lat || element.center?.lat;
                                    const lon = element.lon || element.center?.lon;

                                    if (!lat || !lon) return null;

                                    const R = 6371;
                                    const dLat = (lat - coords.lat) * Math.PI / 180;
                                    const dLon = (lon - coords.lon) * Math.PI / 180;
                                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                        Math.cos(coords.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    const distance = R * c;

                                    // For fallback results, we need to check accessibility individually to show correct badges
                                    let accessibilityStatus = 'unknown';
                                    let facilities = [];
                                    let hasSmokingArea = false;

                                    if (isFallback) {
                                        const acc = await checkAccessibility(lat, lon);
                                        accessibilityStatus = acc.status;
                                        facilities = acc.facilities || [];
                                        hasSmokingArea = acc.hasSmokingArea || false;
                                    } else {
                                        // If we filtered by OKU/Parent, we know they are at least limited
                                        const tag = element.tags?.wheelchair;
                                        if (tag === 'yes' || tag === 'designated') accessibilityStatus = 'friendly';
                                        else if (tag === 'limited') accessibilityStatus = 'limited';
                                        else accessibilityStatus = 'unknown';

                                        // Check for parent facilities in the element tags
                                        if (isParent) {
                                            if (element.tags?.changing_table === 'yes') facilities.push('🚼');
                                            if (element.tags?.baby_feeding === 'yes' || element.tags?.amenity === 'baby_hatch') facilities.push('🍼');
                                            if (element.tags?.shelter === 'yes' || element.tags?.covered === 'yes') facilities.push('🌳');
                                        }

                                        // Check for smoking
                                        if (element.tags?.smoking === 'designated' || element.tags?.amenity === 'smoking_area') {
                                            hasSmokingArea = true;
                                        }
                                    }

                                    const rawName = element.tags?.name || `${btnText.replace(/[🍽️🛍️🍴☕🌳🏥🌙👶🌺🦁🐠🏖️🎡🍼♿💊]/g, '').trim()}`;
                                    const englishName = rawName.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim() || rawName;

                                    return {
                                        lat,
                                        lon,
                                        name: englishName,
                                        distance,
                                        distance,
                                        accessibilityStatus,
                                        facilities,
                                        hasSmokingArea
                                    };
                                }));

                                const validPlaces = places.filter(p => p !== null).sort((a, b) => a.distance - b.distance);

                                if (validPlaces.length > 0) {
                                    const nearbyContainer = container.querySelector('#nearby-places');
                                    nearbyContainer.innerHTML = '';
                                    const topPlaces = validPlaces.slice(0, 5);

                                    topPlaces.forEach((place, index) => {
                                        const distText = place.distance < 1 ? `${(place.distance * 1000).toFixed(0)}m` : `${place.distance.toFixed(1)}km`;

                                        let badge = '';
                                        if (isOku || isParent) {
                                            let color = '#9ca3af'; // gray
                                            let text = 'Unknown';
                                            if (place.accessibilityStatus === 'friendly') {
                                                color = isParent ? '#fbbf24' : '#4ade80';
                                                text = isParent ? 'Stroller Friendly' : 'OKU Friendly';
                                            }
                                            else if (place.accessibilityStatus === 'limited') { color = '#facc15'; text = 'Partial Access'; }
                                            else if (place.accessibilityStatus === 'no') { color = '#f87171'; text = 'Not Accessible'; }

                                            const facilityIcons = place.facilities && place.facilities.length > 0 ? ` ${place.facilities.join(' ')}` : '';
                                            badge += `<span style="display: inline-block; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: ${color}; color: #000; margin-left: 5px; font-weight: bold;">${text}${facilityIcons}</span>`;
                                        }

                                        if (place.hasSmokingArea) {
                                            badge += `<span style="display: inline-block; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: #ef4444; color: white; margin-left: 5px; font-weight: bold;">🚫 Restricted Smoking Area</span>`;
                                        }

                                        const placeCard = document.createElement('div');
                                        placeCard.className = 'card';
                                        placeCard.style.cursor = 'pointer';
                                        placeCard.style.marginBottom = '10px';
                                        placeCard.style.transition = 'all 0.2s';

                                        placeCard.innerHTML = `
                                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                                <div style="flex: 1;">
                                                    <strong>${index === 0 ? '⭐ ' : ''}${index + 1}. ${place.name}</strong>${badge}
                                                    <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 4px;">
                                                        📍 ${distText} away ${index === 0 ? '(Closest)' : ''}
                                                    </div>
                                                </div>
                                                <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">
                                                    Select
                                                </button>
                                            </div>
                                        `;

                                        placeCard.addEventListener('click', () => {
                                            if (destMarker) map.removeLayer(destMarker);
                                            destMarker = L.marker([place.lat, place.lon]).addTo(map).bindPopup(place.name).openPopup();
                                            map.setView([place.lat, place.lon], 15);
                                            searchInput.value = place.name;

                                            if (window.assistant) {
                                                window.assistant.say(`Selected ${place.name}! 📍`);
                                            }
                                        });

                                        placeCard.addEventListener('mouseenter', () => {
                                            placeCard.style.transform = 'translateY(-2px)';
                                            placeCard.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
                                        });

                                        placeCard.addEventListener('mouseleave', () => {
                                            placeCard.style.transform = 'translateY(0)';
                                            placeCard.style.boxShadow = '';
                                        });

                                        nearbyContainer.appendChild(placeCard);
                                    });

                                    const firstPlace = validPlaces[0];
                                    if (destMarker) map.removeLayer(destMarker);
                                    destMarker = L.marker([firstPlace.lat, firstPlace.lon]).addTo(map).bindPopup(firstPlace.name).openPopup();
                                    map.setView([firstPlace.lat, firstPlace.lon], 14);
                                    searchInput.value = firstPlace.name;

                                    if (window.assistant) {
                                        const okuText = isOku ? (isFallback ? ' nearby (Accessibility Unknown)' : ' (OKU Friendly)') : '';
                                        window.assistant.say(`Found ${topPlaces.length} ${btnText.replace(/[🍽️🛍️🍴☕🌳🏥🌙]/g, '').trim()}${okuText} nearby! 📍`);
                                    }
                                } else {
                                    throw new Error('No valid results');
                                }
                            } else {
                                if (window.assistant) {
                                    window.assistant.say(`No ${btnText.replace(/[🍽️🛍️🍴☕🌳🏥🌙]/g, '').trim()} found nearby 😔`);
                                }
                            }

                            btn.textContent = btnText;
                            btn.disabled = false;

                        } catch (error) {
                            console.error('Overpass search error:', error);
                            btn.textContent = btnText;
                            btn.disabled = false;

                            if (window.assistant) {
                                window.assistant.say('Search failed. Try again! 😔');
                            }
                        }
                    });
                });

            } catch (e) {
                console.error("Map init failed", e);
            }
        }
    }, 100);

    return container;
};
