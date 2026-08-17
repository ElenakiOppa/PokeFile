import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { getSetById } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';
import BinderBook from '../components/BinderBook';
import { getPrimaryFlexBinder } from '../lib/flexBinder';
import FlexBinderBook from '../components/FlexBinderBook';

const { width } = Dimensions.get('window');
const BINDER_WIDTH = Math.min(300, width - 64);
const CARD_GAP = 22;

export default function BindersScreen({ navigate, binders = [], collectionQuantities = {} }) {
  const primaryFlex = getPrimaryFlexBinder(binders);
  const regularBinders = binders.filter((binder) => binder.kind !== 'flex');
  const flexFilled = (primaryFlex?.slots || []).filter((slot) => slot?.card).length;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>BINDERS</Text>
          <Text style={type.hugeNumber}>{String(regularBinders.length).padStart(2, '0')}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigate('CoverDesigner', { mode: 'create' })}><Text style={styles.addPlus}>+</Text></TouchableOpacity>
      </View>

      <View style={styles.showcaseHeader}><Text style={styles.showcaseLabel}>YOUR SHOWCASE</Text>{primaryFlex ? <TouchableOpacity onPress={() => navigate('FlexBinderEditor', { binderId: primaryFlex.id })}><Text style={styles.editFlex}>Edit Flex Binder</Text></TouchableOpacity> : null}</View>
      {primaryFlex ? <TouchableOpacity style={styles.showcase} onPress={() => navigate('FlexBinderPage', { binderId: primaryFlex.id })} activeOpacity={0.9}>
        <View style={styles.flexBookWrap}><FlexBinderBook binder={primaryFlex} width={Math.min(284, width - 88)} /></View>
        <View style={styles.showcaseCopy}><View><Text style={styles.showcaseName}>{primaryFlex.title || primaryFlex.name}</Text><Text style={styles.showcaseMeta}>PERSONAL FLEX BINDER · {flexFilled}/9 CARDS</Text></View><Text style={styles.openFlex}>Open Flex Binder ›</Text></View>
      </TouchableOpacity> : <TouchableOpacity style={styles.createFlex} onPress={() => navigate('FlexBinderEditor')}><Text style={styles.createFlexTitle}>Create Flex Binder</Text><Text style={styles.createFlexText}>Curate one personal 3 × 3 collection showcase.</Text></TouchableOpacity>}

      <Text style={styles.libraryLabel}>BINDER LIBRARY</Text>
      {regularBinders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No binders yet</Text>
          <Text style={styles.emptyText}>Create a binder once you want to organize your sets.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          style={{ marginTop: 28 }}
          snapToInterval={BINDER_WIDTH + CARD_GAP}
          decelerationRate="fast"
        >
          {regularBinders.map((b) => {
            const set = getSetById(b.setId);
            const cards = b.kind === 'freeform' ? (b.slots || []).map((slot) => slot?.card).filter(Boolean) : getSetRequirements(set, b.tier);
            const owned = cards.filter((card) => isOwned(collectionQuantities, card)).length;
            const percent = cards.length ? Math.round((owned / cards.length) * 100) : 0;
            return (
            <TouchableOpacity
              key={b.id}
              style={styles.binderCard}
              onPress={() => navigate('BinderDetail', { binderId: b.id })}
            >
              <BinderBook set={set} binder={b} width={BINDER_WIDTH} />
              <View style={styles.binderInfoRow}>
                <View style={styles.binderInfo}><Text style={styles.binderName} numberOfLines={1}>{b.name}</Text><Text style={styles.binderSubtitle}>{b.tier.toUpperCase()} · {owned}/{cards.length} CARDS</Text></View>
                <Text style={styles.binderPercent}>{percent}%</Text>
              </View>
              <View style={styles.progressWrap}>
                <ProgressBar percent={percent} height={2} />
              </View>
            </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, marginTop: 20,
  },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  addPlus: { color: colors.text, fontSize: 22, fontWeight: '300' },
  row: { paddingHorizontal: 24, paddingBottom: 42 },
  binderCard: { width: BINDER_WIDTH, marginRight: CARD_GAP },
  binderInfoRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 },
  binderInfo: { flex: 1, paddingRight: 12 },
  binderName: { color: colors.text, fontSize: 22, fontWeight: '500' },
  binderSubtitle: { color: colors.textSecondary, fontSize: 10, fontWeight: '600', letterSpacing: 1.1, marginTop: 5 },
  binderPercent: { color: colors.text, fontSize: 20, fontWeight: '300' },
  progressWrap: { marginTop: 10, width: '100%' },
  emptyState: {
    marginTop: 28,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '500' },
  emptyText: { color: colors.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center' },
  showcaseHeader: { marginHorizontal: 24, marginTop: 34, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  showcaseLabel: { color: colors.textTertiary, fontSize: 9, fontWeight: '700', letterSpacing: 1.8 }, editFlex: { color: colors.purple, fontSize: 10, fontWeight: '700' },
  showcase: { marginHorizontal: 24 }, flexBookWrap: { alignItems: 'center', paddingTop: 4 }, showcaseCopy: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 }, showcaseName: { color: colors.text, fontSize: 20, fontWeight: '500', maxWidth: 210 }, showcaseMeta: { color: colors.textSecondary, fontSize: 8, letterSpacing: 1, marginTop: 4 }, openFlex: { color: colors.purple, fontSize: 9, fontWeight: '700', paddingBottom: 2 },
  createFlex: { marginHorizontal: 24, borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.purpleSoft, borderRadius: 16, padding: 20 }, createFlexTitle: { color: colors.text, fontSize: 17, fontWeight: '600' }, createFlexText: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
  libraryLabel: { color: colors.textTertiary, fontSize: 9, fontWeight: '700', letterSpacing: 1.8, marginHorizontal: 24, marginTop: 38 },
});
