import React, { useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import CrudPage from "../components/CrudPage";

export default function Appointments() {
  const [slots, setSlots] = useState([]);

  async function checkSlots() {
    const date = prompt("Digite a data no formato AAAA-MM-DD");

    if (!date) return;

    try {
      const { data } = await client.get(`/availability/slots?date=${date}`);
      setSlots(Array.isArray(data) ? data : []);
      toast.success("Horários carregados");
    } catch {
      toast.error("Erro ao buscar horários");
    }
  }

  return (
    <>
      <CrudPage
        title="Agendamentos"
        subtitle="Agenda premium com status, horários e observações"
        endpoint="appointments"
        searchFields={["scheduled_at", "status", "notes"]}
        defaults={{
          customer_id: "",
          pet_id: "",
          service_id: "",
          scheduled_at: "",
          status: "pending",
          notes: "",
        }}
        columns={[
          { key: "customer_id", label: "Cliente" },
          { key: "pet_id", label: "Pet" },
          { key: "service_id", label: "Serviço" },
          { key: "scheduled_at", label: "Data/Hora" },
          { key: "status", label: "Status" },
        ]}
        fields={[
          { name: "customer_id", label: "ID Cliente", type: "number", placeholder: "Ex: 1" },
          { name: "pet_id", label: "ID Pet", type: "number", placeholder: "Ex: 2" },
          { name: "service_id", label: "ID Serviço", type: "number", placeholder: "Ex: 3" },
          { name: "scheduled_at", label: "Data/Hora", type: "datetime-local" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "pending", label: "Pendente" },
              { value: "confirmed", label: "Confirmado" },
              { value: "done", label: "Concluído" },
              { value: "canceled", label: "Cancelado" },
            ],
          },
          {
            name: "notes",
            label: "Observações",
            type: "textarea",
            placeholder: "Observações sobre o atendimento...",
            full: true,
          },
        ]}
      />

      <div className="card slotsBox premiumPanel">
        <div className="panelTitle">
          <div>
            <h2>Disponibilidade inteligente</h2>
            <p>Consulte horários disponíveis por data</p>
          </div>
        </div>

        <button className="btn gold" onClick={checkSlots}>
          Ver disponibilidade inteligente
        </button>

        <div className="slots">
          {slots.map((s) => (
            <span className={s.available ? "slot ok" : "slot busy"} key={s.time}>
              {s.time}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
