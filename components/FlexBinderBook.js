import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function FlexBinderBook({ binder, width = 280 }) {
  const height = width * 1.36;
  const title = String(binder?.title || binder?.name || 'My Flex').trim();
  const filled = (binder?.slots || []).filter((slot) => slot?.card).length;
  return (
    <View style={[styles.wrap, { width, height }]}>
      <View style={styles.shadow} />
      <View style={styles.pages}><View style={[styles.pageLine, { top: '32%' }]} /><View style={[styles.pageLine, { top: '66%' }]} /></View>
      <View style={styles.book}>
        <View style={styles.spine}><View style={styles.spineShade} /><View style={styles.spineEdge} /><Text style={[styles.spineTitle, { width: height * .62 }]} numberOfLines={1}>{title.toUpperCase()}</Text></View>
        <View style={styles.cover}>
          <View style={styles.textureA} /><View style={styles.textureB} />
          <View style={styles.inset} />
          <View style={styles.brand}><Text style={styles.brandText}>POKÉFILE</Text><View style={styles.brandRule} /><Text style={styles.edition}>PERSONAL SHOWCASE</Text></View>
          <View style={styles.wordmarkWrap}><Text style={styles.wordmark} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.55}>{title}</Text><Text style={styles.flexLabel}>FLEX BINDER</Text></View>
          <View style={styles.footer}><Text style={styles.footerText}>CURATED NINE</Text><Text style={styles.footerText}>{filled}/9</Text></View>
          <View style={styles.sheen} />
        </View>
      </View>
      <View style={styles.cornerAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', paddingLeft: 5, paddingRight: 12, paddingBottom: 13 },
  shadow: { position: 'absolute', left: 22, right: 1, top: 18, bottom: 1, borderRadius: 18, backgroundColor: '#000', opacity: .78, transform: [{ rotate: '1.2deg' }] },
  pages: { position: 'absolute', top: 8, bottom: 7, left: 19, right: 3, borderRadius: 15, backgroundColor: '#bcb8af', borderWidth: 1, borderColor: '#5c5954', overflow: 'hidden' },
  pageLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(40,38,35,.24)' },
  book: { flex: 1, flexDirection: 'row', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,.25)', backgroundColor: '#070708', shadowColor: '#000', shadowOpacity: .85, shadowRadius: 18, shadowOffset: { width: 5, height: 11 }, elevation: 14 },
  spine: { width: 25, backgroundColor: '#08080a', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  spineShade: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, backgroundColor: 'rgba(0,0,0,.55)' }, spineEdge: { position: 'absolute', right: 3, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,.1)' },
  spineTitle: { color: 'rgba(255,255,255,.63)', fontSize: 7, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center', transform: [{ rotate: '-90deg' }] },
  cover: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#0a0a0d' },
  textureA: { position: 'absolute', width: 330, height: 1, backgroundColor: 'rgba(139,92,246,.22)', top: '35%', left: -60, transform: [{ rotate: '-42deg' }] },
  textureB: { position: 'absolute', width: 330, height: 1, backgroundColor: 'rgba(255,255,255,.07)', top: '66%', left: -30, transform: [{ rotate: '35deg' }] },
  inset: { ...StyleSheet.absoluteFillObject, margin: 10, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,.11)' },
  brand: { position: 'absolute', top: 28, left: 27, right: 27 }, brandText: { color: 'rgba(255,255,255,.82)', fontSize: 8, fontWeight: '800', letterSpacing: 2.6 }, brandRule: { height: 1, backgroundColor: colors.purple, width: 32, marginTop: 9 }, edition: { color: 'rgba(255,255,255,.4)', fontSize: 6, fontWeight: '700', letterSpacing: 1.4, marginTop: 8 },
  wordmarkWrap: { position: 'absolute', left: 24, right: 24, top: '31%', bottom: '24%', alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: '#fff', fontSize: 34, lineHeight: 38, fontWeight: '300', textAlign: 'center', letterSpacing: -.8 }, flexLabel: { color: colors.purple, fontSize: 7, fontWeight: '800', letterSpacing: 2.8, marginTop: 16 },
  footer: { position: 'absolute', left: 27, right: 27, bottom: 28, flexDirection: 'row', justifyContent: 'space-between' }, footerText: { color: 'rgba(255,255,255,.38)', fontSize: 6, fontWeight: '700', letterSpacing: 1.2 },
  sheen: { position: 'absolute', top: -80, bottom: -80, left: -85, width: 78, backgroundColor: 'rgba(255,255,255,.025)', transform: [{ rotate: '14deg' }] },
  cornerAccent: { position: 'absolute', right: 19, bottom: 21, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.purple },
});
