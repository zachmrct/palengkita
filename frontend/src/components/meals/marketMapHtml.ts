import { ds } from '@/theme';

/**
 * The design's Leaflet map as a standalone HTML document, so native (WebView) and
 * web (iframe) render the exact same OpenStreetMap view. Centered on Quezon City
 * with three numbered sample markets, as in `market-map.tsx`.
 */
export const MARKET_MAP_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  * { box-sizing: border-box; }
  html, body, #map { margin: 0; width: 100%; height: 100%; }
  .market-marker span {
    width: 32px; height: 36px;
    border-radius: 18px 18px 18px 2px;
    background: ${ds.foreground}; color: ${ds.primaryForeground};
    display: grid; place-items: center;
    border: 3px solid ${ds.card};
    font: bold 14px sans-serif;
    box-shadow: 0 8px 30px rgba(12, 55, 38, 0.06);
  }
</style>
</head>
<body>
<div id="map" aria-label="Market map centered on Quezon City"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', { scrollWheelZoom: false }).setView([14.620, 121.025], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  [[14.625, 121.022], [14.612, 121.030], [14.633, 121.034]].forEach(function (p, i) {
    L.marker(p, {
      icon: L.divIcon({ className: 'market-marker', html: '<span>' + (i + 1) + '</span>', iconSize: [32, 38] })
    }).addTo(map).bindPopup('Sample market ' + (i + 1));
  });
</script>
</body>
</html>`;

export const MARKET_MAP_HEIGHT = 290;
