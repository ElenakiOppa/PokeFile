import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { BINDERS } from '../data';

export default function BindersScreen({ navigate }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>BINDERS</Text>
          <Text style={type.hugeNumber}>{String(BINDERS.length).padStart(2, '0')}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigate('CoverDesigner', { mode: 'create' })}>
          <Text style={styles.addPlus}>+</Text>
        </TouchableOpacity>
      </View>

      {BINDERS.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No binders yet</Text>
          <Text style={styles.emptyText}>Create a binder once you want to organize your sets.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          style={{ marginTop: 28 }}
        >
          {BINDERS.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.binderCard}
              onPress={() => navigate('BinderDetail', { binderId: b.id })}
            >
              <Image
                source={{ uri: b.logo }}
                style={styles.binderImage}
                resizeMode="contain"
              />
              <Text style={styles.binderName}>{b.name}</Text>
              <Text style={styles.binderSubtitle}>{b.subtitle}</Text>
              <Text style={styles.binderPercent}>{b.percent}%</Text>
              <View style={{ marginTop: 6, width: 150 }}>
                <ProgressBar percent={b.percent} height={2} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, marginTop: 20,
  },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  addPlus: { color: colors.text, fontSize: 22, fontWeight: '300' },
  row: { paddingHorizontal: 24, paddingBottom: 40 },
  binderCard: { width: 160, marginRight: 20 },
  binderImage: { width: '100%', height: 220, borderRadius: 12, backgroundColor: colors.card },
  binderName: { color: colors.text, fontSize: 15, fontWeight: '500', marginTop: 12 },
  binderSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  binderPercent: { color: colors.textSecondary, fontSize: 12, marginTop: 8 },
  emptyState: {
    marginTop: 28,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '500' },
  emptyText: { color: colors.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center' },
});
