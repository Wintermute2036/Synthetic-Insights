import requests
import logging
import time

logger = logging.getLogger(__name__)

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
CACHE_DURATION = 60  # seconds — USGS updates every few minutes, no need to hammer it

_cache = {
    "data": None,
    "timestamp": 0
}

def get_seismic():
    now = time.time()

    # If we have cached data that's still fresh, return it
    if _cache["data"] is not None and (now - _cache["timestamp"]) < CACHE_DURATION:
        return _cache["data"]

    try:
        response = requests.get(USGS_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        _cache["data"] = data
        _cache["timestamp"] = now
        logger.info(f"Seismic data refreshed: {len(data.get('features', []))} events")
        return data

    except requests.exceptions.Timeout:
        logger.warning("USGS request timed out — serving stale cache if available")
    except requests.exceptions.ConnectionError:
        logger.warning("USGS connection error — serving stale cache if available")
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code if e.response is not None else "unknown"
        logger.warning(f"USGS HTTP error {status} — serving stale cache if available")
    except Exception as e:
        logger.error(f"Unexpected error fetching seismic data: {e}")

    # If anything went wrong, return stale cache rather than nothing
    if _cache["data"] is not None:
        return _cache["data"]

    # Absolute last resort — empty but valid GeoJSON so the frontend doesn't crash
    return {"type": "FeatureCollection", "features": []}