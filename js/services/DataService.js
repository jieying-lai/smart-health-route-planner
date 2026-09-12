class DataService {
    constructor() {
        this.waqiApiKey = '27fd825a35ab8ec84902c17823ea00f8f7433dbd';
        this.locationIqKey = 'pk.450e8cc609ea4f382ea5b9673fd7a5a8';
    }

    /**
     * Geocode a location name to lat/lon
     * @param {string} query - City or location name
     * @returns {Promise<{lat: number, lon: number, name: string}|null>}
     */
    async geocode(query) {
        try {
            const url = `https://us1.locationiq.com/v1/search.php?key=${this.locationIqKey}&q=${encodeURIComponent(query)}&format=json&limit=1`;
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    name: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error("Geocoding failed:", error);
            return null;
        }
    }

    /**
     * Get Weather Data from Open-Meteo
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<{temp: number, desc: string, humidity: number, wind: number}|null>}
     */
    async getWeather(lat, lon) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            const weatherCodes = {
                0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
                45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
                61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
                95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
            };

            return {
                temp: Math.round(data.current.temperature_2m),
                desc: weatherCodes[data.current.weather_code] || 'Unknown',
                humidity: data.current.relative_humidity_2m,
                wind: Math.round(data.current.wind_speed_10m)
            };
        } catch (error) {
            console.error("Weather fetch failed:", error);
            return null;
        }
    }

    /**
     * Get Pollution Data from WAQI
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<{aqi: number, status: string, city: string}|null>}
     */
    async getPollution(lat, lon) {
        try {
            const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${this.waqiApiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'ok') {
                const aqi = data.data.aqi;
                let status = 'Good';
                if (aqi > 50) status = 'Moderate';
                if (aqi > 100) status = 'Unhealthy';
                if (aqi > 200) status = 'Very Unhealthy';
                if (aqi > 300) status = 'Hazardous';
                return { aqi, status, city: data.data.city.name };
            }
            return null;
        } catch (error) {
            console.error("Pollution fetch failed:", error);
            return null;
        }
    }

    /**
     * Get Nearby Hospitals from LocationIQ
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<string|null>}
     */
    async getHospitals(lat, lon) {
        try {
            const url = `https://us1.locationiq.com/v1/search.php?key=${this.locationIqKey}&q=hospital&lat=${lat}&lon=${lon}&format=json&limit=3&radius=5000`;
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                return data.map(place => place.display_name.split(',')[0]).join(', ');
            }
            return "No hospitals found nearby.";
        } catch (error) {
            console.error("Hospital fetch failed:", error);
            return null;
        }
    }
}

// Export as global for simple usage
window.DataService = new DataService();
