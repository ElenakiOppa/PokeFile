import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import RegistryHeader from "../components/RegistryHeader";
import { getSetById } from "../data";
import { getSetRequirements } from "../lib/collectibles";
import { applyCardFilters, DEFAULT_SET_FILTERS, filterOptionsForCards, setFilterKey } from "../lib/cardFilters";

const SORT = ["Set Number (Default)", "Highest Market Value", "Rarity Tier (High to Low)"];
export default function SetFiltersScreen({ goBack, params = {}, collectionQuantities = {}, setFiltersByKey = {}, updateSetFilters = () => {} }) {
  const tier = String(params.tier || "master").toLowerCase();
  const set = getSetById(params.setId);
  const key = params.filterKey || setFilterKey(set?.id || params.setId, tier, params.scope || "set");
  const cards = getSetRequirements(set, tier);
  const options = filterOptionsForCards(cards);
  const initial = { ...DEFAULT_SET_FILTERS, ...(setFiltersByKey[key] || params.filters || {}) };
  const [show, setShow] = useState(initial.show);
  const [energy, setEnergy] = useState(initial.energy || []);
  const [rarity, setRarity] = useState(Array.isArray(initial.rarity) ? initial.rarity : [initial.rarity].filter((x) => x && x !== "All"));
  const [sortBy, setSortBy] = useState(initial.sortBy || SORT[0]);
  const toggle = (value, list, setter) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const reset = () => { setShow("All Cards"); setEnergy([]); setRarity([]); setSortBy(SORT[0]); };
  const nextFilters = { show, energy, rarity, sortBy };
  const resultCount = applyCardFilters(cards, nextFilters, collectionQuantities).length;
  const apply = () => { updateSetFilters(key, nextFilters); goBack(); };
  return <View style={styles.container}>
    <RegistryHeader title="Filter Set" onBack={goBack} right={<TouchableOpacity onPress={reset}><Text style={styles.reset}>Reset</Text></TouchableOpacity>} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.switchRow}><View><Text style={styles.rowTitle}>Owned Cards Only</Text><Text style={styles.hint}>Show only collectibles in your collection</Text></View><Switch value={show === "Owned"} onValueChange={(on) => setShow(on ? "Owned" : "All Cards")} trackColor={{ false: colors.borderStrong, true: colors.purple }} thumbColor={colors.bg} /></View>
      {options.energy.length ? <><Text style={styles.label}>ENERGY TYPE</Text><View style={styles.chips}>{options.energy.map((item) => <Chip key={item} label={item} active={energy.includes(item)} onPress={() => toggle(item, energy, setEnergy)} />)}</View></> : null}
      <Text style={styles.label}>RARITY TIER</Text><View style={styles.chips}>{options.rarity.map((item) => <Chip key={item} label={item} active={rarity.includes(item)} onPress={() => toggle(item, rarity, setRarity)} />)}</View>
      <Text style={styles.label}>SORT BY</Text>{SORT.map((item) => <TouchableOpacity key={item} style={[styles.sortRow, sortBy === item && styles.selected]} onPress={() => setSortBy(item)}><Text style={styles.sortText}>{item}</Text>{sortBy === item ? <Ionicons name="radio-button-on" size={14} color={colors.purple} /> : null}</TouchableOpacity>)}
    </ScrollView>
    <TouchableOpacity style={styles.primary} onPress={apply}><Text style={styles.primaryText}>Apply Filters ({resultCount} Cards)</Text></TouchableOpacity>
  </View>;
}
function Chip({ label, active, onPress }) { return <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:colors.bg,paddingHorizontal:20},content:{paddingBottom:96},reset:{color:colors.purple,fontSize:10,fontWeight:"700"},switchRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop:12},rowTitle:{color:colors.text,fontSize:12,fontWeight:"600"},hint:{color:colors.textTertiary,fontSize:8,marginTop:3},label:{color:colors.textTertiary,fontSize:8,fontWeight:"700",letterSpacing:.9,marginTop:24,marginBottom:9},chips:{flexDirection:"row",flexWrap:"wrap",gap:8},chip:{borderWidth:1,borderColor:colors.border,paddingHorizontal:13,paddingVertical:7,borderRadius:18},chipActive:{borderColor:colors.purple,backgroundColor:colors.purpleSoft},chipText:{color:colors.textSecondary,fontSize:9},chipTextActive:{color:colors.purple,fontWeight:"700"},sortRow:{height:40,borderRadius:8,borderWidth:1,borderColor:colors.border,backgroundColor:colors.card,paddingHorizontal:12,marginBottom:7,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},selected:{borderColor:colors.purple},sortText:{color:colors.text,fontSize:10},primary:{position:"absolute",left:20,right:20,bottom:12,height:48,borderRadius:7,backgroundColor:colors.purple,alignItems:"center",justifyContent:"center"},primaryText:{color:colors.bg,fontSize:11,fontWeight:"800"} });
