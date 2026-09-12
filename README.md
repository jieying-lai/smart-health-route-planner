<div align="center">

  # 🌿 AWhere? — SDG 3 Smart City Health Companion
  
  **An intelligent, health-conscious urban navigation web application tailored for Malaysian citizens.**

  [![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
  [![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900?style=flat-square&logo=leaflet&logoColor=white)](#)
  [![UN SDG 3](https://img.shields.io/badge/UN%20SDG-3%20Good%20Health-4C9F38?style=flat-square)](#)
  [![Status](https://img.shields.io/badge/Project%20Status-Complete-brightgreen?style=flat-square)](#)

</div>

---

## 📌 Problem Statement

In rapidly growing urban environments, citizens are constantly exposed to invisible health hazards like ambient air pollution (such as PM2.5), localized haze, sudden tropical thunderstorms, and extreme weather conditions in Malaysia. 

Vulnerable groups—such as children, the elderly, outdoor pedestrians, cyclists, and individuals with respiratory sensitivities—frequently navigate daily life without real-time, localized risk awareness. Conventional navigation solutions exclusively prioritize the shortest distance or fastest travel time, offering little to no protection against environmental health hazards.

---

## 💡 Our Solution

**AWhere?** bridges the gap between environmental monitoring and daily transit. By integrating real-time environmental APIs with an interactive mapping engine, the platform shifts the routing paradigm: **we prioritize human health over pure speed**.

The platform empowers urban residents to:
- Actively steer clear of polluted choke points, industrial corridors, and heavy traffic zones.
- Access live weather intelligence and air quality overlays across interactive maps.
- Locate nearby healthcare services and emergency medical facilities with a single tap.
- Receive tailored health tips and dynamic routing advice powered by an embedded AI wellness companion.

---

## ✨ Key Features

* 🗺️ **Health-Conscious Route Planning**:
  * **Pedestrians & Cyclists**: Intelligent alternative pathways that circumvent severe pollution clusters and congested roadways.
  * **Drivers**: Proactive hazard warnings for localized torrential downpours, low visibility, and weather disruptions.
* 🌫️ **Real-Time Environmental Monitoring**: Visual interactive heatmaps displaying localized Air Quality Index (AQI) levels to support informed outdoor mobility.
* 🏥 **Rapid Healthcare Access**: Integrated proximity routing to find and navigate to nearby clinics, pharmacies, and hospitals during emergencies.
* 🤖 **AI Assistant ("Little Assistant")**: A built-in AI companion providing contextual health recommendations, weather advisories, and wellness answers.
* 👤 **Personalized Health Profiles**: Customizes routing sensitivity and environmental alerts according to user-specific health considerations.

---

## 🛠️ Tech Stack & System Architecture
* **Core Frontend**: HTML5, Modern CSS3 (Glassmorphism design system), Vanilla JavaScript (Modular ES6+)
* **Interactive Mapping**: [Leaflet.js](https://leafletjs.com/)
* **External APIs & Services**:
  * **Weather Intelligence**: [Open-Meteo API](https://open-meteo.com/)
  * **Air Pollution Data**: [World Air Quality Index (WAQI) Project](https://aqicn.org/)
  * **Geocoding & POIs**: [LocationIQ](https://locationiq.com/)
  * **Routing & Directions**: [OpenRouteService](https://openrouteservice.org/)
* **Typography & UI Elements**: [Google Fonts](https://fonts.google.com/)

---

## 🚀 Getting Started

### Prerequisites

* A modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
* Python 3.x *(recommended for hosting a local development server)*.
