
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SplashScreen({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('Home'), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>POKÉ HAUS</Text>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  brand: { color: colors.text, fontSize: 20, fontWeight: '600', letterSpacing: 5 },
  underline: { width: 40, height: 2, backgroundColor: colors.purple, marginTop: 14, borderRadius: 1 },
});
