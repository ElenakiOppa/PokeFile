
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { getCardById, CARD_DETAIL } from '../data';

export default function CardZoomScreen({ goBack, navigate, params = {} }) {
  const card = getCardById(params.cardId || CARD_DETAIL.id, CARD_DETAIL);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Profile')} style={styles.avatar}>
          <Text style={styles.avatarText}>PH</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: card.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.number}>#{card.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 16,
  },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  avatar: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: colors.text, fontSize: 10, fontWeight: '600' },
  imageWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  image: { width: '100%', height: '85%' },
  footer: { alignItems: 'center', paddingBottom: 40 },
  name: { color: colors.text, fontSize: 20, fontWeight: '500' },
  number: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
});
