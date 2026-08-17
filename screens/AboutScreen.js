import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { RegistryMenuRow, RegistrySettingsHeader, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

export default function AboutScreen({ goBack }) {
  const open = url => Linking.openURL(url).catch(() => Alert.alert('Unavailable','This page could not be opened.'));
  return <View style={shared.page}><RegistrySettingsHeader title="About" eyebrow="Registry Identity" goBack={goBack} /><View style={shared.content}>
    <View style={s.brand}><View style={s.mark}><View style={s.markLine} /><View style={s.markCenter} /></View><Text style={s.name}>POKÉFILE</Text><Text style={s.tag}>PREMIUM COLLECTION INDEX</Text><Text style={s.version}>VERSION 1.0.0</Text></View>
    <RegistryMenuRow icon="shield-checkmark-outline" title="Security & Privacy Policy" onPress={() => open('https://pokehaus.shop/privacy-policy')} />
    <RegistryMenuRow icon="document-text-outline" title="Terms of Service" onPress={() => open('https://pokehaus.shop/terms-and-conditions')} />
    <RegistryMenuRow icon="git-branch-outline" title="Open Source Licenses & Attributions" onPress={() => Alert.alert('Open source licenses','Pokéfile uses Expo, React Native, Supabase, TCGdex, Scrydex and provider-backed Pokémon catalog data.')} />
    <RegistryMenuRow icon="star-outline" title="Rate Pokéfile" value="5 Stars" onPress={() => Alert.alert('Thank you','Store rating will be available when Pokéfile is published.')} />
    <RegistryMenuRow icon="mail-outline" title="Contact Support" onPress={() => open('mailto:support@pokehaus.shop')} />
    <Text style={s.socialLabel}>Join our collector network</Text><View style={s.socials}>{['logo-instagram','logo-twitter','globe-outline'].map(icon => <TouchableOpacity key={icon} style={s.social} onPress={() => open('https://pokehaus.shop')}><Ionicons name={icon} size={19} color={colors.purple} /></TouchableOpacity>)}</View>
  </View></View>;
}
const s=StyleSheet.create({brand:{alignItems:'center',paddingVertical:10,marginBottom:24},mark:{width:64,height:64,borderRadius:32,backgroundColor:colors.purple,alignItems:'center',justifyContent:'center'},markLine:{position:'absolute',left:0,right:0,height:8,backgroundColor:colors.bg},markCenter:{width:19,height:19,borderRadius:10,borderWidth:3,borderColor:colors.bg,backgroundColor:colors.purple},name:{color:colors.text,fontSize:25,fontWeight:'800',marginTop:16},tag:{color:colors.purple,fontSize:10,fontWeight:'700',marginTop:3},version:{color:colors.textTertiary,fontSize:9,marginTop:6},socialLabel:{color:colors.textTertiary,fontSize:9,textTransform:'uppercase',textAlign:'center',marginTop:20},socials:{flexDirection:'row',justifyContent:'center',gap:12,marginTop:12},social:{width:44,height:44,borderRadius:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'}});
