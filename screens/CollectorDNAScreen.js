import React, { useMemo } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY, SETS } from '../data';
import { calculateCollectorDNA } from '../lib/collectorAnalytics';
import CollectorIntelligenceTabs from '../components/CollectorIntelligenceTabs';
import { VaultHeader } from '../components/VaultUi';

const value = (entry, fallback = 'Unknown') => entry?.[0] || fallback;
const DNA_ROWS = [
  ['favoriteType', 'flame-outline', 'Favorite type'],
  ['favoriteGeneration', 'sparkles-outline', 'Top generation'],
  ['favoriteIllustrator', 'brush-outline', 'Favorite artist'],
  ['favoriteRarity', 'star-outline', 'Most collected rarity'],
  ['favoriteEra', 'time-outline', 'Preferred era'],
];

export default function CollectorDNAScreen({ navigate, goBack, collectionQuantities = {} }) {
  const dna = useMemo(() => calculateCollectorDNA(collectionQuantities, CARD_LIBRARY, SETS), [collectionQuantities]);
  const generation = dna.favoriteGeneration ? `Gen ${dna.favoriteGeneration[0]}` : 'Unknown';
  const values = {
    favoriteType: value(dna.favoriteType), favoriteGeneration: generation,
    favoriteIllustrator: value(dna.favoriteIllustrator), favoriteRarity: value(dna.favoriteRarity), favoriteEra: value(dna.favoriteEra),
  };
  return <View style={s.screen}>
    <VaultHeader title="Collector DNA" goBack={goBack} onRight={() => Share.share({ message: `My Pokéfile Collector DNA: ${values.favoriteType} type, ${values.favoriteGeneration}, ${values.favoriteRarity} rarity.` })} rightIcon="share-social-outline" />
    <CollectorIntelligenceTabs active="CollectorDNA" navigate={navigate} />
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>YOUR COLLECTOR DNA</Text>
      <Text style={s.title}>The Profile Matrix</Text>
      <View style={s.matrix}>
        <Text style={[s.axis, s.axisTop]}>TYPE</Text><Text style={[s.axis, s.axisLeft]}>ARTIST</Text><Text style={[s.axis, s.axisRight]}>GEN</Text><Text style={[s.axis, s.axisBottomLeft]}>RARITY</Text><Text style={[s.axis, s.axisBottomRight]}>VINTAGE</Text>
        <View style={s.ringOuter}><View style={s.ringInner}><View style={s.core} /></View></View>
        {[0,72,144,216,288].map((angle) => <View key={angle} style={[s.spoke,{transform:[{rotate:`${angle}deg`}]}]} />)}
      </View>
      <View style={s.rows}>{DNA_ROWS.map(([key, icon, label]) => <View key={key} style={s.row}>
        <View style={s.icon}><Ionicons name={icon} size={20} color={colors.purple} /></View>
        <View style={s.copy}><Text style={s.rowLabel}>{label}</Text><Text style={s.rowValue} numberOfLines={1}>{values[key]}</Text></View>
        {key === 'favoriteType' && dna.totalPhysical ? <Text style={s.badge}>{Math.round((dna.favoriteType?.[1] || 0) / dna.totalPhysical * 100)}% of collection</Text> : null}
      </View>)}</View>
      <Text style={s.note}>{dna.uniqueCards ? `Calculated from ${dna.uniqueCards} unique cards and ${dna.totalPhysical} physical copies. Unknown metadata is excluded.` : 'Add cards to reveal your collection profile.'}</Text>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.bg},content:{paddingHorizontal:20,paddingBottom:42},eyebrow:{color:colors.purple,fontSize:10,fontWeight:'800',letterSpacing:1.4,marginTop:8},title:{color:colors.text,fontSize:28,fontWeight:'800',marginTop:7},
  matrix:{height:250,borderRadius:20,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,marginTop:18,alignItems:'center',justifyContent:'center',overflow:'hidden'},ringOuter:{width:142,height:142,transform:[{rotate:'45deg'}],borderWidth:3,borderColor:colors.purple,backgroundColor:colors.purpleSoft,alignItems:'center',justifyContent:'center'},ringInner:{width:92,height:92,borderWidth:1,borderColor:colors.borderStrong,alignItems:'center',justifyContent:'center'},core:{width:44,height:44,borderWidth:1,borderColor:colors.borderStrong},spoke:{position:'absolute',width:1,height:92,backgroundColor:colors.borderStrong,top:79},axis:{position:'absolute',color:colors.textSecondary,fontSize:9,fontWeight:'800'},axisTop:{top:26},axisLeft:{left:49,top:91},axisRight:{right:50,top:91},axisBottomLeft:{left:61,bottom:31},axisBottomRight:{right:46,bottom:31},
  rows:{gap:10,marginTop:18},row:{minHeight:76,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:14,flexDirection:'row',alignItems:'center'},icon:{width:42,height:42,borderRadius:12,backgroundColor:colors.purpleSoft,alignItems:'center',justifyContent:'center',marginRight:13},copy:{flex:1},rowLabel:{color:colors.textSecondary,fontSize:9,fontWeight:'700',textTransform:'uppercase'},rowValue:{color:colors.text,fontSize:15,fontWeight:'800',marginTop:4},badge:{color:colors.purple,fontSize:9,fontWeight:'800'},note:{color:colors.textTertiary,fontSize:10,lineHeight:16,marginTop:18},
});
