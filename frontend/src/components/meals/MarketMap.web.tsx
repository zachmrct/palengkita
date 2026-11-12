import { MARKET_MAP_HEIGHT, MARKET_MAP_HTML } from './marketMapHtml';

/** Web map: the same Leaflet document in an iframe (react-native-webview has no web build). */
export default function MarketMap() {
  return (
    <iframe
      title="Market map centered on Quezon City"
      srcDoc={MARKET_MAP_HTML}
      style={{ border: 0, width: '100%', height: MARKET_MAP_HEIGHT, display: 'block' }}
    />
  );
}
