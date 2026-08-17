import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import HolographicCard from './HolographicCard';

function MissingArtwork({ card }) {
  return <View style={[styles.card, styles.missingArtwork]}><Text style={styles.missingMark}>◇</Text><Text style={styles.missingName} numberOfLines={2}>{card?.name || 'Card artwork'}</Text><Text style={styles.missingLabel}>ARTWORK UNAVAILABLE</Text></View>;
}

export default function FlexBinderPresentation({ data, onCardPress, exportMode = false, failedSlots = new Set(), onExportSlotResolved, onExportLayout }) {
  const filled = (data?.cards || []).filter(Boolean).length;
  return (
    <View style={[styles.page, exportMode && styles.exportPage]} onLayout={exportMode ? onExportLayout : undefined}>
      <View style={styles.brandRow}><Text style={styles.brand}>POKÉFILE</Text><Text style={styles.mark}>PF</Text></View>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>COLLECTION SHOWCASE</Text>
        <Text style={styles.title}>{data?.title || 'My Flex'}</Text>
        {data?.description ? <Text style={styles.description}>{data.description}</Text> : null}
      </View>
      <View style={styles.binderPage}>
        {(data?.cards || Array(9).fill(null)).map((card, index) => {
          const failed = Boolean(card && (failedSlots.has(index) || !card.image));
          const cardView = failed
            ? <MissingArtwork card={card} />
            : card
              ? <HolographicCard uri={card.image} style={styles.card} interactive={!exportMode} onImageLoad={exportMode ? () => onExportSlotResolved?.(index, 'loaded') : undefined} onImageError={exportMode ? () => onExportSlotResolved?.(index, 'failed') : undefined} />
              : <View style={[styles.card, styles.empty]}><Text style={styles.emptyNumber}>{String(index + 1).padStart(2, '0')}</Text></View>;
          return onCardPress && card ? <TouchableOpacity key={`${card.collectibleKey}-${index}`} style={styles.cell} onPress={() => onCardPress(card)} activeOpacity={0.9}>{cardView}</TouchableOpacity> : <View key={card?.collectibleKey || `empty-${index}`} style={styles.cell}>{cardView}</View>;
        })}
      </View>
      <View style={styles.footer}><Text style={styles.collector}>{data?.collectorName || 'POKÉFILE COLLECTOR'}</Text><Text style={styles.summary}>{filled} OF 9 · FLEX BINDER</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.bg, paddingHorizontal: 22, paddingVertical: 24 },
  exportPage: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 62, paddingTop: 80, paddingBottom: 72 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.text, fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  mark: { color: colors.textSecondary, fontSize: 10, letterSpacing: 1, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 18, padding: 9 },
  heading: { marginTop: 32, marginBottom: 26 }, eyebrow: { color: colors.purple, fontSize: 9, fontWeight: '700', letterSpacing: 2.2 },
  title: { color: colors.text, fontSize: 36, fontWeight: '300', marginTop: 9 },
  description: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 10, maxWidth: 310 },
  binderPage: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18 },
  cell: { width: '31.3%', aspectRatio: 0.716 }, card: { width: '100%', height: '100%', backgroundColor: colors.card },
  empty: { borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, emptyNumber: { color: colors.textTertiary, fontSize: 9 },
  missingArtwork: { borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', padding: 8 },
  missingMark: { color: colors.purple, fontSize: 18 }, missingName: { color: colors.text, fontSize: 8, textAlign: 'center', marginTop: 7 }, missingLabel: { color: colors.textTertiary, fontSize: 5, letterSpacing: 0.8, marginTop: 5 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }, collector: { color: colors.text, fontSize: 9, fontWeight: '700', letterSpacing: 1.4 }, summary: { color: colors.textTertiary, fontSize: 9, letterSpacing: 1 },
});
