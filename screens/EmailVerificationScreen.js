import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function EmailVerificationScreen({ navigate, goBack, params }) {
  const email = params?.email || 'you@example.com';
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);
  const [mailError, setMailError] = useState('');
  const handleResend = async () => { setSending(true); setMailError(''); const { error } = await supabase.auth.resend({ type: 'signup', email }); setSending(false); if (error) { setMailError(error.message); return; } setResent(true); setTimeout(() => setResent(false), 2500); };
  const openMail = async () => { try { await Linking.openURL('message://'); } catch { navigate('VerificationCode', { email }); } };
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={goBack}><Ionicons name="chevron-back" size={16} color="#F4F4F5" /></TouchableOpacity><View><Text style={styles.eyebrow}>SECURITY INDEX</Text><Text style={styles.title}>Verify Email</Text></View></View>
        <View style={styles.iconBlock}><View style={styles.glow} /><View style={styles.iconCircle}><Ionicons name="mail-outline" size={44} color="#D4AF37" /></View></View>
        <View style={styles.copy}><Text style={styles.heading}>Verification Sent</Text><Text style={styles.message}>We have dispatched a validation link to <Text style={styles.email}>{email}</Text>. Access your email inbox to verify your profile.</Text></View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primary} onPress={openMail}><Ionicons name="open-outline" size={18} color="#080808" /><Text style={styles.primaryText}>Open Email App</Text></TouchableOpacity>
          <View style={styles.inline}><Text style={styles.muted}>Didn't receive email?</Text><TouchableOpacity onPress={handleResend}><Text style={styles.gold}>{sending ? 'Sending…' : resent ? 'Link resent ✓' : 'Resend Link'}</Text></TouchableOpacity></View>
          <TouchableOpacity onPress={() => navigate('VerificationCode', { email })}><Text style={styles.manual}>Enter verification code manually</Text></TouchableOpacity>
          {mailError ? <Text style={styles.error}>{mailError}</Text> : null}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' }, body: { paddingHorizontal: 24, gap: 32, alignItems: 'center' },
  header: { width: '100%', height: 64, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 16 }, backButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#A1A1AA', fontSize: 11, fontWeight: '500' }, title: { color: '#F4F4F5', fontSize: 22, fontWeight: '600', marginTop: 2 },
  iconBlock: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }, glow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(212,175,55,0.08)', shadowColor: '#D4AF37', shadowOpacity: 0.4, shadowRadius: 35 }, iconCircle: { width: 82, height: 82, borderRadius: 41, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', alignItems: 'center', justifyContent: 'center' },
  copy: { width: '100%', gap: 12, alignItems: 'center' }, heading: { color: '#F4F4F5', fontSize: 20, fontWeight: '600' }, message: { color: '#A1A1AA', fontSize: 14, lineHeight: 21, textAlign: 'center' }, email: { color: '#F4F4F5', fontWeight: '600' },
  actions: { width: '100%', gap: 16 }, primary: { height: 48, borderRadius: 14, backgroundColor: '#D4AF37', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' }, inline: { flexDirection: 'row', gap: 6, justifyContent: 'center' }, muted: { color: '#A1A1AA', fontSize: 13 }, gold: { color: '#D4AF37', fontSize: 13, fontWeight: '600' }, manual: { color: '#A1A1AA', fontSize: 12, textAlign: 'center', marginTop: -6 }, error: { color: '#E45D5D', fontSize: 12, textAlign: 'center' },
});
