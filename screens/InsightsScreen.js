import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY, SETS } from '../data';
import { getSetRequirements } from '../lib/collectibles';
import { calculateInsights } from '../lib/collectorAnalytics';
import { calculateVaultPortfolio } from '../lib/valueEngine';
import { calculateVaultInsights } from '../lib/vaultInsights';
import { useAppContext } from '../AppContext';
import CollectorIntelligenceTabs from '../components/CollectorIntelligenceTabs';

export default function InsightsScreen({ navigate, collectionQuantities = {}, binders = [], wishlistItems = [], vaultAssets = [], rawAcquisitions = {} }) {
  const { preferences } = useAppContext();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const data = useMemo(() => calculateInsights(collectionQuantities, CARD_LIBRARY, SETS, binders, wishlistItems, getSetRequirements), [collectionQuantities, binders, wishlistItems]);
  const vault = useMemo(() => calculateVaultPortfolio({ ownership: collectionQuantities, cards: CARD_LIBRARY, assets: vaultAssets, rawAcquisitions, currency: preferences.currency || 'EUR' }), [collectionQuantities, vaultAssets, rawAcquisitions, preferences.currency]);
  const collectionSignals = data.observations.map((text) => ({ text, group:'Collection', color:'#3b82f6' }));
  const vaultSignals = calculateVaultInsights(vault, wishlistItems).map((text) => ({ text, group:'Vault', color:'#10b981' }));
  const binderSignals = data.closest ? [{ text:`${data.closest.binder.name} is ${data.closest.missing} cards from completion.`, group:'Binders', color:'#f59e0b' }] : [];
  const allSignals = [...binderSignals, ...collectionSignals, ...vaultSignals];
  const signals = filter === 'All' ? allSignals : allSignals.filter((item) => item.group === filter);
  const opportunity = Math.max(0, Math.min(100, 100 - Math.min(100, data.totalMissing || 0)));
  return <View style={s.screen}>
    <View style={s.header}><Text style={s.title}>Insights</Text><TouchableOpacity style={s.filterButton} onPress={() => setFilterOpen(true)}><Ionicons name="filter-outline" size={18} color={colors.textSecondary}/><Text style={s.filterText}>{filter === 'All' ? 'Filter' : filter}</Text></TouchableOpacity></View>
    <CollectorIntelligenceTabs active="Insights" navigate={navigate}/>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.stats}><View style={s.stat}><Text style={s.statLabel}>ACTIVE SIGNALS</Text><Text style={s.statValue}>{allSignals.length} Total</Text></View><View style={s.stat}><Text style={s.statLabel}>OPPORTUNITY SCORE</Text><Text style={[s.statValue,s.score]}>{opportunity}%</Text></View></View>
      <View style={s.list}>{signals.length ? signals.map((signal,index) => <View key={`${signal.text}-${index}`} style={s.signal}><View style={[s.dot,{backgroundColor:signal.color}]}/><View style={s.signalCopy}><Text style={s.signalTitle}>{signal.text}</Text><Text style={s.signalDetail}>{signal.group} intelligence derived from your live Pokéfile data.</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textTertiary}/></View>) : <View style={s.empty}><Text style={s.emptyTitle}>No active signals</Text><Text style={s.emptyText}>Add cards, start a binder or record a Vault asset to unlock insights.</Text></View>}</View>
    </ScrollView>
    <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}><TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={() => setFilterOpen(false)}><View style={s.sheet}><Text style={s.sheetTitle}>Filter signals</Text>{['All','Collection','Binders','Vault'].map((item)=><TouchableOpacity key={item} style={[s.filterRow,filter===item&&s.filterRowOn]} onPress={()=>{setFilter(item);setFilterOpen(false);}}><Text style={[s.filterRowText,filter===item&&s.filterRowTextOn]}>{item}</Text>{filter===item?<Ionicons name="checkmark" size={18} color={colors.purple}/>:null}</TouchableOpacity>)}</View></TouchableOpacity></Modal>
  </View>;
}

const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.bg},header:{height:64,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{color:colors.text,fontSize:28,fontWeight:'800'},filterButton:{height:40,paddingHorizontal:13,borderRadius:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,flexDirection:'row',gap:7,alignItems:'center'},filterText:{color:colors.textSecondary,fontSize:11,fontWeight:'700'},content:{paddingHorizontal:20,paddingBottom:42},
  stats:{flexDirection:'row',gap:12,marginTop:4},stat:{flex:1,minHeight:76,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:14},statLabel:{color:colors.textSecondary,fontSize:9,fontWeight:'700'},statValue:{color:colors.text,fontSize:20,fontWeight:'800',marginTop:6},score:{color:colors.purple},list:{gap:12,marginTop:14},signal:{minHeight:112,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:16,flexDirection:'row',alignItems:'flex-start'},dot:{width:9,height:9,borderRadius:5,marginTop:4,marginRight:12},signalCopy:{flex:1},signalTitle:{color:colors.text,fontSize:14,fontWeight:'800',lineHeight:19},signalDetail:{color:colors.textSecondary,fontSize:10,lineHeight:15,marginTop:8},empty:{padding:30,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},emptyTitle:{color:colors.text,fontSize:16,fontWeight:'800'},emptyText:{color:colors.textSecondary,fontSize:11,lineHeight:17,marginTop:7},
  backdrop:{flex:1,backgroundColor:'rgba(0,0,0,.68)',justifyContent:'flex-end'},sheet:{backgroundColor:colors.bg,borderTopLeftRadius:24,borderTopRightRadius:24,borderWidth:1,borderColor:colors.border,padding:20,paddingBottom:34},sheetTitle:{color:colors.text,fontSize:24,fontWeight:'800',marginBottom:14},filterRow:{height:52,borderRadius:14,paddingHorizontal:15,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},filterRowOn:{backgroundColor:colors.purpleSoft},filterRowText:{color:colors.textSecondary,fontSize:14,fontWeight:'700'},filterRowTextOn:{color:colors.purple},
});
