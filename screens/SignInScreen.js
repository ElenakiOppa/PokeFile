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

export default function SignInScreen({ navigate, goBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const canSubmit = email.trim().length > 0 && password.length > 0;
  const handleSignIn = async () => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    navigate('Home');
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to pick up where you left off.</Text>

        <View style={styles.form}>
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

          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>PASSWORD</Text>
            <TouchableOpacity hitSlop={10} onPress={() => navigate('ForgotPassword')}>
              <Text style={styles.forgotLink}>Forgot?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Text style={styles.showToggle}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, (!canSubmit || loading) && styles.submitBtnDisabled]}
            disabled={!canSubmit || loading}
            onPress={handleSignIn}
          >
            <Text style={styles.submitText}>{loading ? 'Logging In…' : 'Log In'}</Text>
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigate('Signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
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
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  forgotLink: { color: colors.purple, fontSize: 12, fontWeight: '600' },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10,
    paddingHorizontal: 14, marginTop: 8, height: 50,
  },
  passwordInput: { flex: 1, color: colors.text, fontSize: 14 },
  showToggle: { color: colors.purple, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  submitBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  submitBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  submitText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  authError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 10 },
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
