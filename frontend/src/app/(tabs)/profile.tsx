import Slider from '@react-native-community/slider';
import { Clock3, Heart, Leaf, UserRound, Wallet } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { Screen } from '@/components/kit/Screen';
import { Select } from '@/components/kit/Select';
import { Em, Greeting, H2, SectionHeading, typography } from '@/components/kit/Typography';
import { MealGrid, RESTRICTION_OPTIONS } from '@/components/meals/MealBrowser';
import { useAuth } from '@/context/AuthContext';
import { usePalengkita } from '@/context/PalengkitaContext';
import { meals } from '@/data/meals';
import { ds, fonts } from '@/theme';

const TIME_OPTIONS = [
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
  { label: 'Up to 1 hour', value: 60 },
];

export default function ProfileScreen() {
  const { budget, setBudget, time, setTime, restriction, setRestriction, saved } = usePalengkita();
  const { user, signOut } = useAuth();
  const name = user?.name ?? 'Kaibigan';
  const firstName = name.split(' ')[0] ?? name;

  return (
    <Screen>
      <Greeting
        icon={UserRound}
        eyebrow="YOUR LITTLE CORNER"
        title={
          <>
            Kumusta, <Em>{`${firstName}!`}</Em>
          </>
        }
        subtitle="A little more you, in every meal."
      />

      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
        <Text style={styles.avatarBadge}>🌿</Text>
      </View>
      <H2 style={styles.center}>{name}</H2>
      <Text style={styles.location}>Quezon City · Preview profile</Text>

      <View style={styles.preferences}>
        <H2 style={{ marginBottom: 20 }}>My food preferences</H2>

        <View style={styles.pref}>
          <View style={styles.prefHead}>
            <Wallet size={17} color={ds.foreground} />
            <Text style={styles.prefLabel}>Budget per serving</Text>
            <PText style={styles.prefValue}>{`₱${budget}`}</PText>
          </View>
          <Slider
            accessibilityLabel="Budget per serving"
            minimumValue={30}
            maximumValue={200}
            step={5}
            value={budget}
            onValueChange={setBudget}
            minimumTrackTintColor={ds.green}
            maximumTrackTintColor={ds.border}
            thumbTintColor={ds.green}
            style={styles.slider}
          />
        </View>

        <View style={styles.pref}>
          <View style={styles.prefHead}>
            <Clock3 size={17} color={ds.foreground} />
            <Text style={styles.prefLabel}>Time to cook</Text>
          </View>
          <Select label="Time to cook" value={time} options={TIME_OPTIONS} onChange={setTime} fontSize={12} />
        </View>

        <View style={styles.pref}>
          <View style={styles.prefHead}>
            <Leaf size={17} color={ds.foreground} />
            <Text style={styles.prefLabel}>Dietary restrictions</Text>
          </View>
          <Select
            label="Dietary restrictions"
            value={restriction}
            options={RESTRICTION_OPTIONS}
            onChange={setRestriction}
            fontSize={12}
          />
        </View>
      </View>

      <SectionHeading trailing={<Heart size={19} color={ds.foreground} />}>
        <H2>Saved with love</H2>
      </SectionHeading>
      {saved.length > 0 ? (
        <MealGrid items={meals.filter((m) => saved.includes(m.id))} />
      ) : (
        <Text style={typography.muted}>Your favorite recipes will feel at home here.</Text>
      )}

      <Text style={typography.estimateNote}>
        Preferences and lists last for this visit. Account saving is not connected yet.
      </Text>

      <Button variant="outline" label="Log out" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 15,
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: ds.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontFamily: fonts.serif, fontSize: 42, color: ds.foreground },
  avatarBadge: { position: 'absolute', bottom: -4, right: -4, fontSize: 23 },
  center: { textAlign: 'center' },
  location: {
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: 11,
    color: ds.mutedForeground,
    marginTop: 7,
  },
  preferences: { marginVertical: 35 },
  pref: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: ds.border },
  prefHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 15 },
  prefLabel: { fontFamily: fonts.sans, fontSize: 13, color: ds.foreground },
  prefValue: { marginLeft: 'auto', fontFamily: fonts.sansBold, fontSize: 13, color: ds.foreground },
  slider: { width: '100%', height: 24 },
});
