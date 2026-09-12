window.App = window.App || {};

window.App.Hospitals = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    const apiKey = 'pk.450e8cc609ea4f382ea5b9673fd7a5a8';

    container.innerHTML = `
        <h1>Nearby Hospitals & Clinics</h1>
        
        <button class="btn btn-danger" style="width: 100%; margin-bottom: 2rem; padding: 1.5rem; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span style="font-size: 1.5rem;">📞</span> 
            <span>Emergency Call (999)</span>
        </button>

        <div class="card">
            <h3>Find Medical Facilities</h3>
            <p style="margin-bottom: 15px; color: var(--text-dim);">Quick access to nearby healthcare</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button class="suggestion-btn" data-facility="hospital">🏥 Hospital</button>
                <button class="suggestion-btn" data-facility="clinic">🩺 Clinic</button>
                <button class="suggestion-btn" data-facility="pharmacy">💊 Pharmacy</button>
                <button class="suggestion-btn" data-facility="dentist">🦷 Dentist</button>
                <button class="suggestion-btn" data-facility="emergency">🚑 Emergency</button>
            </div>
        </div>

        <div class="card" style="height: 300px; position: relative; overflow: hidden; padding: 0; margin-bottom: 20px;">
             <!-- Real Map -->
            <div id="hospital-map" style="width: 100%; height: 100%; background: #1e293b;"></div>
        </div>

        <h2>Nearby Facilities</h2>
        <div id="facilities-list"></div>
    `;

    setTimeout(() => {
        if (window.L) {
            try {
                const map = L.map(container.querySelector('#hospital-map')).setView([3.1390, 101.6869], 13);
                let facilityMarkers = [];

                // LocationIQ Tiles
                L.tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${apiKey}`, {
                    attribution: '&copy; LocationIQ &copy; OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(map);

                // Use Global Location Service
                window.getLocation().then(coords => {
                    map.setView([coords.lat, coords.lon], 14);
                    L.marker([coords.lat, coords.lon]).addTo(map).bindPopup("You are here").openPopup();
                }).catch(error => {
                    console.error('Location service error:', error);
                });

                // Quick Suggestions - Find Nearby Medical Facilities
                const suggestionBtns = container.querySelectorAll('.suggestion-btn');
                const facilitiesList = container.querySelector('#facilities-list');

                suggestionBtns.forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const facility = btn.getAttribute('data-facility');
                        const btnText = btn.textContent;

                        try {
                            const coords = await window.getLocation();
                            btn.textContent = '🔍 Searching...';
                            btn.disabled = true;

                            // Clear previous markers
                            facilityMarkers.forEach(m => map.removeLayer(m));
                            facilityMarkers = [];

                            // Use PoiService for all facilities
                            const pois = await window.PoiService.findNearbyPois(
                                { lat: coords.lat, lng: coords.lon },
                                facility
                            );

                            // Map to format expected by UI
                            const data = pois.map(p => ({
                                lat: p.coordinates.lat,
                                lon: p.coordinates.lng,
                                display_name: p.name,
                                display_address: `${p.distance}m away`
                            }));

                            if (data && data.length > 0) {
                                // Clear list
                                facilitiesList.innerHTML = '';

                                // Add markers and list items
                                data.forEach((place, index) => {
                                    const lat = parseFloat(place.lat);
                                    const lon = parseFloat(place.lon);

                                    // Add marker
                                    const marker = L.marker([lat, lon]).addTo(map).bindPopup(place.display_name);
                                    facilityMarkers.push(marker);

                                    // Add to list
                                    const card = document.createElement('div');
                                    card.className = 'card';
                                    card.innerHTML = `
                                        <div style="display: flex; justify-content: space-between; align-items: start;">
                                            <div>
                                                <h3>${place.display_name.split(',')[0]}</h3>
                                                <p>${place.display_address || place.display_name}</p>
                                            </div>
                                            <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${lat},${lon}', '_blank')">Go</button>
                                        </div>
                                    `;
                                    facilitiesList.appendChild(card);

                                    if (index === 0) marker.openPopup();
                                });

                                // Fit map to markers
                                const group = L.featureGroup(facilityMarkers);
                                map.fitBounds(group.getBounds().pad(0.1));

                                if (window.assistant) {
                                    window.assistant.say(`Found ${data.length} ${btnText.replace(/[🏥🩺💊🦷🚑]/g, '').trim()}(s)! 📍`);
                                }
                            } else {
                                facilitiesList.innerHTML = '<div class="card"><p>No facilities found nearby 😔</p></div>';
                                if (window.assistant) {
                                    window.assistant.say('No results found nearby 😔');
                                }
                            }

                            btn.textContent = btnText;
                            btn.disabled = false;

                        } catch (error) {
                            console.error('Facility search error:', error);
                            btn.textContent = btnText;
                            btn.disabled = false;
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
