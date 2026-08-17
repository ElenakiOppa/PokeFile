import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { RegistryMenuRow, RegistrySettingsHeader, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

export default function DataSyncScreen({ goBack, collectionQuantities = {}, binders = [] }) {
  const cardCount = Object.values(collectionQuantities).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
  const cacheEstimate = Math.min(512, Math.max(4, Math.round((cardCount + binders.length * 8) * 0.14)));
  const info = () => Alert.alert('Saved on this device', 'Pokéfile automatically saves your collection and binders locally. Cloud backup is not enabled yet.');
  return <View style={shared.page}><RegistrySettingsHeader title="Data Sync" eyebrow="Database Integrity" goBack={goBack} /><View style={shared.content}>
    <View style={[shared.panel,s.status]}><View style={s.statusDot}><View style={s.dot} /></View><View><Text style={s.statusTitle}>On-device Database Saved</Text><Text style={s.statusMeta}>{cardCount} cards · {binders.length} binders stored locally</Text></View></View>
    <View style={[shared.panel,s.storage]}><View style={s.storageHeader}><Text style={s.storageLabel}>Index Cache Storage</Text><Text style={s.storageValue}>{cacheEstimate} MB / 512 MB</Text></View><View style={s.track}><View style={[s.fill,{width:`${Math.max(4,(cacheEstimate/512)*100)}%`}]} /></View></View>
    <TouchableOpacity style={s.primary} onPress={info}><Ionicons name="sync" size={18} color={colors.bg} /><Text style={s.primaryText}>Verify Local Index</Text></TouchableOpacity>
    <View style={[shared.panel,s.export]}><Text style={s.exportTitle}>Export Registry Catalog</Text><View style={s.exportRow}><TouchableOpacity style={s.secondary} onPress={() => Alert.alert('Export CSV','Registry export will be enabled with cloud backup.')}><Text style={s.secondaryText}>Export CSV</Text></TouchableOpacity><TouchableOpacity style={s.secondary} onPress={() => Alert.alert('Export JSON','Registry export will be enabled with cloud backup.')}><Text style={s.secondaryText}>Export JSON</Text></TouchableOpacity></View></View>
    <RegistryMenuRow icon="cloud-upload-outline" title="Cloud backup is not configured" value="Local only" onPress={info} />
    <RegistryMenuRow icon="trash-outline" title="Clear Cached Asset Images" disabled />
  </View></View>;
}
const s=StyleSheet.create({
  status:{height:68,paddingHorizontal:16,flexDirection:'row',alignItems:'center'},statusDot:{width:26,height:26,borderRadius:13,backgroundColor:'rgba(22,199,154,0.12)',alignItems:'center',justifyContent:'center',marginRight:12},dot:{width:8,height:8,borderRadius:4,backgroundColor:'#16C79A'},statusTitle:{color:colors.text,fontSize:13,fontWeight:'700'},statusMeta:{color:colors.textSecondary,fontSize:11,marginTop:3},
  storage:{padding:16,marginTop:18},storageHeader:{flexDirection:'row',justifyContent:'space-between'},storageLabel:{color:colors.textTertiary,fontSize:10,fontWeight:'700',textTransform:'uppercase'},storageValue:{color:colors.text,fontSize:11},track:{height:6,borderRadius:3,backgroundColor:colors.card,marginTop:14,overflow:'hidden'},fill:{height:6,borderRadius:3,backgroundColor:colors.purple},
  primary:{height:48,borderRadius:12,backgroundColor:colors.purple,marginTop:18,flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center'},primaryText:{color:colors.bg,fontSize:12,fontWeight:'800'},
  export:{padding:16,marginTop:14,marginBottom:12},exportTitle:{color:colors.text,fontSize:12,fontWeight:'700'},exportRow:{flexDirection:'row',gap:10,marginTop:12},secondary:{flex:1,height:40,borderRadius:10,borderWidth:1,borderColor:colors.border,backgroundColor:colors.card,alignItems:'center',justifyContent:'center'},secondaryText:{color:colors.text,fontSize:10,fontWeight:'700'},
});
