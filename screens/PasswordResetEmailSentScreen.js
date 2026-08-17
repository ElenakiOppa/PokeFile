import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FigmaAuthStatus from '../components/FigmaAuthStatus';
import { supabase } from '../lib/supabase';
export default function PasswordResetEmailSentScreen({ navigate, goBack, params }) {
  const email = params?.email || 'you@example.com'; const [resent, setResent] = useState(false); const [mailError, setMailError] = useState('');
  const resend = async () => { setMailError(''); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'pokefile://reset-password' }); if (error) { setMailError(error.message); return; } setResent(true); setTimeout(() => setResent(false), 2500); };
  return <FigmaAuthStatus eyebrow="SECURITY VERIFICATION" title="Reset Dispatched" icon="mail-outline" heading="Check Your Mailbox" message={`A secure password recovery link has been dispatched to ${email}. Click the link in the message to redefine your security credentials.`} primaryLabel="Open Email App" onPrimary={() => Linking.openURL('message://').catch(() => {})} onBack={goBack}><TouchableOpacity onPress={() => navigate('SignIn')}><Text style={styles.signIn}>Remembered credentials?  <Text style={styles.gold}>Sign In</Text></Text></TouchableOpacity><TouchableOpacity onPress={resend}><Text style={styles.resend}>{resent ? 'Reset link resent ✓' : 'Resend reset link'}</Text></TouchableOpacity>{mailError ? <Text style={styles.error}>{mailError}</Text> : null}</FigmaAuthStatus>;
}
const styles = StyleSheet.create({ signIn: { color: '#A1A1AA', fontSize: 13, textAlign: 'center' }, gold: { color: '#D4AF37', fontWeight: '600' }, resend: { color: '#71717A', fontSize: 12, textAlign: 'center' }, error: { color: '#E45D5D', fontSize: 12, textAlign: 'center' } });
