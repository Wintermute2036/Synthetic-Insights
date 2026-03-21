from flask import Flask, jsonify
from flask_cors import CORS
import os
import logging
from dotenv import load_dotenv
from feeds.seismic import get_seismic
from feeds.flights import get_flights

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

@app.route('/api/seismic')
def seismic():
    return jsonify(get_seismic())

@app.route('/api/flights')
def flights():
    return jsonify(get_flights())

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true')

