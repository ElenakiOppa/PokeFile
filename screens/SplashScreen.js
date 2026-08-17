import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.markStage}>
          <View style={styles.glow} />
          <View style={styles.mark}>
            <View style={styles.markBand} />
            <View style={styles.markRing} />
          </View>
        </View>
        <View style={styles.wordmark}>
          <Text style={styles.name}>POKÉFILE</Text>
          <Text style={styles.tagline}>PREMIUM COLLECTOR INDEX</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator color={colors.purple} size="small" style={styles.loader} />
        <Text style={styles.version}>VERSION 1.0.0 • SECURED INDEX</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  markStage: { width: 152, height: 152, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute', width: 1, height: 1, borderRadius: 1,
    backgroundColor: colors.purple, shadowColor: colors.purple,
    shadowOpacity: 0.32, shadowRadius: 54, shadowOffset: { width: 0, height: 0 },
  },
  mark: {
    width: 72, height: 72, borderRadius: 36, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.purple,
  },
  markBand: { position: 'absolute', left: 0, right: 0, top: 32, height: 8, backgroundColor: '#080808' },
  markRing: { width: 24, height: 24, borderRadius: 12, borderWidth: 4, borderColor: '#080808', backgroundColor: colors.purple },
  wordmark: { alignItems: 'center', gap: 8 },
  name: { color: '#f4f4f5', fontFamily: 'Manrope_700Bold', fontSize: 36, lineHeight: 44, letterSpacing: -0.8 },
  tagline: { color: colors.purple, fontFamily: 'Manrope_400Regular', fontSize: 11, lineHeight: 16, letterSpacing: 0.45 },
  footer: { minHeight: 58, paddingBottom: 16, alignItems: 'center', justifyContent: 'flex-end' },
  loader: { marginBottom: 9, transform: [{ scale: 0.72 }] },
  version: { color: '#71717a', fontFamily: 'Manrope_400Regular', fontSize: 10, lineHeight: 14 },
});
