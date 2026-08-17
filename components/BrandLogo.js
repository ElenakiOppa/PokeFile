import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useAppContext } from '../AppContext';
import '../theme';

export default function BrandLogo({ theme, width = 150, style }) {
  const { preferences } = useAppContext();
  const resolvedTheme = theme || String(preferences.theme || 'Dark').toLowerCase();
  const source = resolvedTheme === 'light'
    ? require('../assets/splash_dark.png')
    : require('../assets/splash_light.png');
  return <Image source={source} style={[styles.logo, { width, height: width / 3.87 }, style]} resizeMode="contain" />;
}

const styles = StyleSheet.create({ logo: { alignSelf: 'center' } });
