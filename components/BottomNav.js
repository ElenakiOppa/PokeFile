import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

const BASE_ITEMS = [
  { route: "Home", label: "Home", icon: "home-outline" },
  { route: "CollectionAll", label: "Collection", icon: "scan-outline" },
  { route: "Profile", label: "Profile", icon: "person-outline" },
  { route: "Menu", label: "Settings", icon: "settings-outline" },
];
const EXPANDED_ITEMS = [
  { route: "AllSets", label: "SETS", icon: "grid-outline", x: -96, y: -105, delay: 0.08 },
  { route: "Binders", label: "BINDERS", icon: "albums-outline", x: 0, y: -164, delay: 0.18 },
  { route: "Wishlist", label: "WISHLIST", icon: "heart-outline", x: 96, y: -105, delay: 0.28 },
];

export const MAIN_TAB_ROUTES = ["Home", "CollectionAll", "AllSets", "Binders", "Wishlist", "Profile"];

const DockItem = ({ item, active, onPress }) => (
  <TouchableOpacity style={styles.dockItem} onPress={onPress} activeOpacity={0.72} accessibilityLabel={item.label}>
    <Ionicons name={item.icon} size={29} color={active ? colors.purple : colors.textSecondary} />
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
                <Ionicons name={item.icon} size={34} color="#fff" />
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
        <DockItem item={BASE_ITEMS[2]} active={activeRoute === "Profile"} onPress={() => navigate("Profile")} />
        <DockItem item={BASE_ITEMS[3]} active={false} onPress={() => navigate("Menu")} />
      </View>

      <TouchableOpacity
        style={[styles.launcher, expanded && styles.launcherOpen]}
        onPress={() => setExpanded((value) => !value)}
        activeOpacity={0.86}
        accessibilityLabel={expanded ? "Close navigation" : "Open navigation"}
      >
        <Animated.View style={{ transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) }] }}>
          <Ionicons name="grid-outline" size={31} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexShrink: 0, marginTop: "auto", backgroundColor: colors.surface, borderTopLeftRadius: 34, borderTopRightRadius: 34, zIndex: 40, elevation: 30, overflow: "visible", shadowColor: "#000", shadowOpacity: 0.45, shadowRadius: 24, shadowOffset: { width: 0, height: -8 } },
  backdrop: { position: "absolute", width: Dimensions.get("window").width, height: Dimensions.get("window").height, left: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.62)", zIndex: 0 },
  bar: { height: 88, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, overflow: "visible", zIndex: 2 },
  notch: { position: "absolute", width: 112, height: 112, borderRadius: 56, backgroundColor: colors.bg, alignSelf: "center", top: -57 },
  dockItem: { flex: 1, height: 68, alignItems: "center", justifyContent: "center" },
  activeDot: { width: 18, height: 3, borderRadius: 2, backgroundColor: colors.purple, marginTop: 6 },
  activeDotHidden: { opacity: 0 },
  centerSpace: { flex: 1 },
  launcher: { position: "absolute", alignSelf: "center", top: -40, width: 82, height: 82, borderRadius: 41, backgroundColor: colors.purple, borderWidth: 5, borderColor: colors.bg, alignItems: "center", justifyContent: "center", shadowColor: colors.purple, shadowOpacity: 0.58, shadowRadius: 22, shadowOffset: { width: 0, height: 5 }, elevation: 24, zIndex: 4 },
  launcherOpen: { borderColor: colors.surface },
  flyout: { position: "absolute", alignSelf: "center", top: -38, width: 1, height: 1, zIndex: 3 },
  flyoutItemWrap: { position: "absolute", width: 92, left: -46, alignItems: "center" },
  flyoutLabel: { color: colors.text, fontSize: 8, fontWeight: "700", letterSpacing: 1.4, marginBottom: 8 },
  flyoutButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.purple, borderWidth: 5, borderColor: colors.bg, alignItems: "center", justifyContent: "center", shadowColor: colors.purple, shadowOpacity: 0.52, shadowRadius: 22, shadowOffset: { width: 0, height: 7 }, elevation: 22 },
  flyoutInnerRing: { width: 61, height: 61, borderRadius: 31, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
});
