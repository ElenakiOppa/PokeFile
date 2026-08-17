import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import FilterChip from "../components/FilterChip";
import { SETS } from "../data";
import CollectionSectionTabs from "../components/CollectionSectionTabs";
import { PRINTED_RARITIES, printedRarityLabel } from "../lib/cardRarity";

const SET_OPTIONS = Array.from(new Set(SETS.map((set) => set.name).filter(Boolean))).sort();
const RARITY = ["All", ...PRINTED_RARITIES];
const CONDITION = ["All", "Raw", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged", "PSA 10", "PSA 9", "PSA 8"];
const OWNERSHIP = ["All Cards", "Owned", "Missing"];
const SORT = ["Set Number (Default)", "Value: High to Low", "Value: Low to High", "Rarity: High to Low", "Name A–Z"];
const DEFAULTS = { sets: [], rarity: "All", condition: "All", ownership: "Owned", sortBy: "Set Number (Default)" };

export default function CollectionFiltersScreen({ goBack, navigate, collectionFilters = DEFAULTS, setCollectionFilters = () => {} }) {
  const initialSets = Array.isArray(collectionFilters.sets) ? collectionFilters.sets : collectionFilters.set && collectionFilters.set !== "All Sets" ? [collectionFilters.set] : [];
  const [sets, setSets] = useState(initialSets);
  const [rarity, setRarity] = useState(collectionFilters.rarity || DEFAULTS.rarity);
  const [condition, setCondition] = useState(collectionFilters.condition || DEFAULTS.condition);
  const [ownership, setOwnership] = useState(collectionFilters.ownership || DEFAULTS.ownership);
  const [sortBy, setSortBy] = useState(collectionFilters.sortBy || DEFAULTS.sortBy);
  const [setPickerOpen, setSetPickerOpen] = useState(false);
  const [setQuery, setSetQuery] = useState("");
  const visibleSets = useMemo(() => SET_OPTIONS.filter((name) => name.toLowerCase().includes(setQuery.trim().toLowerCase())), [setQuery]);
  const toggleSet = (name) => setSets((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const clear = () => { setSets([]); setRarity("All"); setCondition("All"); setOwnership("Owned"); setSortBy(DEFAULTS.sortBy); };
  const apply = () => { setCollectionFilters({ sets, rarity, condition, ownership, sortBy }); goBack(); };
  const setSummary = sets.length === 0 ? "All expansion sets" : sets.length === 1 ? sets[0] : `${sets.length} expansion sets selected`;

  return <View style={styles.container}>
    <View style={styles.header}><View><Text style={styles.title}>Registry Filters</Text><Text style={styles.kicker}>REFINE INDEX</Text></View><TouchableOpacity style={styles.closeButton} onPress={goBack}><Text style={styles.close}>×</Text></TouchableOpacity></View>
    <CollectionSectionTabs active="CollectionFilters" navigate={navigate} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>EXPANSION SET</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setSetPickerOpen(true)}><View style={styles.dropdownCopy}><Text style={styles.dropdownValue} numberOfLines={1}>{setSummary}</Text><Text style={styles.dropdownHint}>Choose one or multiple sets</Text></View><Ionicons name="chevron-down" size={20} color={colors.purple} /></TouchableOpacity>
      {sets.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedRail}>{sets.map((name) => <TouchableOpacity key={name} style={styles.selectedSet} onPress={() => toggleSet(name)}><Text style={styles.selectedSetText} numberOfLines={1}>{name}</Text><Ionicons name="close" size={14} color={colors.purple} /></TouchableOpacity>)}</ScrollView> : null}
      <Text style={styles.sectionLabel}>PRINTED RARITY</Text><View style={styles.chipRow}>{RARITY.map((item) => <FilterChip key={item} label={printedRarityLabel(item)} active={rarity === item} onPress={() => setRarity(item)} />)}</View>
      <Text style={styles.sectionLabel}>CONDITION</Text><View style={styles.chipRow}>{CONDITION.map((item) => <FilterChip key={item} label={item} active={condition === item} onPress={() => setCondition(item)} />)}</View>
      <Text style={styles.sectionLabel}>OWNERSHIP</Text><View style={styles.chipRow}>{OWNERSHIP.map((item) => <FilterChip key={item} label={item} active={ownership === item} onPress={() => setOwnership(item)} />)}</View>
      <Text style={styles.sectionLabel}>SORT BY</Text><View style={{paddingHorizontal:24,gap:8}}>{SORT.map((item) => <TouchableOpacity key={item} style={{minHeight:48,borderRadius:13,borderWidth:1,borderColor:sortBy === item ? colors.purple : colors.border,backgroundColor:sortBy === item ? colors.purpleSoft : colors.surface,paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}} onPress={() => setSortBy(item)}><Text style={{color:sortBy === item ? colors.purple : colors.textSecondary,fontSize:13,fontWeight:sortBy === item ? "800" : "600"}}>{item}</Text><Ionicons name={sortBy === item ? "radio-button-on" : "radio-button-off"} size={19} color={sortBy === item ? colors.purple : colors.textTertiary} /></TouchableOpacity>)}</View>
    </ScrollView>
    <View style={styles.actions}><TouchableOpacity style={styles.resetBtn} onPress={clear}><Text style={styles.resetText}>Reset All</Text></TouchableOpacity><TouchableOpacity style={styles.applyBtn} onPress={apply}><Text style={styles.applyText}>Apply Refinements</Text></TouchableOpacity></View>
    <Modal visible={setPickerOpen} transparent animationType="slide" onRequestClose={() => setSetPickerOpen(false)}><View style={styles.backdrop}><View style={styles.sheet}>
      <View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Expansion Sets</Text><Text style={styles.sheetMeta}>{sets.length ? `${sets.length} selected` : "All sets included"}</Text></View><TouchableOpacity style={styles.sheetClose} onPress={() => setSetPickerOpen(false)}><Ionicons name="close" size={22} color={colors.text} /></TouchableOpacity></View>
      <View style={styles.searchBox}><Ionicons name="search" size={18} color={colors.textTertiary} /><TextInput value={setQuery} onChangeText={setSetQuery} placeholder="Search expansion sets" placeholderTextColor={colors.textTertiary} style={styles.searchInput} /></View>
      <TouchableOpacity style={styles.option} onPress={() => setSets([])}><View style={[styles.checkbox, sets.length === 0 && styles.checkboxOn]}>{sets.length === 0 ? <Ionicons name="checkmark" size={15} color={colors.bg} /> : null}</View><Text style={styles.optionText}>All Sets</Text></TouchableOpacity>
      <ScrollView style={styles.optionList} showsVerticalScrollIndicator={false}>{visibleSets.map((name) => { const checked = sets.includes(name); return <TouchableOpacity key={name} style={styles.option} onPress={() => toggleSet(name)}><View style={[styles.checkbox, checked && styles.checkboxOn]}>{checked ? <Ionicons name="checkmark" size={15} color={colors.bg} /> : null}</View><Text style={styles.optionText}>{name}</Text></TouchableOpacity>; })}</ScrollView>
      <TouchableOpacity style={styles.done} onPress={() => setSetPickerOpen(false)}><Text style={styles.doneText}>Done · {sets.length || "All"} Selected</Text></TouchableOpacity>
    </View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:colors.bg,paddingTop:18},header:{paddingHorizontal:24,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},title:{color:colors.text,fontSize:32,fontWeight:"800"},kicker:{color:colors.purple,fontSize:11,fontWeight:"800",letterSpacing:1.4,marginTop:4},closeButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},close:{color:colors.text,fontSize:25,lineHeight:26},content:{paddingBottom:20},sectionLabel:{color:colors.purple,fontSize:12,fontWeight:"800",letterSpacing:1.3,marginTop:22,marginBottom:10,paddingHorizontal:24},dropdown:{marginHorizontal:24,minHeight:66,borderRadius:15,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,paddingHorizontal:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},dropdownCopy:{flex:1,minWidth:0},dropdownValue:{color:colors.text,fontSize:15,fontWeight:"800"},dropdownHint:{color:colors.textTertiary,fontSize:10,marginTop:4},selectedRail:{paddingHorizontal:24,paddingTop:10,gap:8},selectedSet:{maxWidth:210,height:36,borderRadius:18,borderWidth:1,borderColor:colors.purple,backgroundColor:colors.purpleSoft,paddingHorizontal:12,flexDirection:"row",alignItems:"center",gap:7},selectedSetText:{color:colors.purple,fontSize:11,fontWeight:"700",maxWidth:170},chipRow:{flexDirection:"row",flexWrap:"wrap",paddingHorizontal:24},actions:{flexDirection:"row",gap:10,paddingHorizontal:24,paddingBottom:14,paddingTop:10},resetBtn:{flex:1,height:54,borderRadius:14,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},resetText:{color:colors.text,fontSize:14,fontWeight:"700"},applyBtn:{flex:1.35,height:54,backgroundColor:colors.purple,borderRadius:14,alignItems:"center",justifyContent:"center"},applyText:{color:colors.bg,fontSize:14,fontWeight:"800"},backdrop:{flex:1,backgroundColor:"rgba(0,0,0,.72)",justifyContent:"flex-end"},sheet:{height:"78%",backgroundColor:colors.bg,borderTopLeftRadius:26,borderTopRightRadius:26,borderWidth:1,borderColor:colors.border,padding:22,paddingBottom:30},sheetHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},sheetTitle:{color:colors.text,fontSize:27,fontWeight:"800"},sheetMeta:{color:colors.purple,fontSize:11,fontWeight:"700",marginTop:4},sheetClose:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},searchBox:{height:50,borderRadius:14,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,flexDirection:"row",alignItems:"center",paddingHorizontal:14,gap:10,marginTop:18},searchInput:{flex:1,color:colors.text,fontSize:14},optionList:{flex:1},option:{minHeight:52,borderBottomWidth:1,borderBottomColor:colors.border,flexDirection:"row",alignItems:"center",gap:13},checkbox:{width:24,height:24,borderRadius:6,borderWidth:1.5,borderColor:colors.textTertiary,alignItems:"center",justifyContent:"center"},checkboxOn:{backgroundColor:colors.purple,borderColor:colors.purple},optionText:{flex:1,color:colors.text,fontSize:14,fontWeight:"600"},done:{height:54,borderRadius:14,backgroundColor:colors.purple,alignItems:"center",justifyContent:"center",marginTop:14},doneText:{color:colors.bg,fontSize:14,fontWeight:"800"}});
