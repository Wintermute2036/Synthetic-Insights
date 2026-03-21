import requests
import time
import logging
import os

# --- Logging setup ---
# This replaces print() with a proper logging system.
# You can change INFO to DEBUG to see more detail, or WARNING to see less.
logger = logging.getLogger(__name__)

# --- Constants ---
OPENSKY_URL = "https://opensky-network.org/api/states/all"
CACHE_SECONDS = 15  # OpenSky anonymous tier: minimum 10s between requests

# --- Cache storage ---
# Two variables that live in memory while Flask is running.
# _cache holds the last successful response.
# _cache_time holds when we fetched it.
_cache = None
_cache_time = 0


def get_flights(bounds=None):
    """
    Fetch live flight data from OpenSky Network.

    Optional bounds parameter for geographic filtering:
        bounds = {
            "lamin": 24.0,   # southern latitude limit
            "lomin": -125.0, # western longitude limit
            "lamax": 50.0,   # northern latitude limit
            "lomax": -66.0   # eastern longitude limit
        }
    Pass None to fetch all flights globally (large payload).
    """
    global _cache, _cache_time

    # --- Cache check ---
    # If we fetched data less than CACHE_SECONDS ago, return what we have.
    # This prevents hammering OpenSky on every frontend poll.
    now = time.time()
    if _cache is not None and (now - _cache_time) < CACHE_SECONDS:
        logger.debug("Serving flights from cache.")
        return _cache

    # --- Build request ---
    params = {}
    if bounds:
        # Only add bounds if they look sane — avoid sending garbage to OpenSky
        required_keys = {"lamin", "lomin", "lamax", "lomax"}
        if required_keys.issubset(bounds.keys()):
            params.update(bounds)
        else:
            logger.warning("Bounds dict is missing required keys — ignoring bounds.")

    # --- Optional credentials ---
    # If OPENSKY_USER and OPENSKY_PASS are set in your .env, authenticated
    # requests get significantly better rate limits. If not set, anonymous mode.
    username = os.getenv("OPENSKY_USER")
    password = os.getenv("OPENSKY_PASS")
    auth = (username, password) if username and password else None

    # --- Fetch from OpenSky ---
    try:
        response = requests.get(
            OPENSKY_URL,
            params=params,
            auth=auth,
            timeout=10
        )

        # Distinguish between different failure types
        if response.status_code == 429:
            logger.warning("OpenSky rate limit hit (429). Serving stale cache if available.")
            return _cache if _cache is not None else []

        if response.status_code == 503:
            logger.warning("OpenSky returned 503 (service unavailable). Serving stale cache if available.")
            return _cache if _cache is not None else []

        # Raise for any other HTTP error (4xx, 5xx)
        response.raise_for_status()

        data = response.json()

    except requests.exceptions.Timeout:
        logger.error("OpenSky request timed out after 10s.")
        return _cache if _cache is not None else []

    except requests.exceptions.ConnectionError:
        logger.error("Could not connect to OpenSky. Network error.")
        return _cache if _cache is not None else []

    except requests.exceptions.HTTPError as e:
        logger.error(f"OpenSky HTTP error: {e}")
        return _cache if _cache is not None else []

    except Exception as e:
        logger.error(f"Unexpected error fetching flights: {e}")
        return _cache if _cache is not None else []

    # --- Parse response ---
    flights = []
    for state in data.get("states", []):

        # Guard: skip aircraft with no position fix
        # state[5] = longitude, state[6] = latitude
        if len(state) < 10:
            continue
        if state[5] is None or state[6] is None:
            continue

        flights.append({
            "callsign": str(state[1]).strip() if state[1] else "Unknown",
            "longitude": state[5],
            "latitude":  state[6],
            # Explicit None checks — don't use falsy test on numbers.
            # A plane at 0 altitude or 0 velocity is valid data, not missing data.
            "altitude":  state[7] if state[7] is not None else 0,
            "velocity":  state[9] if state[9] is not None else 0,
        })

    # --- Update cache ---
    _cache = flights
    _cache_time = now
    logger.info(f"OpenSky fetch successful. {len(flights)} aircraft returned.")

    return flights