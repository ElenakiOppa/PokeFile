
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AccountAlreadyExistsScreen({ navigate, params }) {
  const email = (params && params.email) || 'that email';

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>@</Text>
      </View>

      <Text style={styles.title}>Account already exists</Text>
      <Text style={styles.subtitle}>An account with {email} already exists. Log in instead, or reset your password if you forgot it.</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('SignIn')}>
        <Text style={styles.primaryText}>Go to Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
        <Text style={styles.secondaryLink}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderColor: colors.purple,
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 24, color: colors.purple, fontWeight: '700' },
  title: { color: colors.text, fontSize: 22, fontWeight: '500', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 32, width: '100%' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  secondaryLink: { color: colors.textSecondary, fontSize: 13, marginTop: 20 },
});
