import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export function Screen({ children }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 100 }}>
      {children}
    </ScrollView>
  );
}

export function Title({ children, subtitle }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.6 }}>{children}</Text>
      {subtitle ? <Text style={{ color: colors.muted, fontSize: 15, marginTop: 8, lineHeight: 22 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, light = false }) {
  return (
    <View style={{ backgroundColor: light ? colors.cardLight : colors.card, borderRadius: 24, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: light ? "#DCEFE3" : colors.border }}>
      {children}
    </View>
  );
}

export function Button({ title, onPress, loading, variant = "primary" }) {
  const bg = variant === "secondary" ? colors.card : colors.primary;
  const text = variant === "secondary" ? colors.text : colors.textDark;
  return (
    <TouchableOpacity disabled={loading} onPress={onPress} style={{ backgroundColor: bg, borderRadius: 18, paddingVertical: 15, alignItems: "center", marginTop: 10, opacity: loading ? 0.7 : 1, borderWidth: variant === "secondary" ? 1 : 0, borderColor: colors.border }}>
      {loading ? <ActivityIndicator color={text} /> : <Text style={{ color: text, fontSize: 16, fontWeight: "900" }}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function EmptyState({ title, description }) {
  return (
    <Card>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{description}</Text>
    </Card>
  );
}
