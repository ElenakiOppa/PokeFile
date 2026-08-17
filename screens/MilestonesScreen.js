import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { MILESTONES } from '../lib/milestones';
import { ownedCollectionEntries } from '../lib/collectorAnalytics';
import { CARD_LIBRARY } from '../data';
import CollectorIntelligenceTabs from '../components/CollectorIntelligenceTabs';

const progressFor = (milestone, totalPhysical, earned) => {
  if (earned) return { current: 1, target: 1, percent: 100 };
  const condition = milestone.condition || {};
  if (condition.type === 'owned-card-count') {
    const target = Number(condition.threshold || 1);
    return { current: Math.min(totalPhysical, target), target, percent: Math.min(100, Math.round(totalPhysical / target * 100)) };
  }
  return { current: 0, target: 1, percent: 0 };
};

export default function MilestonesScreen({ navigate, unlockedMilestones = [], collectionQuantities = {} }) {
  const unlocked = new Map(unlockedMilestones.map((item) => [item.id, item]));
  const totalPhysical = ownedCollectionEntries(collectionQuantities, CARD_LIBRARY).reduce((sum,item)=>sum+item.quantity,0);
  const pending = MILESTONES.filter((item)=>!unlocked.has(item.id));
  const complete = MILESTONES.filter((item)=>unlocked.has(item.id));
  return <View style={s.screen}>
    <View style={s.header}><Text style={s.title}>Milestones</Text><TouchableOpacity style={s.add} onPress={()=>navigate('Search')}><Ionicons name="add" size={22} color={colors.text}/></TouchableOpacity></View>
    <CollectorIntelligenceTabs active="Milestones" navigate={navigate}/>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.sectionOn}>IN PROGRESS</Text>
      <View style={s.list}>{pending.map((item)=>{
        const progress=progressFor(item,totalPhysical,false);
        return <View key={item.id} style={s.progressCard}><View style={s.icon}><Ionicons name={item.condition?.type==='owned-card-count'?'cube-outline':'book-outline'} size={19} color={colors.purple}/></View><View style={s.copy}><Text style={s.name}>{item.title}</Text><Text style={s.detail}>{item.detail || 'Continue building your Pokéfile collection.'}</Text><View style={s.progressMeta}><Text style={s.progressText}>{progress.current.toLocaleString()} / {progress.target.toLocaleString()}</Text><Text style={s.percent}>{progress.percent}%</Text></View><View style={s.track}><View style={[s.fill,{width:`${progress.percent}%`}]}/></View></View></View>;
      })}</View>
      <Text style={s.section}>COMPLETED MILESTONES</Text>
      <View style={s.list}>{complete.length ? complete.map((item)=>{const earned=unlocked.get(item.id);return <View key={item.id} style={s.completeCard}><View style={s.completeIcon}><Ionicons name="checkmark" size={20} color="#10b981"/></View><View style={s.copy}><Text style={s.name}>{item.title}</Text><Text style={s.detail}>{item.detail || 'Collection milestone completed.'}</Text></View><Text style={s.date}>{new Date(earned.unlockedAt || Date.now()).toLocaleDateString(undefined,{month:'short',year:'numeric'})}</Text></View>;}) : <View style={s.empty}><Text style={s.emptyTitle}>Your first milestone is close</Text><Text style={s.detail}>Add a card, create a binder, or record a Vault asset to begin.</Text></View>}</View>
    </ScrollView>
  </View>;
}

const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.bg},header:{height:64,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{color:colors.text,fontSize:28,fontWeight:'800'},add:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},content:{paddingHorizontal:20,paddingBottom:42},sectionOn:{color:colors.purple,fontSize:10,fontWeight:'800',letterSpacing:1.2,marginTop:8,marginBottom:12},section:{color:colors.textSecondary,fontSize:10,fontWeight:'800',letterSpacing:1.2,marginTop:28,marginBottom:12},list:{gap:12},
  progressCard:{minHeight:128,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:16,flexDirection:'row',alignItems:'flex-start'},icon:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center',marginRight:13},copy:{flex:1},name:{color:colors.text,fontSize:15,fontWeight:'800'},detail:{color:colors.textSecondary,fontSize:10,lineHeight:15,marginTop:5},progressMeta:{flexDirection:'row',justifyContent:'space-between',marginTop:13},progressText:{color:colors.purple,fontSize:9,fontWeight:'800'},percent:{color:colors.textSecondary,fontSize:9,fontWeight:'700'},track:{height:6,borderRadius:3,backgroundColor:colors.border,marginTop:7,overflow:'hidden'},fill:{height:'100%',borderRadius:3,backgroundColor:colors.purple},
  completeCard:{minHeight:86,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:14,flexDirection:'row',alignItems:'center'},completeIcon:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'rgba(16,185,129,.35)',backgroundColor:'rgba(16,185,129,.08)',alignItems:'center',justifyContent:'center',marginRight:13},date:{color:'#10b981',fontSize:9,fontWeight:'800',backgroundColor:'rgba(16,185,129,.08)',paddingHorizontal:8,paddingVertical:5,borderRadius:7},empty:{padding:24,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},emptyTitle:{color:colors.text,fontSize:15,fontWeight:'800'},
});
