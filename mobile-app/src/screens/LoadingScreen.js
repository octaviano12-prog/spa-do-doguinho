import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 52, marginBottom: 18 }}>🐶</Text>
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: "900", marginBottom: 16 }}>SPA do Doguinho</Text>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
