import React, { useEffect, useState } from "react";
import { RefreshControl, Text } from "react-native";
import { Card, EmptyState, Screen, Title } from "../components/Screen";
import { api } from "../services/api";
import { colors } from "../theme/colors";

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadAppointments() {
    const { data } = await api.get("/customer/appointments");
    setAppointments(data || []);
  }

  useEffect(() => { loadAppointments().catch(() => {}); }, []);

  async function refresh() {
    try {
      setRefreshing(true);
      await loadAppointments();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Title subtitle="Veja seus próximos horários e histórico de atendimento.">Minha Agenda</Title>
      {appointments.length === 0 ? <EmptyState title="Nenhum agendamento" description="Quando você agendar, seus horários aparecerão aqui." /> : null}
      {appointments.map((item) => (
        <Card key={item.id} light>
          <Text style={{ color: colors.textDark, fontSize: 20, fontWeight: "900" }}>{item.service_name || "Atendimento"}</Text>
          <Text style={{ color: colors.textDark, marginTop: 8, lineHeight: 22 }}>{item.pet_name || "Pet"}\n{item.date} às {String(item.time || "").slice(0, 5)}</Text>
          <Text style={{ color: colors.primaryDark, marginTop: 10, fontWeight: "900" }}>Status: {item.status || "pending"}</Text>
        </Card>
      ))}
    </Screen>
  );
}
