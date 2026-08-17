
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import FilterChip from '../components/FilterChip';
import { CARD_LIBRARY, SETS } from '../data';
import CollectionSectionTabs from '../components/CollectionSectionTabs';

const SET_OPTIONS = ['All Sets', ...Array.from(new Set(SETS.map((set) => set.name).filter(Boolean)))];
const RARITY = ['All', ...Array.from(new Set(CARD_LIBRARY.map((card) => card.rarity).filter(Boolean))).sort()];
const CONDITION = ['All', 'Raw', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged', 'PSA 10', 'PSA 9', 'PSA 8'];
const OWNERSHIP = ['All Cards', 'Owned', 'Missing'];
const DEFAULTS = { set: 'All Sets', rarity: 'All', condition: 'All', ownership: 'Owned' };

export default function CollectionFiltersScreen({ goBack, navigate, collectionFilters = DEFAULTS, setCollectionFilters = () => {} }) {
  const [set, setSet] = useState(collectionFilters.set || DEFAULTS.set);
  const [rarity, setRarity] = useState(collectionFilters.rarity || DEFAULTS.rarity);
  const [condition, setCondition] = useState(collectionFilters.condition || DEFAULTS.condition);
  const [ownership, setOwnership] = useState(collectionFilters.ownership || DEFAULTS.ownership);
  const clear = () => {
    setSet(DEFAULTS.set);
    setRarity(DEFAULTS.rarity);
    setCondition(DEFAULTS.condition);
    setOwnership(DEFAULTS.ownership);
  };
  const apply = () => {
    setCollectionFilters({ set, rarity, condition, ownership });
    goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View><Text style={styles.title}>Registry Filters</Text><Text style={styles.kicker}>REFINE INDEX</Text></View>
        <TouchableOpacity style={styles.closeButton} onPress={goBack}>
          <Text style={styles.close}>×</Text>
        </TouchableOpacity>
      </View>
      <CollectionSectionTabs active="CollectionFilters" navigate={navigate} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>EXPANSION SET</Text>
        <View style={styles.chipRow}>
          {SET_OPTIONS.map((s) => <FilterChip key={s} label={s} active={set === s} onPress={() => setSet(s)} />)}
        </View>

        <Text style={styles.sectionLabel}>RARITY</Text>
        <View style={styles.chipRow}>
          {RARITY.map((r) => <FilterChip key={r} label={r} active={rarity === r} onPress={() => setRarity(r)} />)}
        </View>

        <Text style={styles.sectionLabel}>CONDITION</Text>
        <View style={styles.chipRow}>
          {CONDITION.map((c) => <FilterChip key={c} label={c} active={condition === c} onPress={() => setCondition(c)} />)}
        </View>

        <Text style={styles.sectionLabel}>OWNERSHIP</Text>
        <View style={styles.chipRow}>
          {OWNERSHIP.map((o) => <FilterChip key={o} label={o} active={ownership === o} onPress={() => setOwnership(o)} />)}
        </View>
      </ScrollView>

      <View style={styles.actions}><TouchableOpacity style={styles.resetBtn} onPress={clear}><Text style={styles.resetText}>Reset All</Text></TouchableOpacity><TouchableOpacity style={styles.applyBtn} onPress={apply}><Text style={styles.applyText}>Apply Refinements</Text></TouchableOpacity></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 20 },
  header: { paddingHorizontal:24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  kicker:{color:colors.purple,fontSize:9,fontWeight:'800',letterSpacing:1.2,marginTop:3},
  closeButton:{width:30,height:30,borderRadius:15,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},
  close:{color:colors.text,fontSize:19,lineHeight:20},
  sectionLabel: { color: colors.purple, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 23, marginBottom: 10, paddingHorizontal:24 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal:24 },
  actions:{flexDirection:'row',gap:10,paddingHorizontal:24,paddingBottom:18,paddingTop:12},
  resetBtn:{flex:1,height:48,borderRadius:12,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},
  resetText:{color:colors.text,fontSize:12,fontWeight:'700'},
  applyBtn: { flex:1.25,backgroundColor: colors.purple, borderRadius: 12, alignItems: 'center',justifyContent:'center' },
  applyText: { color: colors.bg, fontSize: 12, fontWeight: '800' },
});
