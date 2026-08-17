import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

const BASE_ITEMS = [
  { route: "Home", label: "Home", icon: "home-outline" },
  { route: "CollectionAll", label: "Collection", icon: "albums-outline" },
  { route: "Wishlist", label: "Wishlist", icon: "heart-outline" },
  { route: "Profile", label: "Profile", icon: "person-outline" },
];
const EXPANDED_ITEMS = [
  { route: "AllSets", label: "SETS", icon: "grid-outline", x: -78, y: -92, delay: 0.08 },
  { route: "Search", label: "SEARCH", icon: "scan-outline", x: 0, y: -132, delay: 0.18 },
  { route: "Binders", label: "BINDERS", icon: "book-outline", x: 78, y: -92, delay: 0.28 },
];

export const MAIN_TAB_ROUTES = ["Home", "CollectionAll", "AllSets", "Binders", "Wishlist", "Profile"];

const DockItem = ({ item, active, onPress }) => (
  <TouchableOpacity style={styles.dockItem} onPress={onPress} activeOpacity={0.72} accessibilityLabel={item.label}>
    <Ionicons name={item.icon} size={22} color={active ? colors.purple : colors.textSecondary} />
    <View style={[styles.activeDot, !active && styles.activeDotHidden]} />
  </TouchableOpacity>
);

export default function BottomNav({ activeRoute, onNavigate, onMenu }) {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: expanded ? 1 : 0,
      duration: expanded ? 260 : 190,
      easing: expanded ? Easing.out(Easing.back(1.15)) : Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, progress]);

  const navigate = (route) => {
    setExpanded(false);
    if (route === "Menu") onMenu?.();
    else onNavigate(route);
  };

  return (
    <View style={[styles.shell, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
      {expanded ? (
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setExpanded(false)} />
        </Animated.View>
      ) : null}
      <View style={styles.flyout} pointerEvents="box-none">
        {EXPANDED_ITEMS.map((item) => (
          <Animated.View
            key={item.route}
            style={[
              styles.flyoutItemWrap,
              {
                opacity: progress.interpolate({ inputRange: [item.delay, Math.min(1, item.delay + 0.45)], outputRange: [0, 1], extrapolate: "clamp" }),
                transform: [
                  { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, item.x] }) },
                  { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [12, item.y] }) },
                  { scale: progress.interpolate({ inputRange: [item.delay, 1], outputRange: [0.25, 1], extrapolate: "clamp" }) },
                ],
              },
            ]}
            pointerEvents={expanded ? "auto" : "none"}
          >
            <Text style={styles.flyoutLabel}>{item.label}</Text>
            <TouchableOpacity style={styles.flyoutButton} onPress={() => navigate(item.route)} activeOpacity={0.82}>
              <View style={styles.flyoutInnerRing}>
                <Ionicons name={item.icon} size={25} color={colors.bg} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.bar}>
        <View style={styles.notch} />
        <DockItem item={BASE_ITEMS[0]} active={activeRoute === "Home"} onPress={() => navigate("Home")} />
        <DockItem item={BASE_ITEMS[1]} active={activeRoute === "CollectionAll"} onPress={() => navigate("CollectionAll")} />
        <View style={styles.centerSpace} />
        <DockItem item={BASE_ITEMS[2]} active={activeRoute === "Wishlist"} onPress={() => navigate("Wishlist")} />
        <DockItem item={BASE_ITEMS[3]} active={activeRoute === "Profile"} onPress={() => navigate("Profile")} />
      </View>

      <TouchableOpacity
        style={[styles.launcher, expanded && styles.launcherOpen]}
        onPress={() => setExpanded((value) => !value)}
        activeOpacity={0.86}
        accessibilityLabel={expanded ? "Close navigation" : "Open navigation"}
      >
        <Animated.View style={{ transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) }] }}>
          <Ionicons name="scan-outline" size={25} color={expanded ? colors.bg : colors.purple} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexShrink: 0, marginTop: "auto", backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, zIndex: 40, elevation: 30, overflow: "visible" },
  backdrop: { position: "absolute", width: Dimensions.get("window").width, height: Dimensions.get("window").height, left: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.62)", zIndex: 0 },
  bar: { height: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, overflow: "visible", zIndex: 2 },
  notch: { position: "absolute", width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bg, alignSelf: "center", top: 2 },
  dockItem: { flex: 1, height: 62, alignItems: "center", justifyContent: "center" },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.purple, marginTop: 5 },
  activeDotHidden: { opacity: 0 },
  centerSpace: { flex: 1 },
  launcher: { position: "absolute", alignSelf: "center", top: 7, width: 54, height: 54, borderRadius: 27, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", zIndex: 4 },
  launcherOpen: { backgroundColor: colors.purple, borderColor: colors.purple },
  flyout: { position: "absolute", alignSelf: "center", top: 8, width: 1, height: 1, zIndex: 3 },
  flyoutItemWrap: { position: "absolute", width: 74, left: -37, alignItems: "center" },
  flyoutLabel: { color: colors.text, fontSize: 8, fontWeight: "700", letterSpacing: 1.4, marginBottom: 8 },
  flyoutButton: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.purple, borderWidth: 3, borderColor: colors.bg, alignItems: "center", justifyContent: "center", shadowColor: colors.purple, shadowOpacity: 0.38, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 22 },
  flyoutInnerRing: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", alignItems: "center", justifyContent: "center" },
});
