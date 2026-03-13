# Synthetic Insights
### A personal OSINT aggregation and visualization dashboard
*Built by Wintermute2036 in collaboration with Claude (Anthropic)*

**Status: In Development**

---

## What It Is

Synthetic Insights aggregates open source intelligence feeds into a single operational picture — flight traffic, exposed infrastructure, seismic activity, and street traffic — visualized in real time on a 3D globe with data fusion across layers.

Built entirely on public APIs and documented open source tooling. No proprietary data sources, no unauthorized access.

> *This project exists because the data is already public. Most people just aren't looking at it in the same place at the same time.*

---

## Features

- **Flight Tracking** — ADS-B Exchange integration for real-time unfiltered aircraft positions
- **Shodan Integration** — Internet-exposed devices, open ports, and vulnerable infrastructure mapped by geography
- **Seismic Activity** — USGS real-time earthquake data
- **Street Traffic** — OpenStreetMap / Overpass API
- **Custom Visual Modes** — CRT, night vision, and FLIR filter layers
- **Data Fusion** — Cross-layer correlation by geography and time

---


## Data Sources

| Feed | Source | Cost | Layer |
|------|--------|------|-------|
| Flight tracking | ADS-B Exchange | Free | Air |
| Vessel tracking | MarineTraffic | Free tier | Maritime |
| Satellite positions | CelesTrak / N2YO | Free | Orbital |
| Exposed infrastructure | Shodan | Free tier | Network |
| Exposed infrastructure | Censys | Free research tier | Network |
| Internet routing | Cloudflare Radar | Free | Network |
| Internet outages | IODA (Georgia Tech) | Free | Network |
| Network probes | RIPE Atlas | Free | Network |
| Botnet C2 servers | Feodo Tracker (abuse.ch) | Free | Threat |
| Threat intelligence | AlienVault OTX | Free tier | Threat |
| Threat intelligence | AbuseIPDB | Free tier | Threat |
| Internet noise | GreyNoise | Free tier | Threat |
| Seismic activity | USGS Earthquake API | Free | Physical |
| Wildfire locations | NASA FIRMS | Free | Physical |
| Weather | NOAA Weather API | Free | Physical |
| Space weather | NOAA SWPC | Free | Physical |
| Disaster mapping | Copernicus Emergency | Free | Physical |
| Street / geography | OpenStreetMap / Overpass | Free | Geography |

---

## Stack

| Layer | Tool |
|-------|------|
| Visualization | Cesium.js (3D globe) |
| Backend | Python 3.12 |
| Editor | VS Code |
| Version Control | GitHub |

---

## Architecture

Cesium.js handles the 3D visualization layer. A Python backend manages API calls, data normalization, and fusion logic. Each data feed is a modular layer that can be toggled independently. Data fusion correlates across feeds by geography and timestamp.

---

## Build Status

- [x] Architecture defined
- [x] Data sources selected
- [ ] Project scaffold
- [ ] USGS seismic feed
- [ ] Cesium globe rendering
- [ ] ADS-B flight tracking
- [ ] Shodan infrastructure layer
- [ ] Threat intelligence feeds
- [ ] Data fusion logic
- [ ] Visual filter modes

---

## Purpose

This project is a functional demonstration of open source intelligence aggregation, a cybersecurity portfolio artifact, and an ongoing record of what one person and an AI collaborator can build with public tooling and genuine curiosity.

---

## Legal

All data sources are publicly available APIs used within their documented terms of service. This project does not access any system without authorization, aggregate personally identifying information for targeting purposes, or use any data originating from unauthorized breaches.

---

## Mascot

The Wintermute2036 mascot is a feminine AI entity with circuit-tendril hair, asymmetric eyes (red left, green right), PCB traces across the face, and a green all-seeing eye pyramid motif. SHODAN-inspired aesthetic, original character. SVG source in `/assets`. Design will evolve alongside the project.

---

*Wintermute2036 — work in progress.*
