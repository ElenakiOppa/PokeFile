
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

const CODE_LENGTH = 6;

export default function VerificationCodeScreen({ navigate, goBack, params }) {
  const email = (params && params.email) || 'you@example.com';
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (index, value) => {
    const clean = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < CODE_LENGTH - 1) {
      inputs.current[index + 1] && inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1] && inputs.current[index - 1].focus();
    }
  };

  const code = digits.join('');
  const canVerify = code.length === CODE_LENGTH;

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) { setAuthError(error.message); return; }
    setSeconds(30);
    setDigits(Array(CODE_LENGTH).fill(''));
  };
  const verifyCode = async () => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    navigate('AccountVerified');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>Sent to {email}</Text>

      <View style={styles.codeRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => { inputs.current[i] = r; }}
            value={d}
            onChangeText={(v) => setDigit(i, v)}
            onKeyPress={(e) => handleKeyPress(i, e)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.codeBox, d && styles.codeBoxFilled]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, (!canVerify || loading) && styles.primaryBtnDisabled]}
        disabled={!canVerify || loading}
        onPress={verifyCode}
      >
        <Text style={styles.primaryText}>{loading ? 'Verifying…' : 'Verify'}</Text>
      </TouchableOpacity>
      {authError ? <Text style={styles.authError}>{authError}</Text> : null}

      <TouchableOpacity
        style={styles.resendBtn}
        disabled={seconds > 0}
        onPress={handleResend}
      >
        <Text style={[styles.resendText, seconds > 0 && styles.resendTextDisabled]}>
          {seconds > 0 ? `Resend code in 0:${String(seconds).padStart(2, '0')}` : 'Resend code'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('AuthError', { reason: 'otp' })}>
        <Text style={styles.expiredLink}>Code expired?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  back: { marginTop: 16 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  title: { color: colors.text, fontSize: 26, fontWeight: '500', marginTop: 24 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  codeBox: {
    width: 46, height: 56, borderRadius: 10, backgroundColor: colors.card,
    color: colors.text, fontSize: 22, textAlign: 'center', borderWidth: 1.5, borderColor: colors.border,
  },
  codeBoxFilled: { borderColor: colors.purple },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 36 },
  primaryBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  resendBtn: { marginTop: 20, alignItems: 'center' },
  resendText: { color: colors.purple, fontSize: 14, fontWeight: '600' },
  resendTextDisabled: { color: colors.textTertiary },
  expiredLink: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 16 },
  authError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 10 },
});
