import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ProgressBar({ percent = 0, color = colors.purple, height = 3 }) {
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
