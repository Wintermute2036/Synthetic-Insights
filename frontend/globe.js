Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;

// --- UTILITY ---
function sanitize(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

// Ensure the clock is running in real time — required for position interpolation
viewer.clock.shouldAnimate = true;

// --- SEISMIC LAYER ---
const seismicDataSource = new Cesium.CustomDataSource('seismic');
viewer.dataSources.add(seismicDataSource);

function loadSeismic() {
  seismicDataSource.entities.removeAll();

  fetch(window.API_BASE + '/api/seismic')
    .then(res => res.json())
    .then(data => {
      data.features.forEach(quake => {
        const [lon, lat, depth] = quake.geometry.coordinates;
        const mag = quake.properties.mag ?? 0;
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
          description: `<b>Magnitude:</b> ${sanitize(mag)}<br><b>Depth:</b> ${sanitize(depth)} km<br><b>Location:</b> ${sanitize(place)}`
        });
      });
    })
    .catch(err => console.error('Seismic fetch failed:', err));
}

// Load immediately, then refresh every 5 minutes
loadSeismic();
setInterval(loadSeismic, 300000);

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

// Generate icon once, reuse for every aircraft
const PLANE_ICON = createPlaneIcon('#00FFFF').toDataURL();

// --- FLIGHTS LAYER (Smooth Motion via SampledPositionProperty) ---
const flightsDataSource = new Cesium.CustomDataSource('flights');
viewer.dataSources.add(flightsDataSource);

// Persistent map: icao24 hex ID → Cesium entity
// Planes stay alive between polls so Cesium can interpolate their positions
const flightEntities = new Map();

function updateFlights() {
  const now = Cesium.JulianDate.now();

  fetch(window.API_BASE + '/api/flights')
    .then(res => res.json())
    .then(data => {
      // Track which aircraft are in this poll so we can prune the rest
      const activeIcaos = new Set();

      data.forEach(flight => {
        // Skip aircraft without a valid identifier
        if (!flight.icao24) return;

        activeIcaos.add(flight.icao24);

        const position = Cesium.Cartesian3.fromDegrees(
          flight.longitude,
          flight.latitude,
          flight.altitude
        );

        // Convert heading: OpenSky gives degrees clockwise from north
        // Cesium billboard rotation is radians counter-clockwise from screen-up
        const headingRad = (typeof flight.heading === 'number' && isFinite(flight.heading))
          ? -Cesium.Math.toRadians(flight.heading)
          : 0;

        let entity = flightEntities.get(flight.icao24);

        if (entity) {
          // --- EXISTING AIRCRAFT: feed it a new position sample ---
          entity.position.addSample(now, position);
          entity.billboard.rotation = headingRad;
          entity.label.text = flight.callsign;
          entity.description =
            `<b>Callsign:</b> ${sanitize(flight.callsign)}` +
            `<br><b>Altitude:</b> ${sanitize(flight.altitude)} m` +
            `<br><b>Velocity:</b> ${sanitize(flight.velocity)} m/s`;
        } else {
          // --- NEW AIRCRAFT: create entity with SampledPositionProperty ---
          const positionProperty = new Cesium.SampledPositionProperty();
          positionProperty.addSample(now, position);

          // Linear interpolation: plane moves in a straight line between samples
          positionProperty.setInterpolationOptions({
            interpolationDegree: 1,
            interpolationAlgorithm: Cesium.LinearApproximation
          });

          // Extrapolate forward so planes keep gliding past the last known sample
          // until the next poll arrives (prevents 30s freezes)
          positionProperty.forwardExtrapolationType = Cesium.ExtrapolationType.EXTRAPOLATE;
          positionProperty.forwardExtrapolationDuration = 60;

          entity = flightsDataSource.entities.add({
            id: flight.icao24,
            position: positionProperty,
            billboard: {
              image: PLANE_ICON,
              scale: 0.8,
              rotation: headingRad,
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
            description:
              `<b>Callsign:</b> ${sanitize(flight.callsign)}` +
              `<br><b>Altitude:</b> ${sanitize(flight.altitude)} m` +
              `<br><b>Velocity:</b> ${sanitize(flight.velocity)} m/s`
          });

          flightEntities.set(flight.icao24, entity);
        }
      });

      // Prune aircraft that dropped out of the feed (landed, out of range, etc.)
      for (const [icao, entity] of flightEntities) {
        if (!activeIcaos.has(icao)) {
          flightsDataSource.entities.remove(entity);
          flightEntities.delete(icao);
        }
      }
    })
    .catch(err => console.error('Flights fetch failed:', err));
}

// Load immediately, then refresh every 30 seconds
updateFlights();
setInterval(updateFlights, 30000);