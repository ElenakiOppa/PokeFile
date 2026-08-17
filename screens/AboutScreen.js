
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import BrandLogo from '../components/BrandLogo';
import SettingsRow from '../components/SettingsRow';

export default function AboutScreen({ goBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ABOUT</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.brandBlock}>
        <BrandLogo width={190} />
        <Text style={styles.tagline}>Collector</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      <Text style={styles.disclaimer}>Data provided by Pokémon TCG API</Text>

      <View style={{ marginTop: 20 }}>
        <SettingsRow label="Terms of Use" type="chevron" />
        <SettingsRow label="Privacy Policy" type="chevron" />
        <SettingsRow label="Licenses" type="chevron" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  brandBlock: { alignItems: 'center', marginTop: 40 },
  tagline: { color: colors.textSecondary, fontSize: 13, marginTop: 6 },
  version: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  disclaimer: { color: colors.textTertiary, fontSize: 11, textAlign: 'center', marginTop: 20 },
});
