from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os
import logging                          # ← add this
from dotenv import load_dotenv
from feeds.flights import get_flights

load_dotenv()
logging.basicConfig(level=logging.INFO) # ← add this

app = Flask(__name__)
CORS(app)
app = Flask(__name__)
CORS(app)

@app.route('/api/seismic')
def seismic():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/api/flights')
def flights():
    return jsonify(get_flights())

if __name__ == '__main__':
    app.run(debug=True)