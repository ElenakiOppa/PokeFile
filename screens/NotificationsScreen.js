import React from 'react';
import { View } from 'react-native';
import { useAppContext } from '../AppContext';
import { RegistrySettingsHeader, RegistryToggle, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

const DEFAULTS = { wishlistPriceDrops: true, setRestockAlerts: true, newSetReleases: true, collectionMilestones: false, binderReminders: true };
const ROWS = [
  ['wishlistPriceDrops','Price Alerts','Notify instantly on major card valuation shifts'],
  ['binderReminders','Trade Requests','When another collector proposes a binder exchange'],
  ['setRestockAlerts','Wishlist Matches','Alert when a tracked card becomes available'],
  ['newSetReleases','Set Releases','Official Pokémon expansion releases and pre-order dates'],
  ['collectionMilestones','Community Updates','Market insights, newsletters, and Pokéfile updates'],
];
export default function NotificationsScreen({ goBack }) {
  const { preferences, updatePreferences } = useAppContext();
  const prefs = { ...DEFAULTS, ...preferences.notifications };
  const toggle = key => updatePreferences({ notifications: { ...prefs, [key]: !prefs[key] } });
  return <View style={shared.page}><RegistrySettingsHeader title="Notifications" eyebrow="Alerts & Updates" goBack={goBack} /><View style={shared.content}>{ROWS.map(([key,title,description]) => <RegistryToggle key={key} title={title} description={description} value={prefs[key]} onChange={() => toggle(key)} />)}</View></View>;
}
