
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function EmailVerificationScreen({ navigate, goBack, params }) {
  const email = (params && params.email) || 'you@example.com';
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);
  const [mailError, setMailError] = useState('');

  const handleResend = async () => {
    setSending(true);
    setMailError('');
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setSending(false);
    if (error) {
      setMailError(error.code === 'email_address_not_authorized'
        ? 'This project is using the Supabase test mailer. Add this address to the Supabase organization or configure custom SMTP.'
        : error.message);
      return;
    }
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✉</Text>
      </View>

      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>
        We sent a verification link and a 6-digit code to{'\n'}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('VerificationCode', { email })}>
        <Text style={styles.primaryText}>Enter Code Manually</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
        <Text style={styles.resendText}>{sending ? 'Sending…' : resent ? 'Email resent ✓' : 'Resend Email'}</Text>
      </TouchableOpacity>
      {mailError ? <Text style={styles.mailError}>{mailError}</Text> : null}

      <TouchableOpacity onPress={() => navigate('AuthError', { reason: 'link', email })}>
        <Text style={styles.expiredLink}>Verification link expired?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('Signup')}>
        <Text style={styles.changeEmail}>Change email address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, alignItems: 'center' },
  back: { alignSelf: 'flex-start', marginTop: 16 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: colors.purple,
    justifyContent: 'center', alignItems: 'center', marginTop: 40,
  },
  icon: { fontSize: 28, color: colors.purple },
  title: { color: colors.text, fontSize: 24, fontWeight: '500', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  email: { color: colors.text, fontWeight: '600' },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 40, width: '100%' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  resendBtn: { marginTop: 20 },
  resendText: { color: colors.purple, fontSize: 14, fontWeight: '600' },
  changeEmail: { color: colors.textSecondary, fontSize: 13, marginTop: 16 },
  expiredLink: { color: colors.textSecondary, fontSize: 13, marginTop: 16 },
  mailError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 12 },
});
