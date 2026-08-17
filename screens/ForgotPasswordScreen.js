
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordScreen({ navigate, goBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const canSubmit = email.trim().length > 0;
  const sendReset = async () => {
    setLoading(true);
    setAuthError('');
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo: 'pokefile://reset-password' });
    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    navigate('PasswordResetEmailSent', { email: normalizedEmail });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.subtitle}>Enter the email linked to your account and we'll send you reset instructions.</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.primaryBtn, (!canSubmit || loading) && styles.primaryBtnDisabled]}
        disabled={!canSubmit || loading}
        onPress={sendReset}
      >
        <Text style={styles.primaryText}>{loading ? 'Sending…' : 'Send Reset Link'}</Text>
      </TouchableOpacity>
      {authError ? <Text style={styles.authError}>{authError}</Text> : null}

      <TouchableOpacity onPress={() => navigate('SignIn')}>
        <Text style={styles.backToLogin}>Back to Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  back: { marginTop: 16 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  title: { color: colors.text, fontSize: 28, fontWeight: '300', marginTop: 24 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 10, lineHeight: 20 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 32 },
  input: {
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    marginTop: 8, color: colors.text, fontSize: 14,
  },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  primaryBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  authError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 10 },
  backToLogin: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 20 },
});
