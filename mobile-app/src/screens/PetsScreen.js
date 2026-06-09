import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { Button, Card, EmptyState, Screen, Title } from "../components/Screen";
import { api, getErrorMessage } from "../services/api";
import { colors } from "../theme/colors";

const inputStyle = { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, color: colors.text, marginBottom: 10 };

export default function PetsScreen() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPets() {
    const { data } = await api.get("/customer/pets");
    setPets(data || []);
  }

  useEffect(() => { loadPets().catch(() => {}); }, []);

  async function addPet() {
    if (!name) return Alert.alert("Atenção", "Informe o nome do pet.");
    try {
      setLoading(true);
      await api.post("/customer/pets", { name, breed, species: "Cachorro" });
      setName("");
      setBreed("");
      await loadPets();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title subtitle="Cadastre seus pets para agilizar os agendamentos.">Meus Pets</Title>
      <Card>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900", marginBottom: 12 }}>Novo pet</Text>
        <TextInput placeholder="Nome do pet" placeholderTextColor={colors.muted} value={name} onChangeText={setName} style={inputStyle} />
        <TextInput placeholder="Raça ou observação" placeholderTextColor={colors.muted} value={breed} onChangeText={setBreed} style={inputStyle} />
        <Button title="Adicionar pet" loading={loading} onPress={addPet} />
      </Card>
      {pets.length === 0 ? <EmptyState title="Nenhum pet cadastrado" description="Adicione seu primeiro pet para começar." /> : null}
      {pets.map((pet) => (
        <Card key={pet.id} light>
          <Text style={{ color: colors.textDark, fontSize: 20, fontWeight: "900" }}>{pet.name}</Text>
          <Text style={{ color: colors.textDark, marginTop: 6 }}>{pet.breed || pet.species || "Cachorro"}</Text>
        </Card>
      ))}
    </Screen>
  );
}
