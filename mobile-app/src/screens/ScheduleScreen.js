import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Card, Screen, Title } from "../components/Screen";
import { api, getErrorMessage } from "../services/api";
import { colors } from "../theme/colors";

const inputStyle = { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, color: colors.text, marginBottom: 10 };
const sectionTitle = { color: colors.text, fontSize: 16, fontWeight: "900", marginBottom: 10, marginTop: 8 };
const chipWrap = { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 };

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: active ? colors.primary : "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, marginBottom: 8 }}>
      <Text style={{ color: active ? colors.textDark : colors.text, fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ScheduleScreen() {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [petId, setPetId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/customer/pets").then(({ data }) => setPets(data || [])).catch(() => {});
    api.get("/public/services").then(({ data }) => setServices(data || [])).catch(() => {});
  }, []);

  async function loadSlots() {
    if (!serviceId || !date) return Alert.alert("Atenção", "Escolha o serviço e informe a data no formato AAAA-MM-DD.");
    try {
      const { data } = await api.get(`/public/available-slots?service_id=${serviceId}&date=${date}`);
      setSlots(data?.slots || []);
      if (data?.blocked) Alert.alert("Data bloqueada", data.reason || "Esta data está indisponível.");
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    }
  }

  async function createAppointment() {
    if (!serviceId || !date || !time) return Alert.alert("Atenção", "Escolha serviço, data e horário.");
    try {
      setLoading(true);
      await api.post("/customer/appointments", { pet_id: petId, service_id: serviceId, date, time, payment_method: "presencial", notes });
      Alert.alert("Agendamento criado", "Seu horário foi solicitado com sucesso.");
      setTime(null);
      setNotes("");
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title subtitle="Escolha pet, serviço, data e horário disponível.">Agendar</Title>
      <Card>
        <Text style={sectionTitle}>Pet</Text>
        <View style={chipWrap}>{pets.map((pet) => <Chip key={pet.id} label={pet.name} active={petId === pet.id} onPress={() => setPetId(pet.id)} />)}</View>
        <Text style={sectionTitle}>Serviço</Text>
        <View style={chipWrap}>{services.map((service) => <Chip key={service.id} label={`${service.name} - R$ ${Number(service.price || 0).toFixed(2)}`} active={serviceId === service.id} onPress={() => setServiceId(service.id)} />)}</View>
        <Text style={sectionTitle}>Data</Text>
        <TextInput placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={date} onChangeText={setDate} style={inputStyle} />
        <Button title="Buscar horários" variant="secondary" onPress={loadSlots} />
      </Card>
      {slots.length > 0 ? (
        <Card>
          <Text style={sectionTitle}>Horários disponíveis</Text>
          <View style={chipWrap}>{slots.map((slot) => <Chip key={slot.time} label={slot.label || slot.time} active={time === slot.time} onPress={() => setTime(slot.time)} />)}</View>
          <TextInput placeholder="Observações" placeholderTextColor={colors.muted} value={notes} onChangeText={setNotes} style={inputStyle} />
          <Button title="Confirmar agendamento" loading={loading} onPress={createAppointment} />
        </Card>
      ) : null}
    </Screen>
  );
}
