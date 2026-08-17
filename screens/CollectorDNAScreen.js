import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { CARD_LIBRARY, SETS } from '../data';
import { calculateCollectorDNA } from '../lib/collectorAnalytics';

const statements = (dna) => [
  dna.favoritePokemon && `${dna.favoritePokemon[0]} appears more than any other Pokémon.`,
  dna.favoriteType && `${dna.favoriteType[0]} dominates your known-type cards.`,
  dna.favoriteIllustrator && `${dna.favoriteIllustrator[0]} is your most collected illustrator.`,
  dna.favoriteEra && `${dna.favoriteEra[0]} is your strongest era.`,
  dna.favoriteRarity && `${dna.favoriteRarity[0]} is your most collected rarity.`,
  dna.favoriteGeneration && `Generation ${dna.favoriteGeneration[0]} leads where generation data is available.`,
].filter(Boolean);
export default function CollectorDNAScreen({ goBack, collectionQuantities = {} }) {
  const dna = useMemo(() => calculateCollectorDNA(collectionQuantities, CARD_LIBRARY, SETS), [collectionQuantities]);
  const lines = statements(dna);
  return <ScrollView style={styles.container}><TopBar variant="back" onBackPress={goBack} /><View style={styles.content}><Text style={styles.eyebrow}>YOUR COLLECTOR DNA</Text><Text style={styles.hero}>{lines[0] || 'Your collection is waiting to reveal its character.'}</Text>{lines.slice(1).map((line, index) => <View key={line} style={styles.statement}><Text style={styles.number}>{String(index + 2).padStart(2, '0')}</Text><Text style={styles.line}>{line}</Text></View>)}<Text style={styles.note}>{dna.uniqueCards ? `Based on ${dna.uniqueCards} unique owned cards and ${dna.totalPhysical} physical copies. Missing metadata is excluded.` : 'Add cards to begin your Collector DNA.'}</Text></View></ScrollView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg }, content: { padding: 24, paddingBottom: 50 }, eyebrow: { color: colors.purple, fontSize: 10, fontWeight: '700', letterSpacing: 2.5, marginTop: 26 }, hero: { color: colors.text, fontSize: 42, lineHeight: 49, fontWeight: '300', marginTop: 20, marginBottom: 42 }, statement: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 22, flexDirection: 'row' }, number: { color: colors.textTertiary, fontSize: 10, width: 36 }, line: { color: colors.text, fontSize: 20, lineHeight: 28, fontWeight: '300', flex: 1 }, note: { color: colors.textTertiary, fontSize: 10, lineHeight: 16, marginTop: 28 } });
