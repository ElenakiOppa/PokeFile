import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { getCardById, getSetById, rarityRank } from '../data';
import { getGeneratedBinderSlots, isOwned, paginateBinderSlots } from '../lib/collectibles';

const { width } = Dimensions.get('window');
const GAP = 10;

export default function BinderDetailScreen({ navigate, updateCurrentParams = () => {}, params = {}, collectionQuantities = {}, setCardQuantity = () => {}, setCardsCollected = () => {}, binders = [], removeCardFromBinder = () => {} }) {
  const [currentPage, setCurrentPage] = useState(() => Math.max(0, Number(params.page) || 0));
  const [showMissing, setShowMissing] = useState(false);
  const binderId = params.binderId || params.setId || 'me5';
  const savedBinder = useMemo(() => binders.find((item) => item.id === binderId), [binders, binderId]);
  const binder = useMemo(() => getSetById(savedBinder?.setId || binderId), [savedBinder, binderId]);
  const tier = String(params.tier || savedBinder?.tier || 'master').toLowerCase();
  const pocketLayout = Number(savedBinder?.pocketLayout || 9);
  const pageCapacity = pocketLayout === 24 ? 12 : pocketLayout;
  const compactCards = true;
  const columns = pocketLayout === 9 ? 3 : 4;
  // Screen width minus page margins, borders, and the grid's horizontal padding.
  const pageContentWidth = width - 32 - 2 - 16;
  const cardWidth = (pageContentWidth - GAP * (columns - 1)) / columns;
  const isFreeform = savedBinder?.kind === 'freeform';
  const requirementSlots = useMemo(() => getGeneratedBinderSlots(binder, tier), [binder, tier]);
  const slots = useMemo(() => {
    if (isFreeform) return (savedBinder?.slots || []).map((slot, position) => {
      if (!slot?.collectibleKey) return { id: `empty:${position}`, position, requirement: null };
      return { ...slot, position, requirement: slot.card || getCardById(slot.collectibleKey, null) };
    });
    const list = [...requirementSlots];
    const sortBy = savedBinder?.sortBy || 'Set Number';
    const cardOf = (slot) => slot.requirement;
    if (sortBy === 'Name' || sortBy === 'Name A–Z') return list.sort((a, b) => String(cardOf(a).name).localeCompare(String(cardOf(b).name)));
    if (sortBy === 'Rarity') return list.sort((a, b) => rarityRank(cardOf(a).rarity) - rarityRank(cardOf(b).rarity) || Number(cardOf(a).sourceOrder || 0) - Number(cardOf(b).sourceOrder || 0));
    if (sortBy === 'Price: High to Low') return list.sort((a, b) => Number(cardOf(b).value || 0) - Number(cardOf(a).value || 0));
    if (sortBy === 'Price: Low to High') return list.sort((a, b) => Number(cardOf(a).value || 0) - Number(cardOf(b).value || 0));
    // Ownership changes must never move a generated collectible to another
    // physical pocket. Legacy "Owned First" therefore falls back to the
    // canonical source order for generated binders.
    if (sortBy === 'Recently Added' || sortBy === 'Owned First') return list;
    return list;
  }, [isFreeform, savedBinder?.slots, savedBinder?.sortBy, requirementSlots, collectionQuantities]);
  const total = slots.filter((slot) => slot.requirement).length;
  const ownedCount = slots.reduce(
    (sum, slot) => sum + (slot.requirement && isOwned(collectionQuantities, slot.requirement) ? 1 : 0),
    0
  );
  const percent = total ? Math.round((ownedCount / total) * 100) : 0;
  const pages = useMemo(() => {
    return paginateBinderSlots(slots, pageCapacity);
  }, [slots, pageCapacity]);
  useEffect(() => {
    setCurrentPage((page) => {
      const nextPage = Math.min(page, Math.max(0, pages.length - 1));
      if (nextPage !== page) updateCurrentParams({ page: nextPage });
      return nextPage;
    });
  }, [pages.length]);
  const changePage = (nextPage) => {
    setCurrentPage(nextPage);
    updateCurrentParams({ page: nextPage });
  };
  const pageSlots = pages[currentPage] || [];
  const pageCards = pageSlots.map((slot) => slot.requirement).filter(Boolean);
  const allPageCardsCollected = pageCards.length > 0 && pageCards.every((card) => isOwned(collectionQuantities, card));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{String(savedBinder?.name || binder.name).toUpperCase()}</Text>
        <TouchableOpacity onPress={() => navigate('BinderSettings', { binderId })}>
          <Text style={styles.filterIcon}>≡</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>{tier.toUpperCase()} SET · {pocketLayout}-POCKET BINDER</Text>

      <View style={styles.progressRow}>
        <Text style={styles.percentText}>
          <Text style={styles.percentBold}>{percent}%</Text> complete
        </Text>
        <Text style={styles.countText}>{ownedCount} / {total}</Text>
      </View>
      <View style={{ marginTop: 8 }}>
        <ProgressBar percent={percent} />
      </View>

      {!isFreeform ? <View style={styles.modeRow}>
        <TouchableOpacity style={[styles.modeButton, showMissing && styles.modeButtonActive]} onPress={() => setShowMissing((value) => !value)}>
          <Text style={styles.modeButtonText}>{showMissing ? 'Showing Missing' : 'Show Missing'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missingLink} onPress={() => navigate('MissingList', { binderId, setId: binder.id, tier })}>
          <Text style={styles.missingLinkText}>Missing list · {total - ownedCount}</Text>
        </TouchableOpacity>
      </View> : null}

      <View style={styles.pageNavigation}>
        <TouchableOpacity
          style={[styles.pageArrow, currentPage === 0 && styles.pageArrowDisabled]}
          disabled={currentPage === 0}
          onPress={() => changePage(Math.max(0, currentPage - 1))}
          accessibilityLabel="Previous binder page"
        ><Text style={styles.pageArrowText}>‹</Text></TouchableOpacity>
        <View style={styles.pagePosition}><Text style={styles.pagePositionText}>PAGE {currentPage + 1} OF {Math.max(1, pages.length)}</Text><Text style={styles.openViewText}>{pocketLayout === 24 ? '3 × 4' : pocketLayout === 16 ? '4 × 4' : '3 × 3'} LAYOUT</Text></View>
        <TouchableOpacity
          style={[styles.pageArrow, currentPage >= pages.length - 1 && styles.pageArrowDisabled]}
          disabled={currentPage >= pages.length - 1}
          onPress={() => changePage(Math.min(pages.length - 1, currentPage + 1))}
          accessibilityLabel="Next binder page"
        ><Text style={styles.pageArrowText}>›</Text></TouchableOpacity>
      </View>

      <View style={styles.page}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageLabel}>BINDER PAGE</Text>
            <Text style={styles.pageCount}>{pageCards.length} / {pageCapacity} cards</Text>
          </View>
          <TouchableOpacity
            style={[styles.collectPageButton, allPageCardsCollected && styles.collectPageButtonActive]}
            onPress={() => setCardsCollected(pageCards.map((card) => card.id), !allPageCardsCollected)}
            disabled={pageCards.length === 0}
            accessibilityRole="button"
            accessibilityLabel={allPageCardsCollected ? 'Remove all cards on this binder page from collection' : 'Add all cards on this binder page to collection'}
          >
            <Text style={styles.collectPageButtonText}>{allPageCardsCollected ? '✓ Page collected' : '+ Collect page'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
        {pageSlots.map((slot, localIndex) => {
          const card = slot.requirement;
          const owned = card ? isOwned(collectionQuantities, card) : false;
          const slotIndex = currentPage * pageCapacity + localIndex;
          if (!card) return <View key={slot.id} style={[styles.cardTile, styles.emptyPocket, { width: cardWidth, minHeight: cardWidth * 1.65 }]}><Text style={styles.emptyPocketNumber}>{slotIndex + 1}</Text></View>;
          return (
          <View key={slot.id || card.id} style={[styles.cardTile, styles.pocket, showMissing && owned && styles.ownedMuted, { width: cardWidth }]}>
            <TouchableOpacity onPress={() => navigate('CardDetail', { cardId: card.id })} activeOpacity={0.8}>
              <Image
                source={{ uri: card.image }}
                style={[styles.cardImage, showMissing && !owned && styles.missingArtwork, { height: cardWidth * 1.4 }]}
                resizeMode="contain"
              />
              {!compactCards ? <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text> : null}
            </TouchableOpacity>
            {compactCards ? (
              <TouchableOpacity
                style={[styles.compactCollect, owned && styles.compactCollectActive]}
                onPress={() => setCardQuantity(card, owned ? 0 : 1)}
                accessibilityRole="button"
                accessibilityLabel={`${collectionQuantities[card.id] > 0 ? 'Remove' : 'Add'} ${card.name} ${card.variant} ${collectionQuantities[card.id] > 0 ? 'from' : 'to'} collection`}
              ><Text style={styles.compactCollectText}>{owned ? '✓' : '+'}</Text></TouchableOpacity>
            ) : null}
            {showMissing && !owned ? <View style={styles.missingDetails}>
              <Text style={styles.missingLabel}>MISSING</Text>
              <Text style={styles.missingName} numberOfLines={1}>{card.name}</Text>
              {card.missingVariantImage ? <Text style={styles.imageNotice}>Finish artwork unavailable</Text> : null}
            </View> : null}
            <Text style={styles.cardNumber}>{card.number}</Text>
            <View style={[styles.cardMetaRow, compactCards && styles.compactMetaRow]}>
              <View style={styles.cardMetaText}>
                <Text style={styles.cardVariant} numberOfLines={1}>{card.variant}</Text>
                <Text style={styles.cardValue}>€{Number(card.value || 0).toFixed(2)}</Text>
              </View>
              {!compactCards ? <TouchableOpacity
                style={[styles.addChip, collectionQuantities[card.id] > 0 && styles.addChipActive]}
                onPress={() => setCardQuantity(card.id, collectionQuantities[card.id] > 0 ? 0 : 1)}
                accessibilityRole="button"
                accessibilityLabel={`${collectionQuantities[card.id] > 0 ? 'Remove' : 'Add'} ${card.name} ${card.variant} ${collectionQuantities[card.id] > 0 ? 'from' : 'to'} collection`}
              >
                <Text style={styles.addChipText}>{collectionQuantities[card.id] > 0 ? '✓ 1' : '+ Collect'}</Text>
              </TouchableOpacity> : null}
            </View>
            {isFreeform ? <TouchableOpacity style={styles.removeSlot} onPress={() => removeCardFromBinder(binderId, slotIndex)}><Text style={styles.removeSlotText}>Remove</Text></TouchableOpacity> : null}
          </View>
        );})}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 24,
  },
  title: { color: colors.text, fontSize: 32, fontWeight: '400', letterSpacing: 1 },
  filterIcon: { color: colors.text, fontSize: 22 },
  subtitle: { color: colors.purple, fontSize: 13, fontWeight: '600', letterSpacing: 2, paddingHorizontal: 24, marginTop: 6 },
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 20,
  },
  percentText: { color: colors.textSecondary, fontSize: 14 },
  percentBold: { color: colors.text, fontWeight: '700' },
  countText: { color: colors.textSecondary, fontSize: 14 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 15 },
  modeButton: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  modeButtonActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  modeButtonText: { color: colors.text, fontSize: 10, fontWeight: '700' },
  missingLink: { paddingVertical: 8 }, missingLinkText: { color: colors.purple, fontSize: 11, fontWeight: '600' },
  pageNavigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 22 },
  pageArrow: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  pageArrowDisabled: { opacity: 0.25, borderColor: colors.border },
  pageArrowText: { color: colors.text, fontSize: 30, lineHeight: 32, fontWeight: '300' },
  pagePosition: { alignItems: 'center' },
  pagePositionText: { color: colors.text, fontSize: 12, fontWeight: '700', letterSpacing: 1.4 },
  openViewText: { color: colors.textTertiary, fontSize: 9, letterSpacing: 1, marginTop: 4 },
  page: { marginHorizontal: 16, marginTop: 14, marginBottom: 40, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingTop: 12, overflow: 'hidden' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10 },
  pageLabel: { color: colors.text, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  pageCount: { color: colors.textTertiary, fontSize: 10, marginTop: 3 },
  collectPageButton: { borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.purpleSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  collectPageButtonActive: { backgroundColor: colors.purple },
  collectPageButtonText: { color: colors.text, fontSize: 10, fontWeight: '700' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: GAP,
    paddingHorizontal: 8, paddingBottom: 12,
  },
  cardTile: { marginBottom: 16, position: 'relative' },
  pocket: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 3, backgroundColor: colors.card },
  emptyPocket: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  emptyPocketNumber: { color: colors.textTertiary, fontSize: 10 },
  ownedMuted: { opacity: 0.32 },
  missingArtwork: { opacity: 0.42 },
  missingLabel: { color: colors.purple, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  missingDetails: { minHeight: 29 }, missingName: { color: colors.text, fontSize: 8, fontWeight: '600', marginTop: 2 },
  imageNotice: { color: colors.textTertiary, fontSize: 6, marginTop: 1 },
  cardImage: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '500', marginTop: 6 },
  cardNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 1 },
  cardVariant: { color: colors.textSecondary, fontSize: 9, marginTop: 2 },
  cardValue: { color: colors.purple, fontSize: 10, fontWeight: '600', marginTop: 3 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2 },
  compactMetaRow: { display: 'flex', alignItems: 'flex-start', minHeight: 32 },
  cardMetaText: { flex: 1, minWidth: 0 },
  compactCollect: { position: 'absolute', top: 5, right: 5, width: 27, height: 27, borderRadius: 14, borderWidth: 2, borderColor: colors.text, backgroundColor: 'rgba(0,0,0,0.62)', alignItems: 'center', justifyContent: 'center' },
  compactCollectActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  compactCollectText: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 17 },
  addChip: { backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 5 },
  addChipActive: { backgroundColor: colors.purple },
  addChipText: { color: colors.text, fontSize: 9, fontWeight: '600' },
  removeSlot: { marginTop: 6, alignSelf: 'flex-start' }, removeSlotText: { color: colors.textTertiary, fontSize: 8 },
});
