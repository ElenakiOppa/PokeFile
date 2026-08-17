
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen({ navigate, goBack }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const matches = password.length > 0 && password === confirm;
  const canSubmit = hasLength && hasNumber && hasUpper && matches;
  const updatePassword = async () => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    navigate('PasswordResetSuccessful');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>Choose a new password for your account.</Text>

      <Text style={styles.label}>NEW PASSWORD</Text>
      <View style={styles.passwordRow}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          placeholderTextColor={colors.textTertiary}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
          <Text style={styles.showToggle}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>CONFIRM PASSWORD</Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Re-enter new password"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />

      <View style={styles.requirements}>
        <Requirement met={hasLength} label="At least 8 characters" />
        <Requirement met={hasUpper} label="One uppercase letter" />
        <Requirement met={hasNumber} label="One number" />
        <Requirement met={matches} label="Passwords match" />
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, (!canSubmit || loading) && styles.primaryBtnDisabled]}
        disabled={!canSubmit || loading}
        onPress={updatePassword}
      >
        <Text style={styles.primaryText}>{loading ? 'Updating…' : 'Reset Password'}</Text>
      </TouchableOpacity>
      {authError ? <Text style={styles.authError}>{authError}</Text> : null}
      <TouchableOpacity onPress={() => navigate('AuthError', { reason: 'reset' })}>
        <Text style={styles.invalidLink}>Reset link not working?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Requirement({ met, label }) {
  return (
    <View style={styles.reqRow}>
      <View style={[styles.reqDot, met && styles.reqDotMet]}>
        {met && <Text style={styles.reqCheck}>✓</Text>}
      </View>
      <Text style={[styles.reqLabel, met && styles.reqLabelMet]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  back: { marginTop: 16 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  title: { color: colors.text, fontSize: 26, fontWeight: '300', marginTop: 24 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 24 },
  input: {
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    marginTop: 8, color: colors.text, fontSize: 14,
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10,
    paddingHorizontal: 14, marginTop: 8, height: 50,
  },
  passwordInput: { flex: 1, color: colors.text, fontSize: 14 },
  showToggle: { color: colors.purple, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  requirements: { marginTop: 20 },
  reqRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  reqDot: {
    width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  reqDotMet: { backgroundColor: colors.purple, borderColor: colors.purple },
  reqCheck: { color: colors.text, fontSize: 9, fontWeight: '700' },
  reqLabel: { color: colors.textTertiary, fontSize: 12 },
  reqLabelMet: { color: colors.textSecondary },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 30 },
  primaryBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  invalidLink: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 18 },
  authError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 10 },
});
