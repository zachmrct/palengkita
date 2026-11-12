import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ArrowLeft, CalendarDays, Check, Clock3, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { Screen } from '@/components/kit/Screen';
import { Select } from '@/components/kit/Select';
import { Em, Eyebrow, Greeting, H2, SectionHeading, TextLink, typography } from '@/components/kit/Typography';
import { usePalengkita } from '@/context/PalengkitaContext';
import { filterMeals, meals } from '@/data/meals';
import { ds, fonts } from '@/theme';

const TIME_OPTIONS = [
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
  { label: 'Up to 1 hour', value: 60 },
];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['Breakfast', 'Lunch', 'Dinner'];
const SLOT_TIMES = ['7:00 AM', '12:00 PM', '6:30 PM'];

export default function ScheduleScreen() {
  const { plan, schedule, budget, time, setTime, restriction } = usePalengkita();
  const [day, setDay] = useState(12);
  const [slot, setSlot] = useState('');

  return (
    <Screen>
      <View style={{ marginBottom: 20 }}>
        <TextLink href="/" label="Back home" icon={ArrowLeft} iconSize={16} leading />
      </View>

      <Greeting
        icon={CalendarDays}
        iconSize={15}
        eyebrow="NOVEMBER 9–15, 2026"
        title={
          <>
            Your <Em>schedule.</Em>
          </>
        }
        subtitle="A little planning. A week of good eating."
      />

      <View style={styles.settings}>
        <Clock3 size={17} color={ds.foreground} />
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Time to cook per meal</Text>
          <Select
            label="Time to cook per meal"
            value={time}
            options={TIME_OPTIONS}
            onChange={setTime}
            fontSize={10}
            padding={8}
            style={{ maxWidth: 150 }}
          />
        </View>
      </View>

      <View style={styles.days}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
          const active = day === i + 9;
          return (
            <Pressable
              key={d}
              onPress={() => setDay(i + 9)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text style={[styles.dayName, active && styles.dayActiveText]}>{d}</Text>
              <Text style={[styles.dayNumber, active && styles.dayActiveText]}>{i + 9}</Text>
            </Pressable>
          );
        })}
      </View>

      <H2 size={24} style={{ marginTop: 30, marginBottom: 22 }}>
        {`${WEEKDAYS[day - 9]}, November ${day}`}
      </H2>

      {SLOTS.map((s, i) => {
        const m = meals.find((x) => x.id === plan[`${day}-${s}`]);
        return (
          <View key={s} style={styles.slot}>
            <SectionHeading
              trailing={
                <Button
                  variant="outline"
                  size="icon"
                  icon={Plus}
                  accessibilityLabel={`Plan ${s}`}
                  onPress={() => setSlot(s)}
                />
              }
            >
              <Eyebrow small>{SLOT_TIMES[i]!}</Eyebrow>
              <H2>{s}</H2>
            </SectionHeading>
            {m ? (
              <Link href={{ pathname: '/recipe/[id]', params: { id: m.id } }} asChild>
                <Pressable accessibilityRole="link" style={styles.scheduled}>
                  <Image source={m.image} contentFit="contain" style={styles.scheduledImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scheduledTitle}>{m.name}</Text>
                    <PText style={styles.scheduledMeta}>{`₱${m.price} / serving · ${m.minutes} min`}</PText>
                    <View style={styles.onMenu}>
                      <Check size={12} color={ds.green} />
                      <Text style={styles.onMenuText}>On the menu</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ) : (
              <Text style={styles.emptySlot}>Something delicious belongs here.</Text>
            )}
          </View>
        );
      })}

      <Modal visible={!!slot} transparent animationType="fade" onRequestClose={() => setSlot('')}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSlot('')} accessibilityLabel="Close selection" />
          <View style={styles.modal}>
            <SectionHeading
              trailing={
                <Button variant="ghost" size="icon" icon={X} accessibilityLabel="Close selection" onPress={() => setSlot('')} />
              }
            >
              <H2>{`Plan ${slot.toLowerCase()}`}</H2>
            </SectionHeading>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={typography.muted}>Within your budget and cooking time.</Text>
              {filterMeals(budget, time, restriction, '', slot).map((m) => (
                <Pressable
                  key={m.id}
                  accessibilityRole="button"
                  onPress={() => {
                    schedule(`${day}-${slot}`, m.id);
                    setSlot('');
                  }}
                  style={({ pressed }) => [styles.option, pressed && { opacity: 0.75 }]}
                >
                  <Image source={m.image} contentFit="contain" style={{ width: 65, height: 65 }} />
                  <View style={{ flex: 1, gap: 7 }}>
                    <Text style={styles.optionName}>{m.name}</Text>
                    <PText style={styles.optionMeta}>{`₱${m.price} · ${m.minutes} min`}</PText>
                  </View>
                  <Plus size={16} color={ds.foreground} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settings: {
    backgroundColor: ds.mint,
    paddingVertical: 14,
    paddingHorizontal: 11,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingsRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  settingsLabel: { flexShrink: 1, fontFamily: fonts.sans, fontSize: 10, color: ds.foreground },

  days: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginVertical: 20 },
  day: {
    width: 44,
    minWidth: 32,
    flexShrink: 1,
    height: 66,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dayActive: { backgroundColor: ds.foreground },
  dayName: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground },
  dayNumber: { fontFamily: fonts.sansMedium, fontSize: 15, color: ds.foreground },
  dayActiveText: { color: ds.primaryForeground },

  slot: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: ds.border },
  scheduled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: ds.mint,
  },
  scheduledImage: { width: 85, height: 85 },
  scheduledTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: ds.foreground },
  scheduledMeta: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground, marginTop: 7 },
  onMenu: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 7 },
  onMenuText: { fontFamily: fonts.sans, fontSize: 10, color: ds.green },
  emptySlot: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground, paddingVertical: 20 },

  backdrop: { flex: 1, backgroundColor: ds.scrim, alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '80%',
    padding: 24,
    borderRadius: 8,
    backgroundColor: ds.background,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 88,
    marginTop: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionName: { fontFamily: fonts.sansBold, fontSize: 14, color: ds.foreground },
  optionMeta: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground },
});
