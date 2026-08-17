import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { getSetById } from '../data';
import { getMissingRequirements, getSetRequirements } from '../lib/collectibles';

export default function MissingListScreen({ goBack, navigate, params = {}, binders = [], collectionQuantities = {}, addRequirementsToWishlist = () => {} }) {
  const binder = binders.find((item) => item.id === params.binderId);
  const set = getSetById(binder?.setId || params.setId);
  const requirements = useMemo(() => getSetRequirements(set, binder?.tier || params.tier), [set, binder?.tier, params.tier]);
  const missing = useMemo(() => getMissingRequirements(requirements, collectionQuantities), [requirements, collectionQuantities]);
  const [added, setAdded] = useState(false);
  const addAll = () => {
    addRequirementsToWishlist(missing);
    setAdded(true);
  };

  return (
    <View style={styles.container}>
      <TopBar variant="back" onBackPress={goBack} onSearchPress={() => navigate('Search')} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART MISSING LIST</Text>
        <Text style={styles.title}>{set?.name || 'Binder'}</Text>
        <Text style={styles.subtitle}>{missing.length} of {requirements.length} exact requirements missing</Text>
        <TouchableOpacity style={[styles.addAll, (!missing.length || added) && styles.addAllDone]} disabled={!missing.length} onPress={addAll}>
          <Text style={styles.addAllText}>{added ? 'Added to wishlist' : 'Add Missing to Wishlist'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={missing}
        keyExtractor={(item) => item.collectibleKey}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Binder complete</Text><Text style={styles.emptyText}>You own every exact requirement in this binder.</Text></View>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => navigate('CardDetail', { cardId: item.id })}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>#{item.number} · {item.finish}</Text>
              <Text style={styles.identity} numberOfLines={1}>{item.collectibleKey}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 12 },
  eyebrow: { color: colors.purple, fontSize: 10, fontWeight: '700', letterSpacing: 1.7 },
  title: { color: colors.text, fontSize: 32, fontWeight: '400', marginTop: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 5 },
  addAll: { marginTop: 18, alignSelf: 'flex-start', borderRadius: 999, backgroundColor: colors.purple, paddingHorizontal: 18, paddingVertical: 11 },
  addAllDone: { opacity: 0.55 },
  addAllText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  image: { width: 56, height: 78, borderRadius: 7, backgroundColor: colors.card },
  info: { flex: 1, marginLeft: 14 },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  identity: { color: colors.textTertiary, fontSize: 9, marginTop: 4 },
  chevron: { color: colors.textSecondary, fontSize: 24 },
  empty: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 20 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, fontSize: 12, marginTop: 6, textAlign: 'center' },
});
