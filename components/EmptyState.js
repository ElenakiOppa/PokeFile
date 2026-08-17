
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme';

/**
 * Generic full-screen state block: loading / empty / error / success.
 * icon: a short glyph or emoji-like character (keep it simple, no icon lib required)
 */
export default function EmptyState({
  icon = '○',
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
  loading = false,
  tone = 'default', // 'default' | 'success' | 'error'
}) {
  const iconColor =
    tone === 'success' ? colors.purple : tone === 'error' ? '#e74c3c' : colors.textSecondary;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.purple} />
      ) : (
        <View style={[styles.iconCircle, { borderColor: iconColor, backgroundColor: colors.surface }]}>
          <Text style={[styles.iconText, { color: iconColor }]}>{icon}</Text>
        </View>
      )}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {buttonLabel ? (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  iconText: { fontSize: 24 },
  title: { color: colors.text, fontSize: 23, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  subtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 19, maxWidth: 310 },
  button: {
    marginTop: 24, minWidth: 180, backgroundColor: colors.purple, borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 15, alignItems: 'center',
  },
  buttonText: { color: colors.bg, fontSize: 14, fontWeight: '800' },
});
