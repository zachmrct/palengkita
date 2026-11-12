import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { ds, fonts } from '@/theme';

import { MARKET_MAP_HEIGHT, MARKET_MAP_HTML } from './marketMapHtml';

/** Native map: the design's Leaflet + OpenStreetMap view inside a WebView. */
export default function MarketMap() {
  return (
    <View style={styles.wrap}>
      <WebView
        originWhitelist={['*']}
        source={{ html: MARKET_MAP_HTML, baseUrl: 'https://localhost/' }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.map, styles.loading]}>
            <Text style={styles.loadingText}>Loading map…</Text>
          </View>
        )}
        accessibilityLabel="Market map centered on Quezon City"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: MARKET_MAP_HEIGHT, width: '100%' },
  map: { height: MARKET_MAP_HEIGHT, width: '100%', backgroundColor: ds.mint },
  loading: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
});
