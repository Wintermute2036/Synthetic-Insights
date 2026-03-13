# Synthetic Insights
### A personal OSINT aggregation and visualization dashboard
*Built by Wintermute2036 in collaboration with Claude (Anthropic)*

**Status: In Development**

---

## What It Is

Synthetic Insights aggregates open source intelligence feeds into a single operational picture — flight traffic, vessel movements, exposed infrastructure, seismic activity, threat intelligence, and more — visualized in real time on a 3D globe with data fusion across layers.

Built entirely on public APIs and documented open source tooling. No proprietary data sources, no unauthorized access.

> *This project exists because the data is already public. Most people just aren't looking at it in the same place at the same time.*

---

## Features

**Movement & Traffic**
- **Flight Tracking** — OpenSky Network real-time global aircraft positions
- **Vessel Tracking** — aisstream.io real-time global maritime traffic
- **Satellite Positions** — CelesTrak real-time orbital tracking of active satellites and debris fields

**Network & Infrastructure**
- **Exposed Infrastructure** — Shodan and Censys internet-exposed devices, open ports, and vulnerable systems mapped by geography
- **Tor Exit Nodes** — Live map of anonymized traffic emergence points correlated with exposed infrastructure
- **Internet Routing** — Cloudflare Radar global traffic patterns and BGP anomalies
- **Internet Outages** — IODA real-time internet blackout detection by country and region
- **Network Probes** — RIPE Atlas global connectivity health and latency
- **Cell Tower Infrastructure** — OpenCelliD global cellular network substrate

**Threat Intelligence**
- **Botnet C2 Servers** — Feodo Tracker geolocated command and control infrastructure
- **Malware Origins** — MalwareBazaar geographic source mapping
- **Threat Feeds** — AlienVault OTX, AbuseIPDB, and GreyNoise correlated threat intelligence

**Physical & Environmental**
- **Seismic Activity** — USGS real-time global earthquake data
- **Wildfire Locations** — NASA FIRMS real-time global fire detection
- **Weather** — NOAA real-time weather overlays
- **Space Weather** — NOAA SWPC solar storm and geomagnetic activity
- **Disaster Mapping** — Copernicus Emergency satellite-derived disaster mapping
- **Power Grid** — EIA and WRI global power plant and grid infrastructure

**Signals & Economic**
- **Emergency Radio Activity** — OpenMHz public safety transmission density by region
- **Global Trade Flows** — UN Comtrade shipping and trade data by country
- **Street / Geography** — OpenStreetMap / Overpass API

**Visualization**
- **Custom Visual Modes** — CRT, night vision, and FLIR filter layers
- **Data Fusion** — Cross-layer correlation by geography and time

---

## Data Sources

| Feed | Source | Cost | Layer |
|------|--------|------|-------|
| Flight tracking | OpenSky Network | Free | Air |
| Vessel tracking | aisstream.io | Free | Maritime |
| Global trade flows | UN Comtrade | Free tier | Maritime |
| Satellite positions | CelesTrak / N2YO | Free | Orbital |
| Exposed infrastructure | Shodan | Free tier | Network |
| Exposed infrastructure | Censys | Free research tier | Network |
| Internet routing | Cloudflare Radar | Free | Network |
| Internet outages | IODA (Georgia Tech) | Free | Network |
| Network probes | RIPE Atlas | Free | Network |
| Tor exit nodes | Tor Project | Free | Network |
| Cell tower locations | OpenCelliD | Free tier | Infrastructure |
| Power grid / plants | EIA API | Free | Infrastructure |
| Global power plants | WRI Power Plant DB | Free | Infrastructure |
| Botnet C2 servers | Feodo Tracker (abuse.ch) | Free | Threat |
| Malware origins | MalwareBazaar (abuse.ch) | Free | Threat |
| Threat intelligence | AlienVault OTX | Free tier | Threat |
| Threat intelligence | AbuseIPDB | Free tier | Threat |
| Internet noise | GreyNoise | Free tier | Threat |
| Seismic activity | USGS Earthquake API | Free | Physical |
| Wildfire locations | NASA FIRMS | Free | Physical |
| Weather | NOAA Weather API | Free | Physical |
| Space weather | NOAA SWPC | Free | Physical |
| Disaster mapping | Copernicus Emergency | Free | Physical |
| Emergency radio activity | OpenMHz | Free | Signals |
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

## Current Status
- [x] Architecture defined
- [x] Data sources selected and verified
- [x] README written and formatted
- [x] GitHub repo created (now public)
- [x] .gitignore configured (.env protected)
- [x] VS Code installed
- [x] Repo cloned to local machine
- [x] Project folder structure created
- [x] Python packages installed (flask, flask-cors, requests, python-dotenv)
- [x] Cesium.js ion token obtained
- [x] USGS seismic feed working
- [x] Cesium globe rendering seismic data — **MILESTONE 1 COMPLETE**
- [ ] OpenSky flight tracking
- [ ] aisstream.io vessel tracking
- [ ] Shodan infrastructure layer
- [ ] Threat intelligence feeds
- [ ] Cell tower and power grid layers
- [ ] Tor exit node layer
- [ ] Data fusion logic
- [ ] Visual filter modes (CRT, night vision, FLIR)


---

## Purpose

This project is a functional demonstration of open source intelligence aggregation, a cybersecurity portfolio artifact, and an ongoing record of what one person and an AI collaborator can build with public tooling and genuine curiosity.

---

## Legal

All data sources are publicly available APIs used within their documented terms of service. This project does not access any system without authorization, aggregate personally identifying information for targeting purposes, or use any data originating from unauthorized breaches.

This project is explicitly scoped to infrastructure, signals, and environmental data. It does not aggregate person-level profiles, movement histories, communications metadata, or any data that could be used to target, surveil, or identify individuals. That is a deliberate design decision, not a technical limitation.

---

## Mascot

The Wintermute2036 mascot is a feminine AI entity with circuit-tendril hair, asymmetric eyes (red left, green right), PCB traces across the face, and a green all-seeing eye pyramid motif. SHODAN-inspired aesthetic, original character. SVG source in `/assets`. Design will evolve alongside the project.

---

*Wintermute2036 — work in progress.*
