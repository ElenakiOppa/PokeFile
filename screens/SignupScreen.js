import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ navigate, goBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6 && passwordsMatch && agreed;

  const handleSubmit = async () => {
    setLoading(true);
    setAuthError('');
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { display_name: name.trim() }, emailRedirectTo: 'pokefile://auth-confirmed' },
    });
    setLoading(false);
    if (error) {
      if (/already|registered|exists/i.test(error.message)) navigate('AccountAlreadyExists', { email: normalizedEmail });
      else setAuthError(error.message);
      return;
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      navigate('AccountAlreadyExists', { email: normalizedEmail });
      return;
    }
    navigate('EmailVerification', { email: normalizedEmail });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>POKEFILE</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Start tracking your collection today.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>NAME / USERNAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Elena Vasquez"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoCapitalize="words"
          />

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

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.mismatch}>Passwords don't match</Text>
          )}

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((v) => !v)}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, (!canSubmit || loading) && styles.submitBtnDisabled]}
            disabled={!canSubmit || loading}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>{loading ? 'Creating Account…' : 'Create Account'}</Text>
          </TouchableOpacity>
          {authError ? <Text style={styles.authError}>{authError}</Text> : null}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => navigate('SocialAuthConfirm', { provider: 'Apple' })}>
              <Text style={styles.socialText}> Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => navigate('SocialAuthConfirm', { provider: 'Google' })}>
              <Text style={styles.socialText}>G Google</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  back: { width: 24 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  brand: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 3, marginTop: 20 },
  title: { color: colors.text, fontSize: 32, fontWeight: '300', marginTop: 16, lineHeight: 36 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  form: { marginTop: 32 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 20 },
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
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 22 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1,
  },
  checkboxActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  checkmark: { color: colors.text, fontSize: 12, fontWeight: '700' },
  termsText: { color: colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 19 },
  termsLink: { color: colors.purple, fontWeight: '600' },
  mismatch: { color: '#e74c3c', fontSize: 12, marginTop: 6 },
  authError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 10 },
  submitBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  submitBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  submitText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textTertiary, fontSize: 10, fontWeight: '600', letterSpacing: 1, marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', marginTop: 20 },
  socialBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginHorizontal: 4,
  },
  socialText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerLink: { color: colors.purple, fontSize: 13, fontWeight: '600' },
});
