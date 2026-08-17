
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function PasswordResetEmailSentScreen({ navigate, params }) {
  const email = (params && params.email) || 'you@example.com';
  const [resent, setResent] = useState(false);
  const [mailError, setMailError] = useState('');

  const handleResend = async () => {
    setMailError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'pokefile://reset-password' });
    if (error) { setMailError(error.message); return; }
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✉</Text>
      </View>

      <Text style={styles.title}>Check your inbox</Text>
      <Text style={styles.subtitle}>
        We sent password reset instructions to{'\n'}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
        <Text style={styles.resendText}>{resent ? 'Email resent ✓' : 'Resend'}</Text>
      </TouchableOpacity>
      {mailError ? <Text style={styles.mailError}>{mailError}</Text> : null}

      <TouchableOpacity onPress={() => navigate('SignIn')}>
        <Text style={styles.backToLogin}>Back to Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', paddingHorizontal: 24, justifyContent: 'center' },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: colors.purple,
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 28, color: colors.purple },
  title: { color: colors.text, fontSize: 24, fontWeight: '500', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  email: { color: colors.text, fontWeight: '600' },
  resendBtn: { marginTop: 36 },
  resendText: { color: colors.purple, fontSize: 14, fontWeight: '600' },
  backToLogin: { color: colors.textSecondary, fontSize: 13, marginTop: 16 },
  mailError: { color: '#e74c3c', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 12 },
});
