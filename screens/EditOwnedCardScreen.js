import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../theme";
import { CARD_DETAIL, getCardById } from "../data";

export default function EditOwnedCardScreen({
  goBack,
  params = {},
  collectionQuantities = {},
  setCardQuantity = () => {},
  rawAcquisitions = {},
  updateRawAcquisition = () => {},
}) {
  const card = getCardById(params.cardId || CARD_DETAIL.id, CARD_DETAIL);
  const existingAcquisition = rawAcquisitions[card.id] || {};
  const [qty, setQty] = useState(
    Math.max(1, Number(collectionQuantities[card.id] || 1)),
  );
  const [condition] = useState(existingAcquisition.condition || "Near Mint");
  const [price, setPrice] = useState("");
  const [purchaseQty, setPurchaseQty] = useState("1");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseSource, setPurchaseSource] = useState("");
  const [lots, setLots] = useState(existingAcquisition.acquisitions || []);
  const [notes, setNotes] = useState(existingAcquisition.note || "");
  const addLot = () => {
    if (price === "" || !Number.isFinite(Number(price))) return;
    setLots((current) => [
      ...current,
      {
        id: `lot-${Date.now()}`,
        quantity: Math.max(1, Number(purchaseQty) || 1),
        unitCost: Number(price),
        date: purchaseDate || null,
        source: purchaseSource,
      },
    ]);
    setPrice("");
    setPurchaseQty("1");
    setPurchaseDate("");
    setPurchaseSource("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <Image
          source={{ uri: card.image }}
          style={styles.thumb}
          resizeMode="contain"
        />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.number}>#{card.id}</Text>
          <Text style={styles.rarity}>{card.rarity}</Text>
        </View>
      </View>

      <Text style={styles.label}>QUANTITY</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Text style={styles.qtyBtnText}>–</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{qty}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQty((q) => q + 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>CONDITION</Text>
      <TouchableOpacity style={styles.pickerRow}>
        <Text style={styles.pickerValue}>{condition}</Text>
        <Text style={styles.pickerChevron}>⌄</Text>
      </TouchableOpacity>

      <Text style={styles.label}>PURCHASE PRICE</Text>
      <View style={styles.priceRow}>
        <Text style={styles.currency}>€</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          style={styles.priceInput}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      <View style={styles.lotMetaRow}>
        <TextInput
          value={purchaseQty}
          onChangeText={setPurchaseQty}
          keyboardType="number-pad"
          placeholder="Qty"
          placeholderTextColor={colors.textTertiary}
          style={styles.lotMetaInput}
        />
        <TextInput
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textTertiary}
          style={styles.lotMetaInput}
        />
      </View>
      <TextInput
        value={purchaseSource}
        onChangeText={setPurchaseSource}
        placeholder="Acquisition source (optional)"
        placeholderTextColor={colors.textTertiary}
        style={styles.sourceInput}
      />
      <TouchableOpacity style={styles.addLot} onPress={addLot}>
        <Text style={styles.addLotText}>Add Purchase Lot</Text>
      </TouchableOpacity>
      {lots.map((lot, index) => (
        <View key={lot.id || index} style={styles.lotRow}>
          <View>
            <Text style={styles.lotTitle}>
              {lot.quantity} × €{Number(lot.unitCost).toFixed(2)}
            </Text>
            <Text style={styles.lotMeta}>
              {lot.date || "Date not recorded"}
              {lot.source ? ` · ${lot.source}` : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              setLots((current) => current.filter((_, i) => i !== index))
            }
          >
            <Text style={styles.lotRemove}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>NOTES</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes..."
        placeholderTextColor={colors.textTertiary}
        style={styles.notesInput}
        multiline
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          setCardQuantity(card.id, qty);
          updateRawAcquisition(card.id, {
            acquisitions: lots,
            note: notes,
            condition,
          });
          goBack();
        }}
      >
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: "300" },
  cardRow: { flexDirection: "row", marginTop: 16, alignItems: "center" },
  thumb: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  name: { color: colors.text, fontSize: 18, fontWeight: "500" },
  number: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  rarity: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  label: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginTop: 24,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { color: colors.text, fontSize: 18 },
  qtyValue: {
    color: colors.text,
    fontSize: 18,
    marginHorizontal: 24,
    minWidth: 20,
    textAlign: "center",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
  },
  pickerValue: { color: colors.text, fontSize: 14 },
  pickerChevron: { color: colors.textSecondary, fontSize: 14 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    height: 46,
  },
  currency: { color: colors.textSecondary, fontSize: 14, marginRight: 6 },
  priceInput: { flex: 1, color: colors.text, fontSize: 14 },
  lotMetaRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  lotMetaInput: {
    flex: 1,
    height: 42,
    borderRadius: 9,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 12,
    fontSize: 11,
  },
  sourceInput: {
    height: 42,
    borderRadius: 9,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 12,
    fontSize: 11,
    marginTop: 8,
  },
  addLot: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },
  addLotText: { color: colors.purple, fontSize: 10, fontWeight: "700" },
  lotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  lotTitle: { color: colors.text, fontSize: 11 },
  lotMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 3 },
  lotRemove: { color: colors.red, fontSize: 9 },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    color: colors.text,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: colors.purple,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  saveBtnText: { color: colors.text, fontSize: 14, fontWeight: "600" },
});
