
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import SettingsRow from '../components/SettingsRow';

export default function DataSyncScreen({ goBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>DATA & SYNC</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ marginTop: 12 }}>
        <SettingsRow label="Cloud Sync" sublabel="Synced just now" type="value" />
        <SettingsRow label="Export Collection" sublabel="Export to file" type="chevron" />
        <SettingsRow label="Import Collection" sublabel="Import from file" type="chevron" />
        <SettingsRow label="Refresh Card Data" sublabel="Update prices & images" type="chevron" />
        <SettingsRow label="Clear Cache" sublabel="Frees up space" type="chevron" danger />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
});
