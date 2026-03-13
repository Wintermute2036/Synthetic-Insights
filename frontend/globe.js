const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDlhZWQ3My0wMTk3LTQ0OGUtYjA3Ny1mZTQxZWIwMmIyMGIiLCJpZCI6NDAzMjk5LCJpYXQiOjE3NzM0MzkyODh9.zmv8J3jQE6wQbtn_5QaTBDP6juDN5IufAgbQY9Ryfa0'
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

fetch('http://127.0.0.1:5000/api/seismic')
  .then(res => res.json())
  .then(data => {
    data.features.forEach(quake => {
      const [lon, lat, depth] = quake.geometry.coordinates;
      const mag = quake.properties.mag;
      const place = quake.properties.place;

      viewer.entities.add({
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