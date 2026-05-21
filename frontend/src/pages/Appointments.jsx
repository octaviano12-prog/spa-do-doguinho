import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import CrudPage from "../components/CrudPage";

export default function Appointments() {
  const [slots, setSlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [customersRes, petsRes, servicesRes] = await Promise.all([
          client.get("/customers"),
          client.get("/pets"),
          client.get("/services"),
        ]);

        setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
        setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      } catch {
        toast.error("Erro ao carregar opções do agendamento");
      }
    }

    loadOptions();
  }, []);

  const customerOptions = useMemo(
    () => customers.map((item) => ({ value: item.id, label: item.name })),
    [customers]
  );

  const petOptions = useMemo(
    () => pets.map((item) => ({
      value: item.id,
      label: `${item.name}${item.customer_name ? ` - ${item.customer_name}` : ""}`,
    })),
    [pets]
  );

  const serviceOptions = useMemo(
    () => services
      .filter((item) => Number(item.active) !== 0)
      .map((item) => ({ value: item.id, label: item.name })),
    [services]
  );

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
        searchFields={["scheduled_at", "scheduled_label", "status", "notes", "customer_name", "pet_name", "service_name"]}
        defaults={{
          customer_id: "",
          pet_id: "",
          service_id: "",
          scheduled_at: "",
          status: "pending",
          notes: "",
        }}
        columns={[
          { key: "customer_name", label: "Cliente" },
          { key: "pet_name", label: "Pet" },
          { key: "service_name", label: "Serviço" },
          { key: "scheduled_label", label: "Data/Hora" },
          { key: "status", label: "Status" },
        ]}
        fields={[
          { name: "customer_id", label: "Cliente", type: "select", options: customerOptions },
          { name: "pet_id", label: "Pet", type: "select", options: petOptions },
          { name: "service_id", label: "Serviço", type: "select", options: serviceOptions },
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
