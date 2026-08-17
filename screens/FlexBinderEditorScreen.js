import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { CARD_LIBRARY } from '../data';
import { collectibleKey, ownedQuantity } from '../lib/collectibles';
import { getPrimaryFlexBinder, moveFlexSlot, normalizeFlexBinder, removeFlexSlot, setFlexSlot } from '../lib/flexBinder';

export default function FlexBinderEditorScreen({ goBack, navigate, params = {}, binders = [], collectionQuantities = {}, createBinder, updateBinder }) {
  const existing = getPrimaryFlexBinder(binders);
  const [draft, setDraft] = useState(() => normalizeFlexBinder(existing || { id: `flex-${Date.now()}`, title: 'My Flex', description: '' }));
  const [pickerSlot, setPickerSlot] = useState(null);
  const [moveFrom, setMoveFrom] = useState(null);
  const ownedCards = useMemo(() => {
    const seen = new Set();
    return CARD_LIBRARY.filter((card) => ownedQuantity(collectionQuantities, card) > 0 && !seen.has(collectibleKey(card)) && seen.add(collectibleKey(card)));
  }, [collectionQuantities]);
  const chooseSlot = (index) => {
    if (moveFrom !== null) { setDraft((value) => moveFlexSlot(value, moveFrom, index)); setMoveFrom(null); return; }
    setPickerSlot(index);
  };
  const save = () => {
    const next = { ...draft, name: draft.title.trim() || 'My Flex', title: draft.title.trim() || 'My Flex', updatedAt: new Date().toISOString(), createdAt: draft.createdAt || new Date().toISOString() };
    if (existing) updateBinder(existing.id, next); else createBinder(next);
    navigate('FlexBinderPage', { binderId: next.id });
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopBar variant="back" onBackPress={goBack} onSearchPress={() => navigate('Search')} />
        <View style={styles.header}><Text style={styles.eyebrow}>FLEX BINDER</Text><Text style={styles.title}>Curate your nine.</Text></View>
        <TextInput value={draft.title} onChangeText={(title) => setDraft((v) => ({ ...v, title }))} placeholder="Showcase title" placeholderTextColor={colors.textTertiary} style={styles.input} />
        <TextInput value={draft.description} onChangeText={(description) => setDraft((v) => ({ ...v, description }))} placeholder="Short description (optional)" placeholderTextColor={colors.textTertiary} style={[styles.input, styles.description]} multiline maxLength={140} />
        <View style={styles.grid}>{draft.slots.map((slot, index) => (
          <TouchableOpacity key={index} style={[styles.slot, moveFrom === index && styles.slotActive]} onPress={() => chooseSlot(index)} onLongPress={() => slot && setMoveFrom(index)}>
            {slot?.card?.image ? <Image source={{ uri: slot.card.image }} style={styles.card} resizeMode="contain" /> : <Text style={styles.slotNumber}>{String(index + 1).padStart(2, '0')}</Text>}
            {slot ? <TouchableOpacity style={styles.remove} onPress={() => setDraft((v) => removeFlexSlot(v, index))}><Text style={styles.removeText}>×</Text></TouchableOpacity> : null}
          </TouchableOpacity>
        ))}</View>
        <Text style={styles.help}>{moveFrom === null ? 'Tap to add or replace. Long press a card, then tap another slot to move it.' : `Choose the destination for slot ${moveFrom + 1}.`}</Text>
        <TouchableOpacity style={styles.save} onPress={save}><Text style={styles.saveText}>Save Flex Binder</Text></TouchableOpacity>
      </ScrollView>
      <Modal visible={pickerSlot !== null} animationType="slide" onRequestClose={() => setPickerSlot(null)}>
        <ScrollView style={styles.picker}><View style={styles.pickerHeader}><Text style={styles.pickerTitle}>Choose an owned card</Text><TouchableOpacity onPress={() => setPickerSlot(null)}><Text style={styles.done}>Done</Text></TouchableOpacity></View>
          {ownedCards.length ? <View style={styles.pickerGrid}>{ownedCards.map((card) => <TouchableOpacity key={collectibleKey(card)} style={styles.pickCard} onPress={() => { setDraft((v) => setFlexSlot(v, pickerSlot, card)); setPickerSlot(null); }}><Image source={{ uri: card.image }} style={styles.pickImage} resizeMode="contain" /><Text style={styles.pickName} numberOfLines={1}>{card.name}</Text><Text style={styles.pickMeta} numberOfLines={1}>{card.variant || card.finish}</Text></TouchableOpacity>)}</View> : <Text style={styles.empty}>Add cards to your collection before curating a Flex Binder.</Text>}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg }, header: { paddingHorizontal: 24, marginTop: 24, marginBottom: 24 }, eyebrow: { color: colors.purple, fontSize: 10, fontWeight: '700', letterSpacing: 2 }, title: { color: colors.text, fontSize: 36, fontWeight: '300', marginTop: 8 }, input: { marginHorizontal: 24, marginBottom: 12, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 15, height: 52 }, description: { height: 76, paddingTop: 14, textAlignVertical: 'top' }, grid: { marginHorizontal: 24, marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 10, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, slot: { width: '31.2%', aspectRatio: .716, borderRadius: 9, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }, slotActive: { borderColor: colors.purple, borderWidth: 2 }, card: { width: '100%', height: '100%', borderRadius: 8 }, slotNumber: { color: colors.textTertiary, fontSize: 10 }, remove: { position: 'absolute', right: 4, top: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,.72)', alignItems: 'center', justifyContent: 'center' }, removeText: { color: '#fff', fontSize: 17, lineHeight: 19 }, help: { color: colors.textTertiary, fontSize: 10, lineHeight: 15, marginHorizontal: 24, marginTop: 12 }, save: { margin: 24, height: 54, borderRadius: 27, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }, saveText: { color: '#fff', fontWeight: '700' }, picker: { flex: 1, backgroundColor: colors.bg }, pickerHeader: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between' }, pickerTitle: { color: colors.text, fontSize: 24, fontWeight: '300' }, done: { color: colors.purple, fontSize: 14, fontWeight: '700' }, pickerGrid: { paddingHorizontal: 18, paddingBottom: 40, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, pickCard: { width: '30.8%', marginBottom: 12 }, pickImage: { width: '100%', aspectRatio: .716 }, pickName: { color: colors.text, fontSize: 10, marginTop: 5 }, pickMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 2 }, empty: { color: colors.textSecondary, margin: 24 } });
