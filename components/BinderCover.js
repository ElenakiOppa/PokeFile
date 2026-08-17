import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Immutable master backgrounds. Every set uses these exact images;
// only the centered expansion logo changes.
const STANDARD_TEMPLATES = {
  artwork: require('../assets/covers/templates/contour.png'),
  marble: require('../assets/covers/templates/vortex.png'),
  minimal: require('../assets/covers/templates/pokeball.png'),
  line: require('../assets/covers/templates/marble.png'),
  energy: require('../assets/covers/templates/card-back.png'),
};

export default function BinderCover({ set, styleId = 'classic', compact = false }) {
  const template = STANDARD_TEMPLATES[styleId] || null;

  return (
    <View style={[styles.cover, compact && styles.compact]}>
      {template ? <Image source={template} style={styles.background} resizeMode="cover" /> : null}
      {set?.logo ? <Image source={{ uri: set.logo }} style={styles.logo} resizeMode="contain" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  compact: { borderRadius: 10 },
  background: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  logo: { width: '76%', height: '30%', zIndex: 2 },
});
