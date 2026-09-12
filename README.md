# AWhere? - SDG 3 Smart City Health Companion

**AWhere?** is a cutting-edge smart city application developed for all citizens in Malaysia. Our mission is to promote **Good Health and Well-being** by empowering urban residents with real-time environmental data and health-conscious navigation tools.

## Problem Statement

In rapidly growing urban environments, citizens are constantly exposed to invisible health hazards like air pollution, extreme weather in Malaysia, and lack of real-time alerts. Vulnerable groups (children, elderly, and those with respiratory issues) are particularly at risk, yet they lack a unified tool to navigate their city safely.

## Our Solution

AWhere? bridges this gap by integrating real-time environmental data with smart routing. Unlike standard navigation apps that prioritize speed, AWhere? prioritizes your health. We help users avoid hazardous zones, find the cleanest air routes, and access medical help instantly.

## Key Features

- Route Planning\*\*:
  - Pedestrians/Cyclists: Routes that avoid high pollution zones and heavy traffic.
  - Drivers: Alerts for heavy rain and hazardous road conditions.
- Environmental Monitoring: Visual heatmap of AQI levels to help you breathe easier.
- Healthcare Features: One-tap access to the nearest medical facilities in emergencies.
- AI Chatbot - Little Assistant: A personalized AI companion that offers health tips, route suggestions, and answers your wellness questions.
- User Profiles - Solutions are tailored to health condition of the user

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (Vanilla ES6+)
- Mapping Engine: [Leaflet.js](https://leafletjs.com/)
- Data Powerhouses:
  - Open-Meteo (Weather Intelligence)
  - WAQI (Air Quality Index)
  - LocationIQ (Geocoding & POIs)
  - OpenRouteService (Smart Routing)
- Design: Modern UI with Glassmorphism effects, powered by [Google Fonts](https://fonts.google.com/).

## Getting Started

### Prerequisites

- Python 3.x (recommended for local server)
- A modern web browser (Chrome, Firefox, Edge)

### Configuration

This submission comes **pre-configured with demo API keys** so you can test the application immediately without any setup.

However, for a production environment or if you wish to use your own quotas, you can update the keys as follows:

1.  WAQI (Air Quality):
    - Get a free token from [WAQI API](https://aqicn.org/data-platform/token/).
    - Update `js/services/DataService.js`: `this.waqiApiKey = 'YOUR_KEY'`
2.  LocationIQ (Geocoding):
    - Sign up at [LocationIQ](https://locationiq.com/).
    - Update `js/services/DataService.js`: `this.locationIqKey = 'YOUR_KEY'`
3.  OpenRouteService (Routing):
    - Get a key from [OpenRouteService](https://openrouteservice.org/).
    - Update `js/services/RouteService.js`: `this.apiKey = 'YOUR_KEY'`

### Running the App

The Easy Way (Windows)
Simply double-click the `start_server.bat` file in the root directory. It will launch a local server and open the app in your browser automatically.

## Team

Built with ❤️ by Jet2Holiday.
