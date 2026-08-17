import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function SignInScreen({ navigate, goBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSignIn = async () => {
    setLoading(true); setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    navigate('Home');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}><Ionicons name="chevron-back" size={16} color="#F4F4F5" /></TouchableOpacity>
          <View><Text style={styles.eyebrow}>TRAINER LOG</Text><Text style={styles.title}>Welcome Back</Text></View>
        </View>

        <View style={styles.fields}>
          <Field label="EMAIL ADDRESS"><TextInput value={email} onChangeText={setEmail} placeholder="trainer@pallettown.com" placeholderTextColor="#71717A" style={styles.input} autoCapitalize="none" keyboardType="email-address" /></Field>
          <Field label="PASSWORD"><View style={styles.passwordBox}><TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor="#71717A" style={styles.passwordInput} secureTextEntry={!showPassword} autoCapitalize="none" /><TouchableOpacity onPress={() => setShowPassword((value) => !value)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color="#A1A1AA" /></TouchableOpacity></View></Field>
        </View>

        <TouchableOpacity style={styles.forgot} onPress={() => navigate('ForgotPassword')}><Text style={styles.goldLink}>Forgot Password?</Text></TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.primary, (!canSubmit || loading) && styles.disabled]} disabled={!canSubmit || loading} onPress={handleSignIn}><Text style={styles.primaryText}>{loading ? 'Signing In…' : 'Sign In'}</Text></TouchableOpacity>
          {authError ? <Text style={styles.error}>{authError}</Text> : null}
          <View style={styles.inline}><Text style={styles.muted}>New trainer?</Text><TouchableOpacity onPress={() => navigate('Signup')}><Text style={styles.goldLink}>Create Account</Text></TouchableOpacity></View>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>OR CONTINUE WITH</Text><View style={styles.line} /></View>
          <View style={styles.socialRow}>
            <SocialButton icon="logo-google" label="Google" onPress={() => navigate('SocialAuthConfirm', { provider: 'Google' })} />
            <SocialButton icon="logo-apple" label="Apple" onPress={() => navigate('SocialAuthConfirm', { provider: 'Apple' })} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const Field = ({ label, children }) => <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}</View>;
const SocialButton = ({ icon, label, onPress }) => <TouchableOpacity style={styles.social} onPress={onPress}><Ionicons name={icon} size={16} color="#F4F4F5" /><Text style={styles.socialText}>{label}</Text></TouchableOpacity>;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' },
  body: { paddingHorizontal: 24, gap: 24 },
  header: { height: 64, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#A1A1AA', fontSize: 11, fontWeight: '500' },
  title: { color: '#F4F4F5', fontSize: 22, fontWeight: '600', marginTop: 2 },
  fields: { gap: 16 }, field: { gap: 8 },
  label: { color: '#A1A1AA', fontSize: 12, fontWeight: '500' },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, color: '#F4F4F5', fontSize: 14 },
  passwordBox: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  passwordInput: { flex: 1, color: '#F4F4F5', fontSize: 14 },
  forgot: { alignSelf: 'flex-end' }, goldLink: { color: '#D4AF37', fontSize: 12, fontWeight: '600' },
  actions: { gap: 20 }, primary: { height: 48, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.42 }, primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' },
  inline: { flexDirection: 'row', justifyContent: 'center', gap: 6 }, muted: { color: '#A1A1AA', fontSize: 13 },
  error: { color: '#E45D5D', fontSize: 12, textAlign: 'center', marginTop: -10 },
  socialSection: { gap: 16 }, divider: { flexDirection: 'row', alignItems: 'center', gap: 12 }, line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  or: { color: '#71717A', fontSize: 12 }, socialRow: { flexDirection: 'row', gap: 12 },
  social: { flex: 1, height: 41, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  socialText: { color: '#F4F4F5', fontSize: 13, fontWeight: '500' },
});
