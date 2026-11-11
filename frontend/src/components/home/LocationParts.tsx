import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChevronDownIcon, MapPinIcon } from '@/components/icons';
import { PText } from '@/components/PText';
import { BottomSheet, StepperButton } from '@/components/ui';
import type { UserLocation } from '@/hooks/useUserLocation';
import { fonts, palette, radii } from '@/theme';

/* Pill at the top: "Set your location v" ------------------------------ */

export function LocationPill({ location, onPress }: { location: UserLocation; onPress: () => void }) {
  const label = location.label ?? 'Set your location';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={location.label ? `Location: ${location.label}. Change` : 'Set your location'}
      style={({ pressed }) => [styles.pill, pressed && { opacity: 0.75 }]}
    >
      <MapPinIcon size={16} color={palette.ink} strokeWidth={2} />
      <Text style={styles.pillText} numberOfLines={1}>
        {label}
      </Text>
      <ChevronDownIcon size={16} color={palette.ink} strokeWidth={2.2} />
    </Pressable>
  );
}

/* Banner asking for permission ----------------------------------------- */

export function LocationBanner({
  location,
  onAllow,
  onManual,
}: {
  location: UserLocation;
  onAllow: () => void;
  onManual: () => void;
}) {
  const requesting = location.status === 'requesting';
  const denied = location.status === 'denied';

  return (
    <View style={styles.banner}>
      <View style={styles.bannerIcon}>
        <MapPinIcon size={19} color="#fff" strokeWidth={2} />
      </View>
      <View style={styles.bannerBody}>
        <Text style={styles.bannerTitle}>
          {denied ? 'Location is off' : 'Find palengkes near you'}
        </Text>
        <Text style={styles.bannerText}>
          {denied
            ? 'No problem. Type your area instead, or allow location later in your phone settings.'
            : 'We use your location only to show nearby markets, distances and prices. You can type it in instead.'}
        </Text>
        <View style={styles.bannerButtons}>
          {!denied ? (
            <Pressable
              onPress={onAllow}
              disabled={requesting}
              accessibilityRole="button"
              accessibilityLabel="Allow location"
              style={({ pressed }) => [
                styles.allow,
                (pressed || requesting) && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.allowText}>{requesting ? 'ASKING…' : 'ALLOW LOCATION'}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onManual}
            accessibilityRole="button"
            accessibilityLabel="Enter manually"
            style={({ pressed }) => [styles.manual, pressed && { backgroundColor: 'rgba(14,59,44,0.08)' }]}
          >
            <Text style={styles.manualText}>Enter manually</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* Sheet: type an area ---------------------------------------------------- */

const SUGGESTED_AREAS = ['Quezon City', 'Marikina', 'Makati', 'Pasig', 'Cebu City', 'Davao City'];

export function LocationSheet({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (area: string) => void;
}) {
  const [text, setText] = useState('');

  const save = (value: string) => {
    if (!value.trim()) return;
    onSave(value);
    setText('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="Where are you?" onClose={onClose}>
      <Text style={sheetStyles.help}>Type your barangay, city or landmark.</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="e.g. Brgy. San Roque, Marikina"
        placeholderTextColor={palette.placeholder}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => save(text)}
        accessibilityLabel="Your area"
        style={sheetStyles.input}
      />
      <View style={sheetStyles.chips}>
        {SUGGESTED_AREAS.map((area) => (
          <Pressable
            key={area}
            onPress={() => save(area)}
            accessibilityRole="button"
            accessibilityLabel={`Use ${area}`}
            style={({ pressed }) => [sheetStyles.chip, pressed && { opacity: 0.7 }]}
          >
            <Text style={sheetStyles.chipText}>{area}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => save(text)}
        disabled={!text.trim()}
        accessibilityRole="button"
        accessibilityLabel="Save location"
        style={({ pressed }) => [
          sheetStyles.save,
          !text.trim() && { opacity: 0.45 },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={sheetStyles.saveText}>SAVE LOCATION</Text>
      </Pressable>
    </BottomSheet>
  );
}

/* Sheet: budget + people -------------------------------------------------- */

const BUDGET_PRESETS = [150, 200, 300, 500];

export function BudgetSheet({
  visible,
  budget,
  people,
  onClose,
  onSave,
}: {
  visible: boolean;
  budget: number;
  people: number;
  onClose: () => void;
  onSave: (budget: number, people: number) => void;
}) {
  const [draftBudget, setDraftBudget] = useState(String(budget));
  const [draftPeople, setDraftPeople] = useState(people);

  const parsed = Number.parseInt(draftBudget.replace(/\D/g, ''), 10);
  const valid = Number.isFinite(parsed) && parsed > 0;

  return (
    <BottomSheet visible={visible} title="Budget at bilang ng tao" onClose={onClose}>
      <Text style={sheetStyles.label}>Budget today</Text>
      <View style={sheetStyles.budgetRow}>
        <PText style={sheetStyles.peso}>{'₱'}</PText>
        <TextInput
          value={draftBudget}
          onChangeText={(t) => setDraftBudget(t.replace(/\D/g, '').slice(0, 5))}
          keyboardType="number-pad"
          accessibilityLabel="Budget in pesos"
          style={[sheetStyles.input, sheetStyles.budgetInput]}
        />
      </View>
      <View style={sheetStyles.chips}>
        {BUDGET_PRESETS.map((value) => (
          <Pressable
            key={value}
            onPress={() => setDraftBudget(String(value))}
            accessibilityRole="button"
            accessibilityLabel={`${value} pesos`}
            style={({ pressed }) => [
              sheetStyles.chip,
              String(value) === draftBudget && sheetStyles.chipActive,
              pressed && { opacity: 0.7 },
            ]}
          >
            <PText
              style={[sheetStyles.chipText, String(value) === draftBudget && { color: '#fff' }]}
            >{`₱${value}`}</PText>
          </Pressable>
        ))}
      </View>

      <View style={sheetStyles.peopleRow}>
        <View>
          <Text style={sheetStyles.label}>Cooking for</Text>
          <Text style={sheetStyles.peopleValue}>
            {draftPeople} {draftPeople === 1 ? 'person' : 'people'}
          </Text>
        </View>
        <View style={sheetStyles.stepperRow}>
          <StepperButton
            kind="minus"
            label="Fewer people"
            disabled={draftPeople <= 1}
            onPress={() => setDraftPeople((n) => Math.max(1, n - 1))}
          />
          <StepperButton
            kind="plus"
            label="More people"
            disabled={draftPeople >= 12}
            onPress={() => setDraftPeople((n) => Math.min(12, n + 1))}
          />
        </View>
      </View>

      <Pressable
        onPress={() => {
          if (!valid) return;
          onSave(parsed, draftPeople);
          onClose();
        }}
        disabled={!valid}
        accessibilityRole="button"
        accessibilityLabel="Save"
        style={({ pressed }) => [sheetStyles.save, !valid && { opacity: 0.45 }, pressed && { opacity: 0.85 }]}
      >
        <Text style={sheetStyles.saveText}>SAVE</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pillText: {
    flexShrink: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
  },

  banner: {
    flexDirection: 'row',
    gap: 13,
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: palette.sageSoft,
    borderWidth: 1,
    borderColor: '#D5E3CB',
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBody: { flex: 1 },
  bannerTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16.5,
    lineHeight: 21,
    color: palette.ink,
  },
  bannerText: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19.5,
    color: palette.muted,
  },
  bannerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  allow: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    letterSpacing: 0.9,
    color: '#fff',
  },
  manual: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: palette.ink,
  },
});

const sheetStyles = StyleSheet.create({
  help: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: palette.muted,
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: radii.input + 8,
    borderWidth: 1.5,
    borderColor: palette.ink,
    backgroundColor: '#fff',
    fontFamily: fonts.body,
    fontSize: 16,
    color: palette.ink,
    outlineStyle: 'none' as never,
  },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  peso: { fontFamily: fonts.display, fontSize: 26, color: palette.ink },
  budgetInput: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: palette.ink },
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  peopleValue: { fontFamily: fonts.bodyBold, fontSize: 18, color: palette.ink },
  stepperRow: { flexDirection: 'row', gap: 8 },
  save: {
    height: 52,
    marginTop: 22,
    borderRadius: 14,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 1.1,
    color: '#fff',
  },
});
