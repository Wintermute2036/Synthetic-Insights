# Synthetic Insights by Wintermute

A personal OSINT aggregation and visualization dashboard built on publicly available data feeds, rendered on an interactive 3D globe.

**Status: In Development**

---

## What It Is

Synthetic Insights aggregates open source intelligence feeds into a single operational picture — flight traffic, exposed infrastructure, public camera feeds, seismic activity, and street traffic — visualized in real time on a 3D globe with data fusion across layers.

The project is built entirely on public APIs and documented open source tooling. No proprietary data sources, no unauthorized access.

---

## Features

- **Flight Tracking** — ADS-B Exchange integration for real-time unfiltered aircraft positions
- **Shodan Integration** — Internet-exposed devices, open ports, and vulnerable infrastructure mapped by geography
- **Public Camera Feeds** — Publicly accessible camera streams projected onto terrain
- **Seismic Activity** — USGS real-time earthquake data
- **Street Traffic** — OpenStreetMap / Overpass API
- **Custom Visual Modes** — CRT, night vision, and FLIR filter layers
- **Data Fusion** — Cross-layer correlation by geography and time

---

## Data Sources

| Feed | Source | Cost |
|------|---------|------|
| Flight tracking | ADS-B Exchange | Free API |
| Exposed infrastructure | Shodan | Free tier |
| Seismic data | USGS Earthquake API | Free |
| Street/geography | OpenStreetMap / Overpass | Free |
| Threat intelligence | AlienVault OTX | Free tier |
| Threat intelligence | AbuseIPDB | Free tier |
| Internet noise | GreyNoise | Free tier |

---

## Stack

- **Visualization:** Cesium.js (3D globe)
- **Backend:** Python 3.12
- **Editor:** VS Code
- **Version Control:** GitHub

---

## Architecture

Cesium.js handles the 3D visualization layer. A Python backend manages API calls, data normalization, and fusion logic. Each data feed is a modular layer that can be toggled independently. Data fusion correlates across feeds by geography and timestamp.

---

## Purpose

This project serves as a functional demonstration of open source intelligence aggregation, a cybersecurity portfolio artifact, and an ongoing documentation of what one person and an AI collaborator can build with public tooling and genuine curiosity.

---

## Legal

All data sources are publicly available APIs used within their documented terms of service. This project does not access any system without authorization, aggregate personally identifying information for targeting purposes, or use any data originating from unauthorized breaches.

---

*Built by Wintermute. Work in progress.*
