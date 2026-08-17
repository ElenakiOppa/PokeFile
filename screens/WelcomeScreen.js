import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const CARD_LEFT = require('../assets/figma/auth/welcome-card-left.png');
const CARD_CENTER = require('../assets/figma/auth/welcome-card-center.png');
const CARD_RIGHT = require('../assets/figma/auth/welcome-card-right.png');

export default function WelcomeScreen({ navigate }) {
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.hero}>
          <View style={styles.glow} />
          <View style={styles.cards}>
            <Image source={CARD_LEFT} style={[styles.sideCard, styles.leftCard]} resizeMode="cover" />
            <Image source={CARD_CENTER} style={styles.centerCard} resizeMode="cover" />
            <Image source={CARD_RIGHT} style={[styles.sideCard, styles.rightCard]} resizeMode="cover" />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>The Premium Pokémon Registry</Text>
            <Text style={styles.subtitle}>Track valuation, catalog pristine acquisitions, and trade on the elite index.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primary} onPress={() => navigate('Signup')}><Text style={styles.primaryText}>Create Account</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => navigate('SignIn')}><Text style={styles.secondaryText}>Sign In</Text></TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>OR CONTINUE WITH</Text><View style={styles.line} /></View>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.social} onPress={() => navigate('SocialAuthConfirm', { provider: 'Google' })}><Ionicons name="logo-google" size={16} color={colors.text} /><Text style={styles.socialText}>Google</Text></TouchableOpacity>
            <TouchableOpacity style={styles.social} onPress={() => navigate('SocialAuthConfirm', { provider: 'Apple' })}><Ionicons name="logo-apple" size={16} color={colors.text} /><Text style={styles.socialText}>Apple</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center' },
  body: { paddingHorizontal: 24, gap: 32 },
  hero: { height: 317, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', overflow: 'hidden', padding: 24 },
  glow: { position: 'absolute', top: 100, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(212,175,55,0.12)', shadowColor: '#D4AF37', shadowOpacity: 0.36, shadowRadius: 34 },
  cards: { height: 180, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sideCard: { width: 110, height: 150, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  leftCard: { transform: [{ rotate: '-12deg' }], marginRight: -36 },
  centerCard: { width: 120, height: 164, borderRadius: 8, borderWidth: 1.5, borderColor: '#D4AF37', zIndex: 2 },
  rightCard: { transform: [{ rotate: '12deg' }], marginLeft: -36 },
  heroCopy: { paddingTop: 16, gap: 8, alignItems: 'center' },
  title: { color: '#F4F4F5', fontSize: 24, fontWeight: '600', textAlign: 'center', width: 354 },
  subtitle: { color: '#A1A1AA', fontSize: 14, lineHeight: 18, textAlign: 'center', width: 354 },
  actions: { gap: 12 },
  primary: { height: 48, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#080808', fontSize: 14, fontWeight: '600' },
  secondary: { height: 48, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#F4F4F5', fontSize: 14, fontWeight: '600' },
  socialSection: { gap: 16 },
  divider: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  or: { color: '#71717A', fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12 },
  social: { flex: 1, height: 41, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  socialText: { color: '#F4F4F5', fontSize: 13, fontWeight: '500' },
});
