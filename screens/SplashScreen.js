import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fill, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    const listener = fill.addListener(({ value }) => {
      setProgress(Math.round(value * 100));
    });

    animation.start();

    return () => {
      fill.removeListener(listener);
      fill.stopAnimation();
    };
  }, [fill]);

  const fillWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.content}>
        <View style={s.logoWrap}>
          <View style={s.mark}>
            <View style={s.band} />
            <View style={s.ring} />
          </View>
          <Text style={s.poke}>
            POKÉ<Text style={s.file}>FILE</Text>
          </Text>
        </View>

        <View style={s.loaderCard}>
          <View style={s.loaderHeader}>
            <Text style={s.status}>LOADING REGISTRY</Text>
            <Text style={s.percent}>{progress}%</Text>
          </View>

          <View style={s.track}>
            <Animated.View style={[s.fill, { width: fillWidth }]} />
          </View>

          <Text style={s.note}>INITIALIZING COLLECTIONS • SECURE INDEX</Text>
        </View>
      </View>

      <Text style={s.version}>VERSION 1.4.2</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07080a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  mark: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: colors.purple,
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 40,
    height: 12,
    backgroundColor: "#07080a",
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: "#07080a",
    backgroundColor: colors.purple,
  },
  poke: {
    color: "#f5f5f7",
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 34,
    letterSpacing: -1,
  },
  file: {
    fontFamily: "Manrope_300Light",
    letterSpacing: -1.2,
  },
  loaderCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 18,
  },
  loaderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  status: {
    color: "#f5f5f7",
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.6,
    opacity: 0.9,
  },
  percent: {
    color: colors.purple,
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple,
    shadowColor: colors.purple,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  note: {
    marginTop: 12,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Manrope_400Regular",
    fontSize: 9,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  version: {
    marginTop: 28,
    color: "rgba(255,255,255,0.46)",
    fontFamily: "Manrope_400Regular",
    fontSize: 9,
    letterSpacing: 1.4,
  },
});
