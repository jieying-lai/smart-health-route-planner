const https = require('https');

// Configuration
const ORS_KEY = process.env.ORS_KEY;
const BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

if (!ORS_KEY) {
    console.error('Error: ORS_KEY environment variable is missing.');
    process.exit(1);
}

// Helper function to make HTTP POST request
function fetchRoute(origin, destination) {
    const data = JSON.stringify({
        coordinates: [
            [origin.lng, origin.lat],
            [destination.lng, destination.lat]
        ],
        alternative_routes: {
            target_count: 3
        }
    });

    const url = new URL(BASE_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Authorization': ORS_KEY,
            'Content-Type': 'application/json',
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
                    if (parsedData.features && parsedData.features.length > 0) {
                        const routes = parsedData.features.map((feature, index) => ({
                            route_index: index,
                            distance_m: feature.properties.summary.distance,
                            duration_s: feature.properties.summary.duration,
                            geometry_points: feature.geometry.coordinates.length
                        }));
                        console.log(JSON.stringify({ routes }, null, 2));
                    } else {
                        console.error('No route found.');
                    }
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

// Test Data: KLCC to nearby park
const origin = { lat: 3.1579, lng: 101.7116 }; // KLCC
const destination = { lat: 3.1556, lng: 101.7150 }; // KLCC Park

console.log(`Fetching route from [${origin.lat}, ${origin.lng}] to [${destination.lat}, ${destination.lng}]...`);
fetchRoute(origin, destination);
