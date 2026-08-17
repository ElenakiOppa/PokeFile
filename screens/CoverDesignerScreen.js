import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import FilterChip from '../components/FilterChip';
import BinderCover from '../components/BinderCover';
import { SETS, getSetById } from '../data';

const { width } = Dimensions.get('window');
const STYLE_GAP = 12;
const STYLE_WIDTH = (width - 48 - STYLE_GAP) / 2;
const COVER_STYLES = [
  { id: 'classic', name: 'Black' }, { id: 'artwork', name: 'Contour' },
  { id: 'marble', name: 'Vortex' }, { id: 'minimal', name: 'Poké Ball' },
  { id: 'line', name: 'Marble' }, { id: 'energy', name: 'Card Back' },
];
const TIERS = ['complete', 'master', 'grandmaster'];
const POCKET_LAYOUTS = [9, 16, 24];

export default function CoverDesignerScreen({ goBack, params = {}, createBinder = () => {}, updateBinder = () => {}, binders = [] }) {
  const editingBinder = binders.find((binder) => binder.id === params.binderId);
  const initialSet = getSetById(editingBinder?.setId || params.setId || 'me5');
  const [setId, setSetId] = useState(initialSet.id);
  const [tier, setTier] = useState(String(editingBinder?.tier || params.tier || 'master').toLowerCase());
  const [selectedStyle, setSelectedStyle] = useState(editingBinder?.coverStyle || 'classic');
  const [name, setName] = useState(editingBinder?.name || initialSet.name);
  const [pocketLayout, setPocketLayout] = useState(Number(editingBinder?.pocketLayout || 9));
  const [kind, setKind] = useState(editingBinder?.kind || 'set');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const set = getSetById(setId);
  const availableTiers = TIERS.filter((item) => item !== 'grandmaster' || set.grandmasterAvailable);
  const cards = tier === 'grandmaster' ? set.grandmasterCards : tier === 'complete' ? set.completeCards : set.masterCards;
  const pageCapacity = pocketLayout === 24 ? 12 : pocketLayout;
  const filteredSets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SETS.slice(0, 12);
    return SETS.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(normalized)).slice(0, 30);
  }, [query]);

  const selectSet = (nextSet) => {
    setSetId(nextSet.id);
    setName(nextSet.name);
    setSearchOpen(false);
    setQuery('');
  };
  const save = () => {
    const changes = { setId: set.id, name: name.trim() || set.name, tier, coverStyle: selectedStyle, pocketLayout, kind, slots: editingBinder?.slots || [] };
    if (editingBinder) updateBinder(editingBinder.id, changes);
    else createBinder({ ...changes, createdAt: new Date().toISOString(), sortBy: 'Set Number' });
    goBack();
  };

  return (
    <View style={styles.container}>
      <TopBar variant="back" onBackPress={goBack} onAvatarPress={() => {}} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headingRow}>
          <View><Text style={styles.title}>Design your cover</Text><Text style={styles.subtitle}>Pick a style</Text></View>
          <TouchableOpacity style={styles.searchButton} onPress={() => setSearchOpen((value) => !value)}><Text style={styles.searchIcon}>⌕</Text></TouchableOpacity>
        </View>

        {searchOpen ? (
          <View style={styles.setPicker}>
            <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Search a Pokémon set…" placeholderTextColor={colors.textTertiary} style={styles.searchInput} />
            {filteredSets.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.setRow, item.id === set.id && styles.setRowActive]} onPress={() => selectSet(item)}>
                <Text style={styles.setName}>{item.name}</Text><Text style={styles.setCode}>{item.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TouchableOpacity style={styles.currentSet} onPress={() => setSearchOpen(true)}>
            <View><Text style={styles.controlLabel}>POKÉMON SET</Text><Text style={styles.currentSetName}>{set.name}</Text></View><Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.controlLabel}>GOAL</Text>
        <View style={styles.tierRow}>{availableTiers.map((item) => <FilterChip key={item} label={item.toUpperCase()} active={tier === item} onPress={() => setTier(item)} />)}</View>

        <Text style={styles.controlLabel}>BINDER TYPE</Text>
        <View style={styles.tierRow}>
          <FilterChip label="SET CHECKLIST" active={kind === 'set'} onPress={() => setKind('set')} />
          <FilterChip label="FREEFORM" active={kind === 'freeform'} onPress={() => setKind('freeform')} />
        </View>

        <Text style={styles.controlLabel}>BINDER FORMAT</Text>
        <View style={styles.tierRow}>{POCKET_LAYOUTS.map((item) => <FilterChip key={item} label={`${item}-POCKET`} active={pocketLayout === item} onPress={() => setPocketLayout(item)} />)}</View>

        <View style={styles.styleGrid}>
          {COVER_STYLES.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.styleCard, selectedStyle === item.id && styles.styleCardActive]} onPress={() => setSelectedStyle(item.id)} activeOpacity={0.85}>
              <BinderCover set={set} styleId={item.id} compact />
              {selectedStyle === item.id ? <View style={styles.check}><Text style={styles.checkText}>✓</Text></View> : null}
              <Text style={[styles.styleNumber, selectedStyle === item.id && styles.styleNumberActive]}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.styleName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.previewSection}>
          <Text style={type.label}>PREVIEW</Text>
          <View style={styles.previewRow}>
            <View style={styles.previewCover}><BinderCover set={set} styleId={selectedStyle} name={name} compact /></View>
            <View style={styles.previewInfo}>
              <TextInput value={name} onChangeText={setName} style={styles.nameInput} placeholder="Binder name" placeholderTextColor={colors.textTertiary} />
              <Text style={styles.previewSubtitle}>{tier.charAt(0).toUpperCase() + tier.slice(1)} Set Binder</Text>
              <Text style={styles.previewCount}>{kind === 'freeform' ? 'Manual card arrangement' : `${cards.length} cards`}</Text>
              <Text style={styles.previewCount}>{pocketLayout === 24 ? '3 × 4 pages · 24 cards open' : pocketLayout === 16 ? '4 × 4 pages · 32 cards open' : '3 × 3 pages · 18 cards open'}</Text>
              <Text style={styles.previewCount}>{Math.ceil(cards.length / pageCapacity)} single pages</Text>
              <Text style={styles.editHint}>Tap the name to edit</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={save}><Text style={styles.saveText}>{editingBinder ? 'Save Cover' : 'Save Binder'}</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingBottom: 38 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16 },
  title: { color: colors.text, fontSize: 36, fontWeight: '300' }, subtitle: { color: colors.textSecondary, fontSize: 18, marginTop: 4 },
  searchButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, searchIcon: { color: colors.text, fontSize: 18 },
  controlLabel: { color: colors.textTertiary, fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginTop: 22 },
  currentSet: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12 },
  currentSetName: { color: colors.text, fontSize: 16, marginTop: 5 }, chevron: { color: colors.textSecondary, fontSize: 22 },
  tierRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  setPicker: { marginTop: 18, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, maxHeight: 360 },
  searchInput: { color: colors.text, backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 6 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 }, setRowActive: { backgroundColor: colors.purpleSoft },
  setName: { color: colors.text, fontSize: 13, flex: 1 }, setCode: { color: colors.textTertiary, fontSize: 11, marginLeft: 8 },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 },
  styleCard: { width: STYLE_WIDTH, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 12, padding: 6, marginBottom: STYLE_GAP },
  styleCardActive: { borderColor: colors.purple, borderWidth: 2, padding: 5 },
  styleNumber: { color: colors.textTertiary, fontSize: 11, marginTop: 7, marginLeft: 3 }, styleNumberActive: { color: colors.purple },
  styleName: { color: colors.text, fontSize: 14, margin: 3, marginTop: 2 },
  check: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }, checkText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  previewSection: { borderTopWidth: 1, borderTopColor: colors.border, marginHorizontal: -24, paddingHorizontal: 24, marginTop: 10, paddingTop: 2 },
  previewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 }, previewCover: { width: 112 }, previewInfo: { flex: 1, marginLeft: 22 },
  nameInput: { color: colors.text, fontSize: 23, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 5 },
  previewSubtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 10 }, previewCount: { color: colors.textSecondary, fontSize: 13, marginTop: 6 }, editHint: { color: colors.purple, fontSize: 12, marginTop: 14 },
  saveButton: { backgroundColor: colors.purple, borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 28 }, saveText: { color: colors.text, fontSize: 15, fontWeight: '700' },
});
