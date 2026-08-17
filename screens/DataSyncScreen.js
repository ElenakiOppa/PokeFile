
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import SettingsRow from '../components/SettingsRow';

export default function DataSyncScreen({ goBack, collectionQuantities = {}, binders = [] }) {
  const cardCount = Object.values(collectionQuantities).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
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
        <SettingsRow label="On-device storage" sublabel={`${cardCount} cards and ${binders.length} binders saved automatically`} value="Active" type="value" />
        <SettingsRow label="Cloud Sync" sublabel="Back up and share progress across your devices" value="Not configured" type="value" />
      </View>
      <Text style={styles.explanation}>Data Sync means storing your collection in your PokeFile account so it can be restored after reinstalling the app or opened on another device. Your collection is currently saved only on this device; signing in does not upload it yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  explanation: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 26 },
});
