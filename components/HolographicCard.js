import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, PanResponder, StyleSheet, View } from 'react-native';

export default function HolographicCard({ uri, style, imageStyle, interactive = true, onImageLoad, onImageError }) {
  const motion = useRef(new Animated.ValueXY()).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduceMotion);
    return () => subscription?.remove?.();
  }, []);
  const reset = () => Animated.spring(motion, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 8 }).start();
  const responder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => interactive && !reduceMotion && (Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4),
    onPanResponderMove: (_, gesture) => motion.setValue({ x: Math.max(-18, Math.min(18, gesture.dx)), y: Math.max(-18, Math.min(18, gesture.dy)) }),
    onPanResponderRelease: reset,
    onPanResponderTerminate: reset,
  })).current;
  const rotateY = motion.x.interpolate({ inputRange: [-18, 18], outputRange: ['-4deg', '4deg'] });
  const rotateX = motion.y.interpolate({ inputRange: [-18, 18], outputRange: ['4deg', '-4deg'] });
  const highlightX = motion.x.interpolate({ inputRange: [-18, 18], outputRange: [-45, 45] });
  return (
    <Animated.View {...responder.panHandlers} style={[styles.shell, style, !reduceMotion && { transform: [{ perspective: 700 }, { rotateX }, { rotateY }] }]}>
      <Image source={{ uri }} style={[styles.image, imageStyle]} resizeMode="contain" onLoad={onImageLoad} onError={onImageError} />
      {!reduceMotion ? <Animated.View pointerEvents="none" style={[styles.highlight, { transform: [{ translateX: highlightX }, { rotate: '16deg' }] }]} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: { overflow: 'hidden', borderRadius: 10 },
  image: { width: '100%', height: '100%' },
  highlight: { position: 'absolute', top: -30, bottom: -30, left: '43%', width: '18%', backgroundColor: 'rgba(255,255,255,0.10)' },
});
