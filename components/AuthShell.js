import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import BrandLogo from './BrandLogo';

export default function AuthShell({ eyebrow = 'POKEFILE ACCOUNT', title, subtitle, goBack, children }) {
  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        {goBack ? <TouchableOpacity style={styles.back} onPress={goBack}><Ionicons name="chevron-back" size={19} color={colors.text} /></TouchableOpacity> : <View style={styles.back} />}
        <BrandLogo width={96} />
        <View style={styles.back} />
      </View>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export const authStyles = StyleSheet.create({
  form: { marginTop: 22 },
  label: { color: colors.textTertiary, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 16, marginBottom: 7 },
  input: { minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, color: colors.text, fontSize: 14 },
  primary: { minHeight: 52, borderRadius: 14, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  primaryDisabled: { opacity: 0.42 },
  primaryText: { color: colors.bg, fontSize: 14, fontWeight: '800' },
  secondary: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryText: { color: colors.text, fontSize: 14, fontWeight: '700' },
});

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  header: { height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  intro: { paddingHorizontal: 22, paddingTop: 28 },
  eyebrow: { color: colors.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '700', marginTop: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 7 },
});
