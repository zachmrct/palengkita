import * as Location from 'expo-location';
import { ArrowUpRight, MapPin, Navigation, Search, Store } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { CategoryTabs } from '@/components/kit/CategoryTabs';
import { Screen } from '@/components/kit/Screen';
import { Em, Greeting, H2, SectionHeading } from '@/components/kit/Typography';
import MarketMap from '@/components/meals/MarketMap';
import { ds, fonts } from '@/theme';

const OSM_URL = 'https://www.openstreetmap.org/#map=14/14.620/121.025';

const EXAMPLES = [
  { name: 'Neighborhood Palengke', distance: 0.8, total: 170 },
  { name: 'Community Fresh Market', distance: 1.4, total: 155 },
  { name: 'Weekend Farmers’ Market', distance: 2.1, total: 195 },
];

const SORTS = [
  { key: 'Nearest', label: 'Nearest' },
  { key: 'Lowest prices', label: 'Lowest prices' },
];

export default function MarketsScreen() {
  const [sort, setSort] = useState('Nearest');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const locate = async () => {
    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        setNotice('Location is unavailable on this device.');
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setNotice('Location access is unavailable. Showing the Quezon City preview.');
        return;
      }
      await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setNotice('Location received. Live market search is not connected yet.');
    } catch {
      setNotice('Location access is unavailable. Showing the Quezon City preview.');
    }
  };

  const visible = [...EXAMPLES]
    .sort((a, b) => (sort === 'Nearest' ? a.distance - b.distance : a.total - b.total))
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Screen>
      <Greeting
        icon={Store}
        eyebrow="YOUR NEIGHBORHOOD, FRESHER"
        title={
          <>
            Tara, <Em>palengke!</Em>
          </>
        }
        subtitle="Fresh finds, closer to home."
      />

      <Text style={styles.notice}>Market preview · Sample locations and prices, not live vendor data.</Text>

      <View style={styles.searchField}>
        <Search size={19} color={ds.mutedForeground} />
        <TextInput
          accessibilityLabel="Search markets"
          placeholder="Find a market"
          placeholderTextColor={ds.mutedForeground}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.mapWrap}>
        <MarketMap />
      </View>

      <SectionHeading
        trailing={
          <Button variant="ghost" size="icon" icon={Navigation} accessibilityLabel="Use my location" onPress={locate} />
        }
      >
        <H2>Markets around you</H2>
      </SectionHeading>

      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      <CategoryTabs tabs={SORTS} selected={sort} onSelect={setSort} />

      {visible.map((m, i) => (
        <View key={m.name} style={styles.listing}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{EXAMPLES.indexOf(m) + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{m.name}</Text>
            <View style={styles.distance}>
              <MapPin size={13} color={ds.mutedForeground} />
              <Text style={styles.distanceText}>{`${m.distance} km · Sample market`}</Text>
            </View>
            <PText style={styles.price}>
              {`Sample basket ~₱${m.total}${sort === 'Lowest prices' && i === 0 ? ' · Lowest estimate' : ''}`}
            </PText>
          </View>
          <Pressable
            onPress={() => Linking.openURL(OSM_URL)}
            accessibilityRole="link"
            accessibilityLabel={`Explore ${m.name} area on map`}
          >
            <ArrowUpRight size={20} color={ds.foreground} />
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: ds.butter,
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 18,
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 16,
    color: ds.foreground,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ds.border,
    backgroundColor: ds.card,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans, fontSize: 12, color: ds.foreground, padding: 0 },
  mapWrap: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: ds.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  listing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: ds.border,
  },
  number: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: ds.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontFamily: fonts.serif, fontSize: 22, color: ds.foreground },
  name: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: ds.foreground },
  distance: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  distanceText: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground },
  price: { fontFamily: fonts.sans, fontSize: 10, color: ds.green, marginTop: 7 },
});
