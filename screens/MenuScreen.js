import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';
import UserAvatar from '../components/UserAvatar';

const GROUPS = [
  { title: 'COLLECTION INDEX', items: [
    ['Home','Home','home-outline'], ['CollectionAll','Collection','albums-outline'], ['SeriesView','Sets & Expansions','grid-outline'], ['Binders','Binders','book-outline'], ['Wishlist','Wishlist','heart-outline'],
  ]},
  { title: 'INTELLIGENCE', items: [
    ['Search','Search Registry','search-outline'], ['Vault','Collector Vault','shield-checkmark-outline'], ['ValueHistory','Portfolio Analytics','analytics-outline'],
  ]},
  { title: 'ACCOUNT', items: [
    ['Profile','Profile & Settings','person-outline'], ['About','About Pokéfile','information-circle-outline'],
  ]},
];

export default function MenuScreen({ navigate, goBack }) {
  const { userProfile, preferences, updatePreferences } = useAppContext();
  const open = route => { goBack?.(); setTimeout(() => navigate(route), 0); };
  const theme = preferences.theme || 'Dark';
  return <View style={s.page}>
    <View style={s.header}><View><Text style={s.kicker}>POKÉFILE REGISTRY</Text><Text style={s.title}>Index Menu</Text></View><TouchableOpacity style={s.close} onPress={goBack}><Ionicons name="close" size={20} color={colors.text} /></TouchableOpacity></View>
    <TouchableOpacity style={s.profile} onPress={() => open('Profile')}><UserAvatar size={52} /><View style={s.profileCopy}><Text style={s.name}>{userProfile.displayName || 'Collector'}</Text><Text style={s.email} numberOfLines={1}>{userProfile.email || 'Pokéfile account'}</Text><Text style={s.profileAction}>VIEW ACCOUNT REGISTRY</Text></View><Ionicons name="chevron-forward" size={17} color={colors.textTertiary} /></TouchableOpacity>
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>{GROUPS.map(group => <View key={group.title}><Text style={s.group}>{group.title}</Text><View style={s.groupCard}>{group.items.map(([route,label,icon],index) => <TouchableOpacity key={route} style={[s.row,index < group.items.length-1 && s.divider]} onPress={() => open(route)}><View style={s.rowLeft}><View style={s.icon}><Ionicons name={icon} size={17} color={colors.purple} /></View><Text style={s.rowText}>{label}</Text></View><Ionicons name="chevron-forward" size={15} color={colors.textTertiary} /></TouchableOpacity>)}</View></View>)}</ScrollView>
    <View style={s.footer}><Text style={s.footerLabel}>APPEARANCE</Text><View style={s.theme}><ThemeButton icon="moon-outline" label="Dark" selected={theme === 'Dark'} onPress={() => updatePreferences({ theme:'Dark' })} /><ThemeButton icon="sunny-outline" label="Light" selected={theme === 'Light'} onPress={() => updatePreferences({ theme:'Light' })} /><ThemeButton icon="desktop-outline" label="System" selected={theme === 'System'} onPress={() => updatePreferences({ theme:'System' })} /></View></View>
  </View>;
}
function ThemeButton({icon,label,selected,onPress}) { return <TouchableOpacity style={[s.themeButton,selected&&s.themeOn]} onPress={onPress}><Ionicons name={icon} size={16} color={selected?colors.purple:colors.textTertiary} /><Text style={[s.themeText,selected&&s.themeTextOn]}>{label}</Text></TouchableOpacity>; }
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:colors.bg,paddingHorizontal:20},header:{paddingTop:24,paddingBottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},kicker:{color:colors.purple,fontSize:9,fontWeight:'800',letterSpacing:1.3},title:{color:colors.text,fontSize:26,fontWeight:'800',marginTop:3},close:{width:40,height:40,borderRadius:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},
  profile:{minHeight:82,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:14,flexDirection:'row',alignItems:'center'},profileCopy:{flex:1,marginLeft:13},name:{color:colors.text,fontSize:15,fontWeight:'800'},email:{color:colors.textSecondary,fontSize:10,marginTop:2,maxWidth:210},profileAction:{color:colors.purple,fontSize:8,fontWeight:'800',letterSpacing:.7,marginTop:6},
  scroll:{paddingBottom:138},group:{color:colors.textTertiary,fontSize:9,fontWeight:'800',letterSpacing:1.1,marginTop:20,marginBottom:8},groupCard:{borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,overflow:'hidden'},row:{height:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},divider:{borderBottomWidth:1,borderBottomColor:colors.border},rowLeft:{flexDirection:'row',alignItems:'center'},icon:{width:32,height:32,borderRadius:9,backgroundColor:colors.card,alignItems:'center',justifyContent:'center',marginRight:12},rowText:{color:colors.text,fontSize:13,fontWeight:'600'},
  footer:{position:'absolute',left:20,right:20,bottom:16,backgroundColor:colors.bg,paddingTop:10},footerLabel:{color:colors.textTertiary,fontSize:8,fontWeight:'800',letterSpacing:1.1,marginBottom:7},theme:{height:48,borderRadius:14,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,padding:4,flexDirection:'row',gap:4},themeButton:{flex:1,borderRadius:10,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},themeOn:{backgroundColor:colors.card,borderWidth:1,borderColor:colors.border},themeText:{color:colors.textTertiary,fontSize:10,fontWeight:'700'},themeTextOn:{color:colors.purple}
});
