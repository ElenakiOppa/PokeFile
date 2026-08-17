import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors } from '../theme';

export default function SignUpScreen({ navigate, goBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6 && agreed;

  const handleSubmit = async () => {
    setLoading(true); setAuthError('');
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password, options: { data: { display_name: name.trim() }, emailRedirectTo: 'pokefile://auth-confirmed' } });
    setLoading(false);
    if (error) { if (/already|registered|exists/i.test(error.message)) navigate('AccountAlreadyExists', { email: normalizedEmail }); else setAuthError(error.message); return; }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) { navigate('AccountAlreadyExists', { email: normalizedEmail }); return; }
    navigate('EmailVerification', { email: normalizedEmail });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}><Ionicons name="chevron-back" size={16} color="#F4F4F5" /></TouchableOpacity>
          <View><Text style={styles.eyebrow}>JOIN ELITE TRAINERS</Text><Text style={styles.title}>Create Account</Text></View>
        </View>
        <View style={styles.fields}>
          <Field label="EMAIL ADDRESS"><TextInput value={email} onChangeText={setEmail} placeholder="ash.ketchum@pallet.org" placeholderTextColor="#71717A" style={styles.input} autoCapitalize="none" keyboardType="email-address" /></Field>
          <Field label="TRAINER USERNAME"><TextInput value={name} onChangeText={setName} placeholder="AshKetchum" placeholderTextColor="#71717A" style={[styles.input, name.length > 0 && styles.activeInput]} autoCapitalize="words" /></Field>
          <Field label="PASSWORD"><View style={styles.passwordBox}><TextInput value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor="#71717A" style={styles.passwordInput} secureTextEntry={!showPassword} autoCapitalize="none" /><TouchableOpacity onPress={() => setShowPassword((value) => !value)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color="#A1A1AA" /></TouchableOpacity></View></Field>
        </View>
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((value) => !value)}>
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>{agreed ? <Ionicons name="checkmark" size={11} color={colors.purple} /> : null}</View>
          <Text style={styles.terms}>I agree to the <Text style={styles.goldUnderline}>Terms of Service</Text> and <Text style={styles.goldUnderline}>Privacy Policy</Text></Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.primary, (!canSubmit || loading) && styles.disabled]} disabled={!canSubmit || loading} onPress={handleSubmit}><Text style={styles.primaryText}>{loading ? 'Registering…' : 'Register Trainer Profile'}</Text></TouchableOpacity>
          {authError ? <Text style={styles.error}>{authError}</Text> : null}
          <View style={styles.inline}><Text style={styles.muted}>Already registered?</Text><TouchableOpacity onPress={() => navigate('SignIn')}><Text style={styles.goldLink}>Sign In</Text></TouchableOpacity></View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const Field = ({ label, children }) => <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}</View>;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' }, body: { paddingHorizontal: 24, gap: 24 },
  header: { height: 64, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#A1A1AA', fontSize: 11, fontWeight: '500' }, title: { color: '#F4F4F5', fontSize: 22, fontWeight: '600', marginTop: 2 },
  fields: { gap: 16 }, field: { gap: 8 }, label: { color: '#A1A1AA', fontSize: 12, fontWeight: '500' },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, color: '#F4F4F5', fontSize: 14 },
  activeInput: { borderColor: '#D4AF37', backgroundColor: 'rgba(255,255,255,0.02)' },
  passwordBox: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  passwordInput: { flex: 1, color: '#F4F4F5', fontSize: 14 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.12)' }, terms: { flex: 1, color: '#A1A1AA', fontSize: 12 }, goldUnderline: { color: '#D4AF37', textDecorationLine: 'underline' },
  actions: { gap: 16 }, primary: { height: 48, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.42 },
  primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' }, inline: { flexDirection: 'row', justifyContent: 'center', gap: 6 }, muted: { color: '#A1A1AA', fontSize: 13 }, goldLink: { color: '#D4AF37', fontSize: 13, fontWeight: '600' },
  error: { color: '#E45D5D', fontSize: 12, textAlign: 'center' },
});
