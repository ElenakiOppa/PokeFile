import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { getSetById } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';
import { getLiveSetValuations } from '../lib/liveSetValuation';

const TIERS = ['Complete', 'Master', 'Grandmaster'];

export default function SetDetailScreen({ navigate, goBack, params = {}, collectionQuantities = {}, vaultAssets = [] }) {
  const setId = params.setId || 'pitch-black';
  const set = useMemo(() => getSetById(setId), [setId]);
  const availableTiers = TIERS.filter((item) => item !== 'Grandmaster' || set?.grandmasterAvailable);
  const requestedTier = String(params.tier || 'master').toLowerCase();
  const [tier, setTier] = useState(availableTiers.find((item) => item.toLowerCase() === requestedTier) || 'Master');
  const requirements = useMemo(() => set ? getSetRequirements(set, tier.toLowerCase()) : [], [set, tier]);
  const owned = requirements.reduce((sum, card) => sum + (isOwned(collectionQuantities, card) ? 1 : 0), 0);
  const percent = requirements.length ? (owned / requirements.length) * 100 : 0;
  const [liveValue, setLiveValue] = useState({ status: 'loading' });
  useEffect(() => {
    if (!set) return undefined;
    let active = true;
    setLiveValue({ status: 'loading' });
    getLiveSetValuations(set)
      .then((result) => { if (active) setLiveValue({ status: 'ready', ...result }); })
      .catch((error) => { if (active) setLiveValue({ status: 'error', message: error.message }); });
    return () => { active = false; };
  }, [set]);
  const tierQuote = liveValue.valuations?.[tier.toLowerCase()];
  const valueLabel = liveValue.status === 'loading'
    ? 'Updating…'
    : liveValue.status === 'error' || !tierQuote?.complete
      ? 'Unavailable'
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tierQuote.value);
  const graded = vaultAssets.filter((asset) => asset.type === 'graded' && (asset.setId === set?.id || asset.setName === set?.name)).length;
  const released = set?.releaseDate ? new Date(set.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Release date unavailable';

  if (!set) return <View style={styles.screen}><Text style={styles.missing}>Set unavailable</Text></View>;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={goBack} accessibilityLabel="Go back"><Ionicons name="chevron-back" size={18} color="#f4f4f5" /></TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow} numberOfLines={1}>{String(set.series || set.language || 'POKÉMON TCG').toUpperCase()}</Text>
            <Text style={styles.headerTitle}>Set Overview</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Search')} accessibilityLabel="Search"><Ionicons name="search" size={17} color="#f4f4f5" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoBox}><Image source={{ uri: set.logo }} style={styles.logo} resizeMode="contain" /></View>
          <Text style={styles.name} numberOfLines={2}>{set.name}</Text>
          <Text style={styles.release}>Released {released}{set.code ? ` • ${set.code}` : ''}</Text>
        </View>

        <View style={styles.tiers}>
          {availableTiers.map((item) => (
            <TouchableOpacity key={item} style={[styles.tier, tier === item && styles.tierActive]} onPress={() => setTier(item)}>
              <Text style={[styles.tierText, tier === item && styles.tierTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}><Text style={styles.progressLabel}>COMPLETION INDEX</Text><Text style={styles.progressValue}>{percent.toFixed(1)}% Completed</Text></View>
          <View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, percent)}%` }]} /></View>
          <View style={styles.counts}><Text style={styles.countText}>{owned} / {requirements.length} Cards Owned</Text><Text style={styles.countText}>{Math.max(0, requirements.length - owned)} Needed</Text></View>
        </View>

        <View style={styles.stats}>
          <Stat label={`LIVE ${tier.toUpperCase()} VALUE`} value={valueLabel} />
          <Stat label="GRADED GEMS" value={`${graded} Cards`} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primary} onPress={() => navigate('SetCardGrid', { setId: set.id, tier: tier.toLowerCase() })}><Text style={styles.primaryText}>View Binder Card Grid</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => navigate('Checklist', { setId: set.id, tier: tier.toLowerCase() })}><Text style={styles.secondaryText}>View Set Checklist</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Stat = ({ label, value }) => <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue} numberOfLines={1}>{value}</Text></View>;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808' },
  header: { height: 63, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.purple, fontSize: 11, fontWeight: '600' },
  headerTitle: { color: '#f4f4f5', fontSize: 18, lineHeight: 23, fontWeight: '700', marginTop: 2 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 12 },
  hero: { alignItems: 'center', gap: 8, paddingTop: 10, paddingBottom: 16 },
  logoBox: { width: '100%', height: 128, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(212,175,55,0.25)', backgroundColor: 'rgba(212,175,55,0.12)', alignItems: 'center', justifyContent: 'center' },
  logo: { width: '82%', height: 108 },
  name: { color: '#f4f4f5', fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  release: { color: '#a1a1aa', fontSize: 13, textAlign: 'center' },
  tiers: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  tier: { flex: 1, minHeight: 34, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  tierActive: { borderColor: colors.purple, backgroundColor: 'rgba(212,175,55,0.12)' },
  tierText: { color: '#a1a1aa', fontSize: 10, fontWeight: '600' },
  tierTextActive: { color: colors.purple },
  progressCard: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', padding: 18, gap: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  progressValue: { color: colors.purple, fontSize: 13, fontWeight: '700' },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(212,175,55,0.12)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.purple },
  counts: { flexDirection: 'row', justifyContent: 'space-between' },
  countText: { color: '#a1a1aa', fontSize: 12 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 20 },
  stat: { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', padding: 14, gap: 6 },
  statLabel: { color: '#a1a1aa', fontSize: 11 },
  statValue: { color: colors.purple, fontSize: 16, fontWeight: '700' },
  actions: { gap: 10, marginTop: 'auto', paddingTop: 20 },
  primary: { height: 46, borderRadius: 12, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#080808', fontSize: 14, fontWeight: '700' },
  secondary: { height: 46, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  missing: { color: '#f4f4f5', margin: 24 },
});
