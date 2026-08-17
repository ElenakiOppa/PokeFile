
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function PasswordResetSuccessfulScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>Password reset</Text>
      <Text style={styles.subtitle}>Your password has been updated. Use it to log back in.</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('SignIn')}>
        <Text style={styles.primaryText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: colors.purple,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.purpleSoft,
  },
  icon: { fontSize: 30, color: colors.purple, fontWeight: '700' },
  title: { color: colors.text, fontSize: 24, fontWeight: '500', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 36, width: '100%' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
