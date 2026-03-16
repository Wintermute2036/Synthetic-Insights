const CESIUM_TOKEN = 'yJhbGciOiJIeUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDlhZWQ3My0wMTk3LTQ0OGUtYjA3Ny1mZTQxZWIwMmIyMGIiLCJpZCI6NDAzMjk5LCJpYXQiOjE3NzM0MzkyODh9.zmv8J3jQE6wQbtn_5QaTBDP6juDN5IufAgbQY9Ryfa0'
Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

// --- SEISMIC LAYER ---
const seismicDataSource = new Cesium.CustomDataSource('seismic');
viewer.dataSources.add(seismicDataSource);

fetch('http://127.0.0.1:5000/api/seismic')
  .then(res => res.json())
  .then(data => {
    data.features.forEach(quake => {
      const [lon, lat, depth] = quake.geometry.coordinates;
      const mag = quake.properties.mag;
      const place = quake.properties.place;

      seismicDataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        point: {
          pixelSize: Math.max(4, mag * 4),
          color: Cesium.Color.RED.withAlpha(0.8),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1
        },
        label: {
          text: `M${mag} — ${place}`,
          font: '11px monospace',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          show: false
        },
        description: `<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km<br><b>Location:</b> ${place}`
      });
    });
  });

// --- FLIGHTS LAYER ---
const flightsDataSource = new Cesium.CustomDataSource('flights');
viewer.dataSources.add(flightsDataSource);

// --- PLANE ICON GENERATOR ---
function createPlaneIcon(color = '#00FFFF') {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  // Fuselage
  ctx.beginPath();
  ctx.ellipse(16, 16, 4, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wings
  ctx.beginPath();
  ctx.moveTo(16, 14);
  ctx.lineTo(1, 20);
  ctx.lineTo(8, 20);
  ctx.lineTo(16, 17);
  ctx.lineTo(24, 20);
  ctx.lineTo(31, 20);
  ctx.lineTo(16, 14);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(16, 25);
  ctx.lineTo(10, 30);
  ctx.lineTo(22, 30);
  ctx.lineTo(16, 25);
  ctx.fill();
  ctx.stroke();

  return canvas;
}

function loadFlights() {
  flightsDataSource.entities.removeAll();

  fetch('http://127.0.0.1:5000/api/flights')
    .then(res => res.json())
    .then(data => {
      data.forEach(flight => {
        flightsDataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            flight.longitude,
            flight.latitude,
            flight.altitude
          ),
          billboard: {
            image: createPlaneIcon('#00FFFF'),
            scale: 0.8,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 3.0e7, 0.3),
          },
          label: {
            text: flight.callsign,
            font: '10px monospace',
            fillColor: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            show: false,
            scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 3.0e7, 0.0),
          },
          description: `<b>Callsign:</b> ${flight.callsign}<br><b>Altitude:</b> ${flight.altitude} m<br><b>Velocity:</b> ${flight.velocity} m/s`
        });
      });
    });
}

// Load flights immediately then refresh every 30 seconds
loadFlights();
setInterval(loadFlights, 30000);