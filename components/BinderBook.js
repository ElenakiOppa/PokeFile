import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BinderCover from './BinderCover';
import { colors } from '../theme';

export default function BinderBook({ set, binder, width = 160 }) {
  const height = width * 1.4;
  const small = width < 100;
  const spineWidth = small ? Math.max(6, Math.round(width * 0.085)) : Math.max(18, Math.round(width * 0.085));
  return (
    <View style={[styles.wrap, { width, height }]}> 
      <View style={styles.bookShadow} />
      <View style={styles.pageBlock}>
        <View style={[styles.pageLine, { top: '28%' }]} /><View style={[styles.pageLine, { top: '52%' }]} /><View style={[styles.pageLine, { top: '76%' }]} />
      </View>
      <View style={styles.book}>
        <View style={[styles.spine, { width: spineWidth }]}><View style={styles.spineShadow} /><View style={styles.spineHighlight} />{!small ? <Text style={[styles.spineText, { width: height * 0.68 }]}>{String(binder?.name || set?.name || '').slice(0, 22).toUpperCase()}</Text> : null}</View>
        <View style={styles.cover}>
          <BinderCover set={set} styleId={binder?.coverStyle || 'classic'} name={binder?.name} compact />
          <View pointerEvents="none" style={styles.coverSheen} />
          <View pointerEvents="none" style={styles.coverInset} />
        </View>
      </View>
      {!small ? <View style={styles.formatBadge}><View style={styles.badgeDot} /><Text style={styles.formatText}>{binder?.pocketLayout || 9}-POCKET</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', paddingLeft: 5, paddingRight: 11, paddingBottom: 12 },
  bookShadow: { position: 'absolute', left: 18, right: 3, top: 15, bottom: 1, borderRadius: 16, backgroundColor: '#000', opacity: 0.75, transform: [{ rotate: '1.1deg' }] },
  pageBlock: { position: 'absolute', top: 8, bottom: 6, left: 17, right: 3, borderRadius: 13, backgroundColor: '#c7c3b9', borderWidth: 1, borderColor: '#69655f', overflow: 'hidden' },
  pageLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(55,51,47,0.25)' },
  book: { flex: 1, flexDirection: 'row', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', backgroundColor: '#09090b', shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 16, shadowOffset: { width: 5, height: 10 }, elevation: 12 },
  spine: { backgroundColor: '#08080a', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  spineShadow: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '42%', backgroundColor: 'rgba(0,0,0,0.48)' },
  spineHighlight: { position: 'absolute', top: 0, bottom: 0, right: 3, width: 2, backgroundColor: 'rgba(255,255,255,0.12)' },
  spineText: { color: 'rgba(255,255,255,0.68)', fontSize: 7, fontWeight: '700', letterSpacing: 1.4, textAlign: 'center', transform: [{ rotate: '-90deg' }] },
  cover: { flex: 1, position: 'relative', overflow: 'hidden' },
  coverSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.035)', transform: [{ translateX: -80 }, { rotate: '14deg' }] },
  coverInset: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, margin: 5 },
  formatBadge: { position: 'absolute', right: 20, bottom: 24, flexDirection: 'row', alignItems: 'center', borderRadius: 999, backgroundColor: 'rgba(5,5,7,0.82)', paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  badgeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.purple, marginRight: 5 },
  formatText: { color: colors.text, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
});
