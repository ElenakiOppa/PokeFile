
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

const REASONS = {
  link: {
    title: 'This link has expired',
    subtitle: 'Verification links are only valid for a short time. Request a new one to continue.',
    buttonLabel: 'Request New Link',
    target: 'EmailVerification',
  },
  otp: {
    title: 'This code has expired',
    subtitle: 'Verification codes expire after a few minutes. Request a new one to continue.',
    buttonLabel: 'Request New Code',
    target: 'EmailVerification',
  },
  reset: {
    title: 'This reset link is invalid',
    subtitle: 'It may have already been used or expired. Request a new password reset link.',
    buttonLabel: 'Request New Link',
    target: 'ForgotPassword',
  },
};

export default function AuthErrorScreen({ navigate, goBack, params }) {
  const reasonKey = (params && params.reason) || 'link';
  const reason = REASONS[reasonKey] || REASONS.link;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>!</Text>
      </View>

      <Text style={styles.title}>{reason.title}</Text>
      <Text style={styles.subtitle}>{reason.subtitle}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate(reason.target, { email: params?.email })}>
        <Text style={styles.primaryText}>{reason.buttonLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('SignIn')}>
        <Text style={styles.backToLogin}>Back to Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderColor: '#e74c3c',
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 26, color: '#e74c3c', fontWeight: '700' },
  title: { color: colors.text, fontSize: 22, fontWeight: '500', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 32, width: '100%' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  backToLogin: { color: colors.textSecondary, fontSize: 13, marginTop: 20 },
});
