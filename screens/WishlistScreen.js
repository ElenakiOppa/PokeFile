import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors, type } from "../theme";
import TopBar from "../components/TopBar";
import EmptyState from "../components/EmptyState";
import { targetPriceStatus } from "../lib/valueEngine";

export default function WishlistScreen({
  navigate,
  wishlistItems = [],
  updateWishlistItem = () => {},
}) {
  const items = wishlistItems;

  const toggleFavorite = (item) => {
    updateWishlistItem(item.collectibleKey || item.id, {
      favorited: !item.favorited,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar
        variant="title"
        onMenuPress={() => navigate("Menu")}
        onAvatarPress={() => navigate("Profile")}
      />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>WISHLIST</Text>
          <Text style={type.hugeNumber}>
            {String(items.length).padStart(2, "0")}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigate("Search")}
        >
          <Text style={styles.addPlus}>+</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="♡"
            title="Your wishlist is empty"
            subtitle="Search for cards and add the ones you want to track."
            buttonLabel="Find cards"
            onButtonPress={() => navigate("Search")}
          />
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => {
            const currentStatus = targetPriceStatus({
              targetPrice: item.targetPrice,
              quote: item.targetPriceQuote,
            });
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.row}
                onPress={() =>
                  navigate("WishlistDetail", {
                    wishlistId: item.id,
                    cardId: item.id,
                  })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.thumb}
                  resizeMode="contain"
                />
                <View style={styles.rowInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemNumber}>
                    #{item.number} ·{" "}
                    {item.finish || item.variant || "Unknown finish"}
                  </Text>
                  <Text style={styles.itemSet}>
                    {item.setName || item.setId || "Unknown set"}
                  </Text>
                  {item.targetPrice != null ? (
                    <Text style={styles.target}>
                      Target €{Number(item.targetPrice).toFixed(2)}
                      {currentStatus ? ` · ${currentStatus}` : ""}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  hitSlop={10}
                >
                  <Text
                    style={[
                      styles.heart,
                      item.favorited && { color: colors.purple },
                    ]}
                  >
                    {item.favorited ? "♥" : "♡"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} style={{ marginLeft: 14 }}>
                  <Text style={styles.dots}>⋮</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  addPlus: { color: colors.text, fontSize: 22, fontWeight: "300" },
  list: { paddingHorizontal: 24, marginTop: 28, paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  rowInfo: { flex: 1, marginLeft: 14 },
  itemName: { color: colors.text, fontSize: 15, fontWeight: "500" },
  itemNumber: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  itemSet: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  target: {
    color: colors.purple,
    fontSize: 9,
    marginTop: 4,
    fontWeight: "600",
  },
  heart: { color: colors.text, fontSize: 20 },
  dots: { color: colors.textSecondary, fontSize: 18 },
  emptyWrap: { height: 420, marginTop: 10 },
});
