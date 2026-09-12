class HospitalService {
    constructor() {
        this.overpassUrl = 'https://overpass-api.de/api/interpreter';
    }

    /**
     * Find nearby hospitals using Overpass API.
     * @param {Object} location - { lat: number, lng: number }
     * @returns {Promise<Array>} - List of 3 closest hospitals { name, coordinates, distance }
     */
    async findNearbyHospitals(location) {
        try {
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

            const response = await fetch(this.overpassUrl, {
                method: 'POST',
                body: 'data=' + encodeURIComponent(query)
            });

            if (!response.ok) {
                throw new Error('Overpass API request failed');
            }

            const data = await response.json();
            const elements = data.elements;

            const hospitals = elements.map(element => {
                const name = element.tags.name || "Unknown Hospital";
                const hospitalLat = element.lat || element.center.lat;
                const hospitalLng = element.lon || element.center.lon;

                return {
                    name: name,
                    coordinates: { lat: hospitalLat, lng: hospitalLng },
                    distance: this.calculateDistance(lat, lng, hospitalLat, hospitalLng)
                };
            });

            // Filter out duplicates (sometimes same hospital is mapped as node and way)
            // Simple dedup by name and very close distance
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
            return uniqueHospitals.slice(0, 3);

        } catch (error) {
            console.error('HospitalService Error:', error);
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
window.HospitalService = new HospitalService();
