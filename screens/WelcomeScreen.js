import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import BrandLogo from '../components/BrandLogo';

export default function WelcomeScreen({ navigate }) {
  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.logoRing}><BrandLogo width={164} /></View>
        <Text style={styles.eyebrow}>PRIVATE COLLECTOR REGISTRY</Text>
        <Text style={styles.title}>Your collection.{`\n`}Indexed.</Text>
        <Text style={styles.subtitle}>Track cards, complete sets, build binders and understand the value of everything you own.</Text>
      </View>
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.primary} onPress={() => navigate('Signup')}><Text style={styles.primaryText}>Create Account</Text></TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => navigate('SignIn')}><Text style={styles.secondaryText}>Log In</Text></TouchableOpacity>
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>OR CONTINUE WITH</Text><View style={styles.line} /></View>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.social} onPress={() => navigate('SocialAuthConfirm', { provider: 'Apple' })}><Ionicons name="logo-apple" size={17} color={colors.text} /><Text style={styles.socialText}>Apple</Text></TouchableOpacity>
          <TouchableOpacity style={styles.social} onPress={() => navigate('SocialAuthConfirm', { provider: 'Google' })}><Ionicons name="logo-google" size={16} color={colors.text} /><Text style={styles.socialText}>Google</Text></TouchableOpacity>
        </View>
        <Text style={styles.terms}>By continuing, you agree to Pokéfile’s Terms and Privacy Policy.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'space-between' },
  hero: { flex: 1, paddingHorizontal: 24, paddingTop: 54, justifyContent: 'center' },
  logoRing: { alignSelf: 'flex-start', paddingVertical: 16 },
  eyebrow: { color: colors.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 22 },
  title: { color: colors.text, fontSize: 43, lineHeight: 47, fontWeight: '700', marginTop: 10 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, maxWidth: 330, marginTop: 14 },
  sheet: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 30 },
  primary: { minHeight: 52, borderRadius: 14, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.bg, fontSize: 14, fontWeight: '800' },
  secondary: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textTertiary, fontSize: 8, fontWeight: '700', letterSpacing: 1, marginHorizontal: 11 },
  socialRow: { flexDirection: 'row', gap: 9 },
  social: { flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  socialText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  terms: { color: colors.textTertiary, fontSize: 9, textAlign: 'center', marginTop: 16 },
});
