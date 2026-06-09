import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Screen";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../services/api";
import { colors } from "../theme/colors";

const inputStyle = { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: colors.text, marginBottom: 12, fontSize: 16 };

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return Alert.alert("Atenção", "Preencha e-mail e senha.");
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Não foi possível entrar", getErrorMessage(error, "Confira os dados informados."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 58, marginBottom: 8 }}>🐶</Text>
      <Text style={{ color: colors.text, fontSize: 34, fontWeight: "900" }}>SPA do Doguinho</Text>
      <Text style={{ color: colors.muted, fontSize: 16, marginTop: 8, marginBottom: 34, lineHeight: 24 }}>Agende banho, tosa e acompanhe os cuidados do seu pet em um app moderno.</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 28, padding: 20, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginBottom: 16 }}>Entrar</Text>
        <TextInput placeholder="E-mail" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={inputStyle} />
        <TextInput placeholder="Senha" placeholderTextColor={colors.muted} secureTextEntry value={password} onChangeText={setPassword} style={inputStyle} />
        <Button title="Entrar no app" loading={loading} onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ alignItems: "center", marginTop: 18 }}>
          <Text style={{ color: colors.primary, fontWeight: "900" }}>Criar minha conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
