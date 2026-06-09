import React from "react";
import { Text } from "react-native";
import { Button, Card, Screen, Title } from "../components/Screen";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme/colors";

export default function ProfileScreen() {
  const { customer, logout } = useAuth();

  return (
    <Screen>
      <Title subtitle="Dados da sua conta no SPA do Doguinho.">Perfil</Title>
      <Card light>
        <Text style={{ color: colors.textDark, fontSize: 22, fontWeight: "900" }}>{customer?.name || "Cliente"}</Text>
        <Text style={{ color: colors.textDark, marginTop: 8 }}>{customer?.email || ""}</Text>
        <Text style={{ color: colors.textDark, marginTop: 4 }}>{customer?.phone || ""}</Text>
      </Card>
      <Card>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Atendimento</Text>
        <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 22 }}>Use o app para acompanhar seus pets, horários e próximos atendimentos.</Text>
      </Card>
      <Button title="Sair da conta" variant="secondary" onPress={logout} />
    </Screen>
  );
}
