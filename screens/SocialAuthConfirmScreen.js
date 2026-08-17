
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SocialAuthConfirmScreen({ navigate, goBack, params }) {
  const provider = (params && params.provider) || 'Apple';
  const [displayName, setDisplayName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const canSubmit = displayName.trim().length > 0 && agreed;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.providerRow}>
        <View style={styles.providerIcon}><Text style={styles.providerLetter}>{provider[0]}</Text></View>
        <Text style={styles.title}>Continue with {provider}</Text>
        <Text style={styles.subtitle}>Just need a couple more details to finish setting up your account.</Text>
      </View>

      <Text style={styles.label}>DISPLAY NAME</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="How should we call you?"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />

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
        style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
        disabled={!canSubmit}
        onPress={() => navigate('CompleteProfile')}
      >
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  back: { marginTop: 16 },
  backText: { color: colors.text, fontSize: 28, fontWeight: '300' },
  providerRow: { alignItems: 'center', marginTop: 20 },
  providerIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  providerLetter: { color: colors.text, fontSize: 22, fontWeight: '700' },
  title: { color: colors.text, fontSize: 22, fontWeight: '500', marginTop: 16, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18, paddingHorizontal: 10 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 32 },
  input: {
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    marginTop: 8, color: colors.text, fontSize: 14,
  },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 22 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1,
  },
  checkboxActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  checkmark: { color: colors.text, fontSize: 12, fontWeight: '700' },
  termsText: { color: colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 19 },
  termsLink: { color: colors.purple, fontWeight: '600' },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  primaryBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
