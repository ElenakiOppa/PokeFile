import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/splash_light.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <ActivityIndicator size="small" color={colors.purple} style={styles.loader} />
      <Text style={styles.loadingText}>LOADING COLLECTION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 42 },
  logoWrap: { width: '100%', maxWidth: 310, height: 94, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%' },
  loader: { marginTop: 34 },
  loadingText: { color: colors.textTertiary, fontSize: 9, fontWeight: '700', letterSpacing: 2, marginTop: 14 },
});
