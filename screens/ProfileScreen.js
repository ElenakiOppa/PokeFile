import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';
import { calculateVaultPortfolio, formatMoney } from '../lib/valueEngine';
import { useAppContext } from '../AppContext';
import { RegistryMenuRow, RegistrySettingsHeader, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

export default function ProfileScreen({ navigate, binders = [], collectionQuantities = {}, vaultAssets = [], rawAcquisitions = {}, logOut = async () => {} }) {
  const { userProfile, updateUserProfile, preferences } = useAppContext();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(userProfile.displayName || 'Collector');
  const currency = preferences.currency || 'EUR';
  const portfolio = useMemo(() => calculateVaultPortfolio({ ownership: collectionQuantities, cards: CARD_LIBRARY, assets: vaultAssets, rawAcquisitions, currency }), [collectionQuantities, vaultAssets, rawAcquisitions, currency]);
  const cardCount = Object.values(collectionQuantities).reduce((sum, value) => sum + Number(value || 0), 0);
  const level = Math.max(1, Math.floor(cardCount / 25) + 1);
  const levelProgress = Math.round(((cardCount % 25) / 25) * 100);
  const initials = String(userProfile.displayName || userProfile.email || 'Collector').split(/[\s@._-]+/).filter(Boolean).slice(0,2).map(part => part[0]?.toUpperCase()).join('');
  const saveName = () => { const displayName = draftName.trim(); if (displayName) updateUserProfile({ displayName }); setEditingName(false); };
  const pickAvatar = async () => { const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!permission.granted) return Alert.alert('Photo access needed','Allow Pokéfile to access your photos.'); const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes:['images'], allowsEditing:true, aspect:[1,1], quality:.8 }); if (!result.canceled && result.assets?.[0]?.uri) updateUserProfile({ avatarUri:result.assets[0].uri }); };
  const confirmLogout = () => Alert.alert('Log out of Pokéfile?','Your on-device collection will remain saved.',[{text:'Cancel',style:'cancel'},{text:'Log out',style:'destructive',onPress:()=>logOut().catch(error=>Alert.alert('Could not log out',error.message))}]);
  return <ScrollView style={shared.page} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <RegistrySettingsHeader title="Account Registry" eyebrow="Index Profile" />
    <View style={shared.content}>
      <View style={[shared.panel,s.userCard]}><View style={s.userRow}><TouchableOpacity style={s.avatarRing} onPress={pickAvatar}>{userProfile.avatarUri ? <Image source={{uri:userProfile.avatarUri}} style={s.avatar} /> : <View style={[s.avatar,s.fallback]}><Text style={s.initials}>{initials}</Text></View>}</TouchableOpacity><View style={s.identity}>{editingName ? <TextInput value={draftName} onChangeText={setDraftName} onBlur={saveName} onSubmitEditing={saveName} autoFocus style={s.nameInput} /> : <Text style={s.name}>{userProfile.displayName || 'Collector'}</Text>}<Text style={s.member}>{userProfile.email || 'Signed-in collector'}</Text><View style={s.badge}><Text style={s.badgeText}>POKÉFILE COLLECTOR</Text></View></View></View><View style={s.levelHead}><Text style={s.levelText}>Collector Level {level}</Text><Text style={s.levelProgress}>{levelProgress}% to Lvl {level+1}</Text></View><View style={s.track}><View style={[s.fill,{width:`${levelProgress}%`}]} /></View></View>
      <View style={s.stats}><Stat value={cardCount.toLocaleString()} label="Total Cards" accent /><Stat value={formatMoney(portfolio.totalValue,currency)} label="Est. Value" /><Stat value={binders.length} label="Binders" /></View>
      <RegistryMenuRow icon="person-outline" title="Edit Profile Information" value="Manage" onPress={() => setEditingName(true)} />
      <RegistryMenuRow icon="color-palette-outline" title="Appearance" value={preferences.theme || 'Dark'} onPress={() => navigate('Appearance')} />
      <RegistryMenuRow icon="language-outline" title="Language" value={preferences.language || 'English'} onPress={() => navigate('Language')} />
      <RegistryMenuRow icon="notifications-outline" title="Notifications" onPress={() => navigate('Notifications')} />
      <RegistryMenuRow icon="sync-outline" title="Data Sync" value="On device" onPress={() => navigate('DataSync')} />
      <RegistryMenuRow icon="information-circle-outline" title="About Pokéfile" onPress={() => navigate('About')} />
      <RegistryMenuRow icon="log-out-outline" title="Sign Out Pokéfile Session" danger onPress={confirmLogout} />
    </View>
  </ScrollView>;
}
function Stat({value,label,accent}) { return <View style={s.stat}><Text style={[s.statValue,accent&&s.accent]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={s.statLabel}>{label}</Text></View>; }
const s=StyleSheet.create({
  scroll:{paddingBottom:20},userCard:{padding:20,marginBottom:14},userRow:{flexDirection:'row',alignItems:'center'},avatarRing:{width:74,height:74,borderRadius:37,borderWidth:1.5,borderColor:colors.purple,padding:3},avatar:{width:65,height:65,borderRadius:33},fallback:{backgroundColor:colors.purpleSoft,alignItems:'center',justifyContent:'center'},initials:{color:colors.text,fontSize:18,fontWeight:'800'},identity:{flex:1,marginLeft:16},name:{color:colors.text,fontSize:18,fontWeight:'800'},nameInput:{color:colors.text,fontSize:18,fontWeight:'800',borderBottomWidth:1,borderBottomColor:colors.purple,paddingVertical:0},member:{color:colors.textSecondary,fontSize:10,marginTop:4},badge:{alignSelf:'flex-start',backgroundColor:colors.purpleSoft,borderWidth:.5,borderColor:colors.purple,borderRadius:6,paddingHorizontal:8,paddingVertical:3,marginTop:6},badgeText:{color:colors.purple,fontSize:8,fontWeight:'800'},levelHead:{flexDirection:'row',justifyContent:'space-between',marginTop:17},levelText:{color:colors.text,fontSize:10,fontWeight:'700'},levelProgress:{color:colors.purple,fontSize:10},track:{height:7,borderRadius:4,backgroundColor:colors.card,marginTop:8,overflow:'hidden'},fill:{height:7,borderRadius:4,backgroundColor:colors.purple},stats:{flexDirection:'row',gap:12,marginBottom:20},stat:{flex:1,height:76,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',padding:10},statValue:{color:colors.text,fontSize:16,fontWeight:'800',maxWidth:'100%'},accent:{color:colors.purple},statLabel:{color:colors.textTertiary,fontSize:8,textTransform:'uppercase',marginTop:6}
});
