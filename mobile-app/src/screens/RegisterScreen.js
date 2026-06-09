import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Screen";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../services/api";
import { colors } from "../theme/colors";

const inputStyle = { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: colors.text, marginBottom: 12, fontSize: 16 };

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) return Alert.alert("Atenção", "Nome, e-mail e senha são obrigatórios.");
    try {
      setLoading(true);
      await register({ name, phone, email: email.trim(), password });
    } catch (error) {
      Alert.alert("Não foi possível cadastrar", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 52, marginBottom: 8 }}>✨</Text>
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900" }}>Criar conta</Text>
      <Text style={{ color: colors.muted, fontSize: 16, marginTop: 8, marginBottom: 28, lineHeight: 24 }}>Cadastre-se para agendar e acompanhar os cuidados do seu pet.</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 28, padding: 20, borderWidth: 1, borderColor: colors.border }}>
        <TextInput placeholder="Nome completo" placeholderTextColor={colors.muted} value={name} onChangeText={setName} style={inputStyle} />
        <TextInput placeholder="Telefone" placeholderTextColor={colors.muted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={inputStyle} />
        <TextInput placeholder="E-mail" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={inputStyle} />
        <TextInput placeholder="Senha" placeholderTextColor={colors.muted} secureTextEntry value={password} onChangeText={setPassword} style={inputStyle} />
        <Button title="Cadastrar" loading={loading} onPress={handleRegister} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: "center", marginTop: 18 }}>
          <Text style={{ color: colors.primary, fontWeight: "900" }}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
