import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import FilterChip from '../components/FilterChip';
import BinderCover from '../components/BinderCover';
import { getSetById } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';

const GOALS = ['complete', 'master', 'grandmaster'];
const SORT_OPTIONS = ['Set Number', 'Name A–Z', 'Rarity', 'Price: High to Low', 'Price: Low to High', 'Owned First'];
const POCKET_LAYOUTS = [9, 16, 24];

export default function BinderSettingsScreen({ navigate, goBack, params = {}, binders = [], updateBinder = () => {}, collectionQuantities = {} }) {
  const binderId = params.binderId;
  const binder = useMemo(() => binders.find((item) => item.id === binderId), [binders, binderId]);
  const set = getSetById(binder?.setId || params.setId || binderId || 'me5');
  const availableGoals = GOALS.filter((item) => item !== 'grandmaster' || set.grandmasterAvailable);
  const [name, setName] = useState(binder?.name || set.name);
  const [goal, setGoal] = useState(String(binder?.tier || 'master').toLowerCase());
  const [sortBy, setSortBy] = useState(binder?.sortBy || 'Set Number');
  const [pocketLayout, setPocketLayout] = useState(Number(binder?.pocketLayout || 9));
  const [goalOpen, setGoalOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const cards = getSetRequirements(set, goal);
  const pageCapacity = pocketLayout === 24 ? 12 : pocketLayout;
  const owned = cards.filter((card) => isOwned(collectionQuantities, card)).length;
  const percent = cards.length ? Math.round((owned / cards.length) * 100) : 0;
  const save = () => {
    if (binder) updateBinder(binder.id, { name: name.trim() || set.name, tier: goal, sortBy, pocketLayout });
    goBack();
  };

  return (
    <View style={styles.screen}>
      <TopBar variant="back" onBackPress={goBack} onSearchPress={() => navigate('Search')} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.coverPanel}>
          <BinderCover set={set} styleId={binder?.coverStyle || 'classic'} name={name} compact />
        </View>

        <FieldLabel text="NAME" />
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={colors.textTertiary} />

        <FieldLabel text="GOAL" />
        <TouchableOpacity style={styles.pickerRow} onPress={() => setGoalOpen((value) => !value)}>
          <Text style={styles.pickerValue}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</Text><Text style={styles.pickerChevron}>{goalOpen ? '⌃' : '⌄'}</Text>
        </TouchableOpacity>
        {goalOpen ? <View style={styles.options}>{availableGoals.map((item) => <FilterChip key={item} label={item.toUpperCase()} active={goal === item} onPress={() => { setGoal(item); setGoalOpen(false); }} />)}</View> : null}

        <FieldLabel text="BINDER FORMAT" />
        <View style={styles.options}>{POCKET_LAYOUTS.map((item) => <FilterChip key={item} label={`${item}-POCKET`} active={pocketLayout === item} onPress={() => setPocketLayout(item)} />)}</View>

        <FieldLabel text="SORT BY" />
        <TouchableOpacity style={styles.pickerRow} onPress={() => setSortOpen((value) => !value)}>
          <Text style={styles.pickerValue}>{sortBy}</Text><Text style={styles.pickerChevron}>{sortOpen ? '⌃' : '⌄'}</Text>
        </TouchableOpacity>
        {sortOpen ? <View style={styles.optionList}>{SORT_OPTIONS.map((item) => (
          <TouchableOpacity key={item} style={[styles.optionRow, sortBy === item && styles.optionRowActive]} onPress={() => { setSortBy(item); setSortOpen(false); }}>
            <Text style={styles.optionText}>{item}</Text>{sortBy === item ? <Text style={styles.optionCheck}>✓</Text> : null}
          </TouchableOpacity>
        ))}</View> : null}

        <FieldLabel text="COVER" />
        <TouchableOpacity style={styles.pickerRow} onPress={() => navigate('CoverDesigner', { binderId: binder?.id, setId: set.id, tier: goal })}>
          <Text style={styles.pickerValue}>{set.name} · {(binder?.coverStyle || 'classic').replace(/\b\w/g, (char) => char.toUpperCase())}</Text><Text style={styles.pickerChevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <Stat value={String(cards.length)} label="Cards" />
          <Stat value={String(Math.ceil(cards.length / pageCapacity))} label="Pages" />
          <Stat value={String(percent)} label="Set %" />
        </View>
        <Text style={styles.ownedText}>{owned} of {cards.length} collected</Text>

        <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={styles.saveBtnText}>Save Changes</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FieldLabel({ text }) { return <Text style={styles.label}>{text}</Text>; }
function Stat({ value, label }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: 24 },
  coverPanel: { width: '100%', height: 170, marginTop: 14, overflow: 'hidden', borderRadius: 14 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginTop: 24 },
  input: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 15, marginTop: 9, color: colors.text, fontSize: 17, fontWeight: '500' },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 15, marginTop: 9 },
  pickerValue: { color: colors.text, fontSize: 16, flex: 1 }, pickerChevron: { color: colors.textSecondary, fontSize: 16, marginLeft: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  optionList: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginTop: 8, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionRowActive: { backgroundColor: colors.purpleSoft }, optionText: { color: colors.text, fontSize: 14 }, optionCheck: { color: colors.purple, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 34 }, stat: { alignItems: 'center', minWidth: 75 },
  statValue: { color: colors.text, fontSize: 30, fontWeight: '300' }, statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 5 },
  ownedText: { color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginTop: 10 },
  saveBtn: { backgroundColor: colors.purple, borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 30, marginBottom: 38 },
  saveBtnText: { color: colors.text, fontSize: 15, fontWeight: '700' },
});
