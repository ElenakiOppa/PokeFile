
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import BrandLogo from '../components/BrandLogo';

export default function WelcomeScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <BrandLogo width={190} />
      </View>

      <View style={styles.content}>
        <Text style={styles.brand}>POKEFILE</Text>
        <Text style={styles.tagline}>Track, organize, and complete your Pokémon TCG collection.</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('Signup')}>
          <Text style={styles.primaryText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigate('SignIn')}>
          <Text style={styles.secondaryText}>Log In</Text>
        </TouchableOpacity>

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

        <Text style={styles.terms}>
          By continuing, you agree to our <Text style={styles.termsLink}>Terms</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { height: '27%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  brand: { color: colors.text, fontSize: 22, fontWeight: '600', letterSpacing: 4, textAlign: 'center' },
  tagline: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20, paddingHorizontal: 10 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  secondaryBtn: {
    borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 12,
    borderWidth: 1, borderColor: colors.borderStrong,
  },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textTertiary, fontSize: 10, fontWeight: '600', letterSpacing: 1, marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', marginTop: 20 },
  socialBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginHorizontal: 4,
  },
  socialText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  terms: { color: colors.textTertiary, fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
  termsLink: { color: colors.textSecondary, fontWeight: '600' },
});
