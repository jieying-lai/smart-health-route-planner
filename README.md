<div align="center">

  # 🌿 AWhere? — AI-Driven Healthy City Route Planner
  ### 🏆 Developed for SDG XI Hackathon 2025 | Healthy Cities Track (SDG 3)

  **A smart urban mobility platform mapping real-time environmental data with AI-assisted routing to safeguard vulnerable city residents.**

  [![Hackathon](https://img.shields.io/badge/Event-SDG%20XI%20Hackathon%202025-blue?style=flat-square)](#)
  [![Track](https://img.shields.io/badge/Track-Healthy%20Cities%20(SDG%203)-4C9F38?style=flat-square)](#)
  [![Prototype](https://img.shields.io/badge/Solution-Pollution--Aware%20Planner-orange?style=flat-square)](#)
  [![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](#)

</div>

---

## 📌 Problem Statement & Context

In rapidly urbanizing centers across Malaysia, residents face escalating health vulnerabilities driven by hazardous air pollutants (PM2.5, $\text{CO}_2$, $\text{NO}_2$), heavy traffic congestion, and erratic tropical weather. 

While conventional routing engines prioritize the shortest physical travel time, they inadvertently direct vulnerable urban commuters—such as children, seniors, cyclists, and individuals with chronic respiratory issues—straight through high-risk pollution choke points.

---

## 💡 The Solution: AWhere?

Engineered for the **SDG XI Hackathon 2025 Healthy Cities Track**, **AWhere?** implements a **Pollution-Aware Route Planner & Smart Healthcare Access Platform**. 

The system directly addresses the three core hackathon subtopics:
1. **Air Quality & Health Risks**: Maps environmental pollution levels to spatial zones, steering commuters clear of hazard areas.
2. **Traffic & Environmental Stress**: Re-routes active commuters away from severe traffic congestion and weather hazards.
3. **Smart Healthcare Access**: Surfaces real-time spatial routes to nearby clinics, pharmacies, and hospitals during emergencies.

---

## ✨ Key Features

* 🗺️ **Pollution-Aware & Health-First Routing**:
  * Calculates dynamically weighted routes that avoid dense air pollution and major traffic bottlenecks.
  * Offers separate transit profiles for pedestrians/cyclists and drivers.
* 🌫️ **Spatial Air Quality Overlay**: Interactive heatmaps visualizing ambient Air Quality Index (AQI) values across city coordinates.
* 🏥 **One-Tap Emergency Medical Access**: Instant POI query providing optimized paths to the nearest medical facilities.
* 🤖 **AI Health Assistant ("Little Assistant")**: Contextual conversational agent providing wellness guidance, outdoor risk advisories, and weather warnings.
* 👤 **Custom Health Profiles**: Dynamic routing parameters that adapt to personal sensitivities (e.g., asthma, cardiac conditions).

---

## 🏗️ System Architecture & Data Orchestration

```text
[ Data & API Sources ]
├── WAQI / OpenAQ Platform       ──> Real-Time Air Quality Data (PM2.5)
├── Open-Meteo API               ──> Real-Time Weather Intelligence
├── OpenStreetMap / LocationIQ   ──> Geocoding & Medical POI Discovery
└── OpenRouteService Engine      ──> Dynamic Health-Weighted Routing
                 │
                 ▼
     [ Core Application Engine ] (Vanilla JS ES6+ / Glassmorphism UI)
                 │
                 ▼
     [ Leaflet.js Interactive Map Interface & AI Assistant ]
