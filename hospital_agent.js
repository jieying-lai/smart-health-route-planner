const https = require('https');

// Configuration
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Helper function to make HTTP POST request
function fetchHospitals(location) {
    const radius = 5000; // 5km search radius
    const lat = location.lat;
    const lng = location.lng;

    // Overpass QL query
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          node["healthcare"="hospital"](around:${radius},${lat},${lng});
          way["healthcare"="hospital"](around:${radius},${lat},${lng});
        );
        out center;
    `;

    const data = 'data=' + encodeURIComponent(query);
    const url = new URL(OVERPASS_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const parsedData = JSON.parse(body);
                    const elements = parsedData.elements;

                    const hospitals = elements.map(element => {
                        const name = element.tags.name || "Unknown Hospital";
                        const hospitalLat = element.lat || element.center.lat;
                        const hospitalLng = element.lon || element.center.lon;

                        return {
                            name: name,
                            coordinates: { lat: hospitalLat, lng: hospitalLng },
                            distance: calculateDistance(lat, lng, hospitalLat, hospitalLng)
                        };
                    });

                    // Filter out duplicates
                    const uniqueHospitals = [];
                    hospitals.forEach(h => {
                        const exists = uniqueHospitals.find(uh =>
                            uh.name === h.name && Math.abs(uh.distance - h.distance) < 50
                        );
                        if (!exists) {
                            uniqueHospitals.push(h);
                        }
                    });

                    // Sort by distance
                    uniqueHospitals.sort((a, b) => a.distance - b.distance);

                    // Return top 3
                    const top3 = uniqueHospitals.slice(0, 3);
                    console.log(JSON.stringify(top3, null, 2));

                } catch (e) {
                    console.error('Error parsing response:', e.message);
                }
            } else {
                console.error(`Request failed with status code ${res.statusCode}: ${body}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.write(data);
    req.end();
}

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

// Test Data: KLCC
const location = { lat: 3.1579, lng: 101.7116 };

console.log(`Finding hospitals near [${location.lat}, ${location.lng}]...`);
fetchHospitals(location);
