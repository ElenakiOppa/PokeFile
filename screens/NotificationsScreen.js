
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import SettingsRow from '../components/SettingsRow';

const DEFAULTS = {
  wishlistPriceDrops: true,
  setRestockAlerts: true,
  newSetReleases: true,
  collectionMilestones: false,
  binderReminders: true,
};

export default function NotificationsScreen({ goBack }) {
  const [prefs, setPrefs] = useState(DEFAULTS);
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ marginTop: 12 }}>
        <SettingsRow label="Wishlist Price Drops" type="switch" switchValue={prefs.wishlistPriceDrops} onSwitchChange={() => toggle('wishlistPriceDrops')} />
        <SettingsRow label="Set Restock Alerts" type="switch" switchValue={prefs.setRestockAlerts} onSwitchChange={() => toggle('setRestockAlerts')} />
        <SettingsRow label="New Set Releases" type="switch" switchValue={prefs.newSetReleases} onSwitchChange={() => toggle('newSetReleases')} />
        <SettingsRow label="Collection Milestones" type="switch" switchValue={prefs.collectionMilestones} onSwitchChange={() => toggle('collectionMilestones')} />
        <SettingsRow label="Binder Reminders" type="switch" switchValue={prefs.binderReminders} onSwitchChange={() => toggle('binderReminders')} />
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
