import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Card, Screen, Title } from "../components/Screen";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const { customer } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/customer/appointments").then(({ data }) => setAppointments(data || [])).catch(() => {});
    api.get("/customer/pets").then(({ data }) => setPets(data || [])).catch(() => {});
  }, []);

  const next = appointments[0];

  return (
    <Screen>
      <Title subtitle="Tudo para cuidar do seu pet com carinho e praticidade.">Olá, {customer?.name?.split(" ")?.[0] || "cliente"} 🐾</Title>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card><Text style={numberStyle}>{pets.length}</Text><Text style={labelStyle}>Pets cadastrados</Text></Card>
        <Card><Text style={numberStyle}>{appointments.length}</Text><Text style={labelStyle}>Agendamentos</Text></Card>
      </View>
      <Card light>
        <Text style={{ color: colors.textDark, fontSize: 20, fontWeight: "900" }}>Próximo atendimento</Text>
        {next ? (
          <Text style={{ color: colors.textDark, marginTop: 8, lineHeight: 22 }}>{next.pet_name || "Pet"} • {next.service_name || "Serviço"}\n{next.date} às {String(next.time || "").slice(0, 5)}</Text>
        ) : (
          <Text style={{ color: colors.textDark, marginTop: 8, lineHeight: 22 }}>Você ainda não possui agendamento. Vá em Agendar para escolher um horário.</Text>
        )}
      </Card>
      <Card>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>SPA do Doguinho Premium</Text>
        <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 22 }}>Banho, tosa, cuidado e organização para seu melhor amigo.</Text>
      </Card>
    </Screen>
  );
}

const numberStyle = { color: colors.primary, fontSize: 32, fontWeight: "900" };
const labelStyle = { color: colors.muted, marginTop: 4, fontWeight: "800" };
