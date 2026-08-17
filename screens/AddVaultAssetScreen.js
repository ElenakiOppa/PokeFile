import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { VaultHeader } from '../components/VaultUi';

const OPTIONS = [
  {
    route: 'AddGradedAsset',
    icon: 'diamond-outline',
    eyebrow: 'CERTIFIED COLLECTIBLE',
    title: 'Add a graded card',
    detail: 'Select the exact card, grading company, grade, certificate and acquisition details.',
  },
  {
    route: 'AddSealedAsset',
    icon: 'cube-outline',
    eyebrow: 'SEALED INVENTORY',
    title: 'Add a sealed product',
    detail: 'Choose a provider-backed product or record a sealed item manually.',
  },
];

export default function AddVaultAssetScreen({ navigate, goBack }) {
  return (
    <View style={s.screen}>
      <VaultHeader title="Add to Vault" goBack={goBack} />
      <View style={s.content}>
        <Text style={s.kicker}>NEW VAULT ENTRY</Text>
        <Text style={s.title}>What are you adding?</Text>
        <Text style={s.subtitle}>Choose the asset type so Pokéfile can store the correct details and valuation history.</Text>
        <View style={s.options}>
          {OPTIONS.map((option) => (
            <TouchableOpacity key={option.route} style={s.option} onPress={() => navigate(option.route)} activeOpacity={0.76}>
              <View style={s.icon}><Ionicons name={option.icon} size={30} color={colors.purple} /></View>
              <View style={s.copy}>
                <Text style={s.eyebrow}>{option.eyebrow}</Text>
                <Text style={s.optionTitle}>{option.title}</Text>
                <Text style={s.detail}>{option.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  kicker: { color: colors.purple, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 32, lineHeight: 38, fontWeight: '800', marginTop: 10 },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 10, maxWidth: 350 },
  options: { gap: 14, marginTop: 30 },
  option: { minHeight: 150, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 18, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 58, height: 58, borderRadius: 17, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  copy: { flex: 1, minWidth: 0 },
  eyebrow: { color: colors.purple, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  optionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 6 },
  detail: { color: colors.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
});
