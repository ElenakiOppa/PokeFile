import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
export default function AccountVerifiedScreen({ navigate }) {
  return <View style={styles.screen}><View style={styles.body}><View style={styles.header}><Text style={styles.eyebrow}>SECURE REGISTRY</Text><Text style={styles.title}>Verification Complete</Text></View><View style={styles.iconBlock}><View style={styles.glow} /><View style={styles.iconCircle}><Ionicons name="checkmark" size={44} color={colors.purple} /></View></View><View style={styles.copy}><Text style={styles.heading}>Registry Active</Text><Text style={styles.message}>Your trainer credentials have been validated successfully. Your vault and portfolio assets are now secured.</Text></View><TouchableOpacity style={styles.primary} onPress={() => navigate('CompleteProfile')}><Text style={styles.primaryText}>Enter Dashboard</Text></TouchableOpacity></View></View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' }, body: { paddingHorizontal: 24, gap: 32, alignItems: 'center' }, header: { width: '100%', height: 64, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }, eyebrow: { color: '#A1A1AA', fontSize: 11, fontWeight: '500' }, title: { color: '#F4F4F5', fontSize: 22, fontWeight: '600', marginTop: 2 },
  iconBlock: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }, glow: { position: 'absolute', width: 1, height: 1, borderRadius: 1, backgroundColor: colors.purple, shadowColor: colors.purple, shadowOpacity: 0.4, shadowRadius: 48, shadowOffset: { width: 0, height: 0 } }, iconCircle: { width: 82, height: 82, borderRadius: 41, borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)', alignItems: 'center', justifyContent: 'center' },
  copy: { gap: 12, alignItems: 'center' }, heading: { color: '#F4F4F5', fontSize: 22, fontWeight: '600' }, message: { color: '#A1A1AA', fontSize: 14, lineHeight: 21, textAlign: 'center' }, primary: { width: '100%', height: 48, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }, primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' },
});
