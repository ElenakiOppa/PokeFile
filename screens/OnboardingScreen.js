import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const SLIDES = [
  { eyebrow: 'BUILD', title: 'Your collection, organized', body: 'Track cards and every variant without losing your place.', symbol: '◇' },
  { eyebrow: 'BIND', title: 'Create visual binders', body: 'Choose a goal and pocket format, then watch every page fill up.', symbol: '▤' },
  { eyebrow: 'COMPLETE', title: 'Chase every milestone', body: 'Complete, Master, and Grandmaster progress stays together.', symbol: '✓' },
];

export default function OnboardingScreen({ navigate }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  const opacity = useRef(new Animated.Value(1)).current;

  const next = () => {
    if (index === SLIDES.length - 1) { navigate('Home'); return; }
    const nextIndex = index + 1;
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setIndex(nextIndex);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.brandWrap}><Image source={require('../assets/splash_light.png')} style={styles.brand} resizeMode="contain" /></View>
      <ScrollView ref={scrollRef} horizontal pagingEnabled scrollEnabled={false} showsHorizontalScrollIndicator={false}>
        {SLIDES.map((slide) => <View key={slide.eyebrow} style={styles.slide}>
          <View style={styles.visual}><View style={styles.glow} /><Text style={styles.symbol}>{slide.symbol}</Text></View>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text><Text style={styles.title}>{slide.title}</Text><Text style={styles.body}>{slide.body}</Text>
        </View>)}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.dots}>{SLIDES.map((slide, dotIndex) => <View key={slide.eyebrow} style={[styles.dot, dotIndex === index && styles.dotActive]} />)}</View>
        <TouchableOpacity style={styles.button} onPress={next}><Text style={styles.buttonText}>{index === SLIDES.length - 1 ? 'Enter PokeFile' : 'Continue'}</Text><Text style={styles.arrow}>→</Text></TouchableOpacity>
        {index < SLIDES.length - 1 ? <TouchableOpacity onPress={() => navigate('Home')}><Text style={styles.skip}>Skip</Text></TouchableOpacity> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  brandWrap: { height: 72, paddingHorizontal: 24, alignItems: 'flex-start', justifyContent: 'center' },
  brand: { width: 150, height: 50 },
  slide: { width, paddingHorizontal: 32, justifyContent: 'center', paddingBottom: 80 },
  visual: { width: 220, height: 220, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 36 },
  glow: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: 'rgba(139,92,246,0.35)' },
  symbol: { color: colors.purple, fontSize: 78, fontWeight: '200' },
  eyebrow: { color: colors.purple, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 34, fontWeight: '300', lineHeight: 39, marginTop: 10 },
  body: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 12, maxWidth: 330 },
  footer: { paddingHorizontal: 24, paddingBottom: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderStrong, marginHorizontal: 4 },
  dotActive: { width: 22, backgroundColor: colors.purple },
  button: { height: 56, borderRadius: 28, backgroundColor: colors.purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  buttonText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  arrow: { color: colors.text, fontSize: 19 },
  skip: { color: colors.textSecondary, textAlign: 'center', fontSize: 13, marginTop: 15 },
});
