import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import FlexBinderPresentation from '../components/FlexBinderPresentation';
import { getPrimaryFlexBinder, normalizeFlexBinder, toFlexBinderData } from '../lib/flexBinder';
import { useAppContext } from '../AppContext';

export default function FlexBinderPageScreen({ goBack, navigate, params = {}, binders = [] }) {
  const { userProfile } = useAppContext();
  const binder = useMemo(() => normalizeFlexBinder(getPrimaryFlexBinder(binders)), [binders]);
  const data = useMemo(() => toFlexBinderData(binder, userProfile.displayName), [binder, userProfile.displayName]);
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportMounted, setExportMounted] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [resolvedSlots, setResolvedSlots] = useState(() => new Set());
  const [failedSlots, setFailedSlots] = useState(() => new Set());
  const captureStarted = useRef(false);
  const occupiedSlotIndexes = useMemo(() => data.cards.map((card, index) => card ? index : null).filter((index) => index !== null), [data.cards]);

  const prefetchOnce = (uri, timeoutMs = 15000) => new Promise((resolve, reject) => {
    if (!uri) { reject(new Error('Missing image URI')); return; }
    const timeout = setTimeout(() => reject(new Error('Artwork request timed out')), timeoutMs);
    Image.prefetch(uri).then((loaded) => {
      clearTimeout(timeout);
      if (loaded === false) reject(new Error('Artwork could not be cached'));
      else resolve(true);
    }).catch((error) => { clearTimeout(timeout); reject(error); });
  });

  const preloadSlot = async (index) => {
    const uri = data.cards[index]?.image;
    try { await prefetchOnce(uri); return { index, failed: false }; }
    catch (_) {
      try { await prefetchOnce(uri); return { index, failed: false }; }
      catch (error) { return { index, failed: true, error }; }
    }
  };

  const exportImage = async () => {
    if (exporting) return;
    try {
      captureStarted.current = false;
      setLayoutReady(false);
      setExportMounted(false);
      setResolvedSlots(new Set());
      setFailedSlots(new Set());
      setExporting(true);
      const results = await Promise.all(occupiedSlotIndexes.map(preloadSlot));
      const failed = new Set(results.filter((result) => result.failed).map((result) => result.index));
      setFailedSlots(failed);
      setResolvedSlots(new Set(failed));
      setExportMounted(true);
    } catch (error) {
      setExporting(false);
      Alert.alert('Could not prepare export', error.message);
    }
  };

  const resolveExportSlot = useCallback((index, status) => {
    if (status === 'failed') setFailedSlots((current) => new Set([...current, index]));
    setResolvedSlots((current) => current.has(index) ? current : new Set([...current, index]));
  }, []);

  useEffect(() => {
    if (!exportMounted) return undefined;
    // This is a failure boundary, not capture synchronization: normally every
    // slot resolves through Image.onLoad/onError. It only prevents a native
    // image decoder that emits neither callback from blocking export forever.
    const failureBoundary = setTimeout(() => {
      const unresolved = occupiedSlotIndexes.filter((index) => !resolvedSlots.has(index));
      if (!unresolved.length) return;
      setFailedSlots((current) => new Set([...current, ...unresolved]));
      setResolvedSlots((current) => new Set([...current, ...unresolved]));
    }, 15000);
    return () => clearTimeout(failureBoundary);
  }, [exportMounted, occupiedSlotIndexes, resolvedSlots]);

  useEffect(() => {
    if (!exporting || !exportMounted || !layoutReady || resolvedSlots.size < occupiedSlotIndexes.length || captureStarted.current) return;
    captureStarted.current = true;
    const captureWhenCommitted = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const uri = await captureRef(exportRef, { format: 'png', quality: 1, width: 1080, height: 1920, result: 'tmpfile' });
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your PokeFile Flex Binder' });
        else Alert.alert('Export ready', 'The showcase image was created successfully.');
      } catch (error) { Alert.alert('Could not export', error.message); }
      finally { setExportMounted(false); setExporting(false); }
    };
    captureWhenCommitted();
  }, [exporting, exportMounted, layoutReady, resolvedSlots, occupiedSlotIndexes.length]);
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopBar variant="back" onBackPress={goBack} />
        <FlexBinderPresentation data={data} onCardPress={(card) => navigate('CardDetail', { cardId: card.collectibleKey })} />
        <View style={styles.actions}><TouchableOpacity style={styles.secondary} onPress={() => navigate('FlexBinderEditor', { binderId: binder.id })}><Text style={styles.secondaryText}>Edit</Text></TouchableOpacity><TouchableOpacity style={[styles.primary, exporting && styles.primaryDisabled]} onPress={exportImage} disabled={exporting}><Text style={styles.primaryText}>{exporting ? 'Preparing showcase…' : 'Export 1080 × 1920'}</Text></TouchableOpacity></View>
      </ScrollView>
      <Modal visible={exporting} transparent animationType="none"><View style={styles.captureHost} pointerEvents="none">{exportMounted ? <View ref={exportRef} collapsable={false} style={styles.capture}><FlexBinderPresentation data={data} exportMode failedSlots={failedSlots} onExportSlotResolved={resolveExportSlot} onExportLayout={() => setLayoutReady(true)} /></View> : null}</View></Modal>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg }, actions: { flexDirection: 'row', gap: 10, marginHorizontal: 22, marginBottom: 40 }, secondary: { height: 48, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' }, secondaryText: { color: colors.text, fontWeight: '600' }, primary: { flex: 1, height: 48, borderRadius: 24, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }, primaryDisabled: { opacity: 0.65 }, primaryText: { color: '#fff', fontWeight: '700', fontSize: 12 }, captureHost: { position: 'absolute', left: -2000, top: 0 }, capture: { width: 1080, height: 1920, backgroundColor: colors.bg } });
