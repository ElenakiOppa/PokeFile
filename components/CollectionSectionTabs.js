import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";

const ITEMS = [["MyCollection", "Registry"], ["CollectionAll", "Database"], ["CollectionFilters", "Refine"], ["CollectionOverview", "Metrics"], ["CollectionHistory", "Timeline"]];

export default function CollectionSectionTabs({ active, navigate }) {
  return <View style={styles.shell}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{ITEMS.map(([route, label]) => <TouchableOpacity key={route} style={[styles.tab, active === route && styles.activeTab]} onPress={() => active !== route && navigate(route)}><Text style={[styles.label, active === route && styles.activeLabel]}>{label}</Text></TouchableOpacity>)}</ScrollView></View>;
}

const styles = StyleSheet.create({ shell:{marginHorizontal:20,marginTop:14,borderWidth:1,borderColor:colors.border,borderRadius:12,backgroundColor:colors.surface,overflow:"hidden"},row:{padding:4,gap:3},tab:{minWidth:74,height:34,paddingHorizontal:11,borderRadius:9,alignItems:"center",justifyContent:"center"},activeTab:{backgroundColor:colors.purpleSoft,borderWidth:1,borderColor:colors.purple},label:{color:colors.textTertiary,fontSize:9,fontWeight:"700",textTransform:"uppercase",letterSpacing:.5},activeLabel:{color:colors.purple} });
