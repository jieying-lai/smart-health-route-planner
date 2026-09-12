class PoiService {
    constructor() {
        this.apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMwNmNiODAzODU3YzRlZmI5Y2VkZmU3ZTM1ZWY1N2NhIiwiaCI6Im11cm11cjY0In0=';
        this.baseUrl = 'https://api.openrouteservice.org/pois';

        // Category mapping
        this.categories = {
            'hospital': 203,
            'clinic': 201,
            'pharmacy': 205,
            'dentist': 202,
            'restaurant': 564,
            'cafe': 562,
            'fast_food': 563,
            'food_court': 563, // Using fast_food as closest match
            'park': 264,
            'shopping_mall': 420, // Shops group
            'emergency': 203 // Same as hospital
        };
    }

    /**
     * Find nearby POIs by category.
     * @param {Object} location - { lat: number, lng: number }
     * @param {string} category - Category name (e.g., 'hospital', 'restaurant')
     * @param {number} radius - Search radius in meters (default: 2000)
     * @returns {Promise<Array>} - List of POIs with name, coordinates, distance
     */
    async findNearbyPois(location, category, radius = 2000) {
        try {
            const categoryId = this.categories[category];
            if (!categoryId) {
                throw new Error(`Unknown category: ${category}`);
            }

            const requestBody = {
                request: 'pois',
                geometry: {
                    geojson: {
                        type: 'Point',
                        coordinates: [location.lng, location.lat]
                    },
                    buffer: radius
                },
                filters: {
                    category_ids: [categoryId]
                }
            };

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? errorData.error.message : 'POI fetch failed');
            }

            const data = await response.json();
            const features = data.features || [];

            const pois = features.map(feature => {
                const coords = feature.geometry.coordinates;
                const props = feature.properties;

                return {
                    name: props.osm_tags?.name || props.category_ids?.name || 'Unknown',
                    coordinates: { lat: coords[1], lng: coords[0] },
                    distance: this.calculateDistance(
                        location.lat,
                        location.lng,
                        coords[1],
                        coords[0]
                    )
                };
            });

            // Sort by distance
            pois.sort((a, b) => a.distance - b.distance);

            return pois.slice(0, 5); // Return top 5

        } catch (error) {
            console.error('PoiService Error:', error);
            return [];
        }
    }

    // Haversine formula to calculate distance in meters
    calculateDistance(lat1, lon1, lat2, lon2) {
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
}

// Export as global
window.PoiService = new PoiService();
