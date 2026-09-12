// Main App Logic - Refactored for No-Module Environment

// Initialize Global App Namespace if not exists
window.App = window.App || {};

// Router Logic
const routes = {
    '/': window.App.RoutePlanner,
    '/account': window.App.Account,
    '/pollution': window.App.PollutionMap,
    '/hospitals': window.App.Hospitals,
    '/weather': window.App.Weather,
    '/premium': window.App.Premium
};

const appContainer = document.getElementById('app');

function render() {
    const hash = window.location.hash.slice(1) || '/';
    // Default to RoutePlanner if route not found
    const Page = routes[hash] || window.App.RoutePlanner;

    // Clear current content
    appContainer.innerHTML = '';

    // Render Page Content
    if (typeof Page === 'function') {
        const content = Page();
        appContainer.appendChild(content);
    } else {
        appContainer.innerHTML = '<div class="container"><h1>404 - Page Not Found</h1></div>';
    }

    // Render Navigation (persistent)
    appContainer.appendChild(createNavigation(hash));
}

function createNavigation(currentHash) {
    const nav = document.createElement('nav');
    nav.className = 'nav-bar';

    const items = [
        { path: '/', icon: '🗺️', label: 'Route' },
        { path: '/pollution', icon: '🌫️', label: 'Pollution' },
        { path: '/hospitals', icon: '🏥', label: 'Hospitals' },
        { path: '/weather', icon: '⛅', label: 'Weather' },
        { path: '/account', icon: '👤', label: 'Account' }
    ];

    items.forEach(item => {
        const link = document.createElement('a');
        link.href = `#${item.path}`;
        link.className = `nav-item ${currentHash === item.path ? 'active' : ''}`;
        link.innerHTML = `
            <span class="nav-icon">${item.icon}</span>
            <span>${item.label}</span>
        `;
        nav.appendChild(link);
    });

    return nav;
}

// Global State
const savedUser = localStorage.getItem('sdg3_user');
const savedLocation = sessionStorage.getItem('sdg3_location');
const savedTheme = localStorage.getItem('sdg3_theme');

window.appState = {
    user: savedUser ? JSON.parse(savedUser) : {
        problems: [],
        location: 'Kuala Lumpur',
        premium: false
    },
    theme: savedTheme || 'default',
    // Location coordinates stored here once retrieved
    coordinates: savedLocation ? JSON.parse(savedLocation) : null
};

// ... (rest of the file)

// Helper to update mode
window.updateAppMode = function (mode) {
    document.body.className = ''; // Reset
    if (mode !== 'default') {
        document.body.classList.add(`mode-${mode}`);
    }
    window.appState.theme = mode;
    localStorage.setItem('sdg3_theme', mode);

    // Notify assistant
    if (window.assistant) {
        window.assistant.say(`Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`);
    }
};

// Global Location Service - Request once per session
window.getLocation = function () {
    return new Promise((resolve, reject) => {
        // Check if we already have location stored
        if (window.appState.coordinates) {
            console.log('Using cached location:', window.appState.coordinates);
            resolve(window.appState.coordinates);
            return;
        }

        // Request location from browser with high accuracy
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };

                    // Store in appState and sessionStorage
                    window.appState.coordinates = coords;
                    sessionStorage.setItem('sdg3_location', JSON.stringify(coords));

                    console.log('Location retrieved and cached:', coords, `Accuracy: ${coords.accuracy}m`);

                    // Notify user via assistant
                    if (window.assistant) {
                        window.assistant.say('Location detected! 📍');
                    }

                    resolve(coords);
                },
                (error) => {
                    console.error('Location error:', error);

                    // Provide helpful error messages
                    let errorMsg = 'Location unavailable';
                    if (error.code === 1) errorMsg = 'Location permission denied';
                    if (error.code === 2) errorMsg = 'Location unavailable';
                    if (error.code === 3) errorMsg = 'Location timeout';

                    if (window.assistant) {
                        window.assistant.say(`${errorMsg} 😔`);
                    }

                    reject(error);
                },
                {
                    enableHighAccuracy: true,  // Use GPS for better accuracy
                    timeout: 10000,            // 10 second timeout
                    maximumAge: 0              // Don't use cached position
                }
            );
        } else {
            // Browser doesn't support geolocation
            reject(new Error("Geolocation not supported"));
        }
    });
};

// Initialize
window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
    render();
    // Init Assistant
    if (window.App.AIAssistant) {
        window.assistant = new window.App.AIAssistant();
    }
    // Apply saved theme
    updateAppMode(window.appState.theme);
});

// Helper to update mode
window.updateAppMode = function (mode) {
    document.body.className = ''; // Reset
    if (mode !== 'default') {
        document.body.classList.add(`mode-${mode}`);
    }
    window.appState.theme = mode;

    // Notify assistant
    if (window.assistant) {
        window.assistant.say(`Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`);
    }
};
