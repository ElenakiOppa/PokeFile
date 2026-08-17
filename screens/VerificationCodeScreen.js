import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const CODE_LENGTH = 6;
export default function VerificationCodeScreen({ navigate, goBack, params }) {
  const email = params?.email || 'you@example.com';
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(58);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const inputs = useRef([]);
  useEffect(() => { if (seconds <= 0) return undefined; const timer = setTimeout(() => setSeconds((value) => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  const setDigit = (index, value) => { const clean = value.replace(/[^0-9]/g, '').slice(-1); const next = [...digits]; next[index] = clean; setDigits(next); if (clean && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus(); };
  const handleKeyPress = (index, event) => { if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus(); };
  const code = digits.join('');
  const verifyCode = async () => { setLoading(true); setAuthError(''); const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' }); setLoading(false); if (error) { setAuthError(error.message); return; } navigate('AccountVerified'); };
  const handleResend = async () => { const { error } = await supabase.auth.resend({ type: 'signup', email }); if (error) { setAuthError(error.message); return; } setSeconds(58); setDigits(Array(CODE_LENGTH).fill('')); };
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.body}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={goBack}><Ionicons name="chevron-back" size={16} color="#F4F4F5" /></TouchableOpacity><View><Text style={styles.eyebrow}>TWO-FACTOR SECURITY</Text><Text style={styles.title}>Enter Code</Text></View></View>
        <Text style={styles.info}>Enter the 6-digit confirmation code sent to <Text style={styles.email}>{email}</Text></Text>
        <View style={styles.codeRow}>{digits.map((digit, index) => <TextInput key={index} ref={(input) => { inputs.current[index] = input; }} value={digit} onChangeText={(value) => setDigit(index, value)} onKeyPress={(event) => handleKeyPress(index, event)} keyboardType="number-pad" maxLength={1} style={[styles.codeBox, digit && styles.codeBoxActive]} />)}</View>
        <View style={styles.actions}><TouchableOpacity style={[styles.primary, (code.length !== CODE_LENGTH || loading) && styles.disabled]} disabled={code.length !== CODE_LENGTH || loading} onPress={verifyCode}><Text style={styles.primaryText}>{loading ? 'Verifying…' : 'Verify Security Key'}</Text></TouchableOpacity>{authError ? <Text style={styles.error}>{authError}</Text> : null}<TouchableOpacity disabled={seconds > 0} onPress={handleResend} style={styles.timerRow}><Text style={styles.muted}>{seconds > 0 ? 'Resend code in' : 'Code expired?'}</Text><Text style={styles.gold}>{seconds > 0 ? `0:${String(seconds).padStart(2, '0')}` : 'Resend code'}</Text></TouchableOpacity></View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' }, body: { paddingHorizontal: 24, gap: 32 },
  header: { height: 64, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 16 }, backButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#A1A1AA', fontSize: 11, fontWeight: '500' }, title: { color: '#F4F4F5', fontSize: 22, fontWeight: '600', marginTop: 2 }, info: { color: '#A1A1AA', fontSize: 14, lineHeight: 18, textAlign: 'center' }, email: { color: '#F4F4F5', fontWeight: '600' },
  codeRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' }, codeBox: { width: 48, height: 56, borderRadius: 12, backgroundColor: '#121212', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', color: '#F4F4F5', fontSize: 20, fontWeight: '600', textAlign: 'center' }, codeBoxActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.12)' },
  actions: { gap: 16 }, primary: { height: 48, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }, primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' }, disabled: { opacity: 0.42 }, timerRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' }, muted: { color: '#A1A1AA', fontSize: 13 }, gold: { color: '#D4AF37', fontSize: 13, fontWeight: '600' }, error: { color: '#E45D5D', fontSize: 12, textAlign: 'center' },
});
