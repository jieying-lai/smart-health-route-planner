class RouteService {
    constructor() {
        this.apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMwNmNiODAzODU3YzRlZmI5Y2VkZmU3ZTM1ZWY1N2NhIiwiaCI6Im11cm11cjY0In0='; // Provided by user
        this.baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    }

    /**
     * Fetch a route between origin and destination.
     * @param {Object} origin - { lat: number, lng: number }
     * @param {Object} destination - { lat: number, lng: number }
     * @param {string} profile - 'driving-car', 'wheelchair', 'foot-walking'
     * @returns {Promise<Object>} - { routes: Array<{ geometry, distance, duration }> }
     */
    async fetchRoute(origin, destination, profile = 'driving-car') {
        try {
            const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coordinates: [
                        [origin.lng, origin.lat],
                        [destination.lng, destination.lat]
                    ],
                    alternative_routes: {
                        target_count: 3
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? errorData.error.message : 'Route fetch failed');
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                // Map all features to a standardized format
                const routes = data.features.map(feature => {
                    return {
                        geometry: feature.geometry,
                        distance: feature.properties.summary.distance,
                        duration: feature.properties.summary.duration
                    };
                });

                return {
                    routes: routes
                };
            } else {
                throw new Error('No route found');
            }

        } catch (error) {
            console.error('RouteService Error:', error);
            throw error;
        }
    }
}

// Export as global for simple usage without modules
window.RouteService = new RouteService();
