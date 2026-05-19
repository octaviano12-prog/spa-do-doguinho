import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  PawPrint,
  Scissors,
} from "lucide-react";

import client from "../api/client";

export default function PublicBooking() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    customer_name: "",
    pet_name: "",
    service_id: "",
    date: "",
    slot: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data } = await client.get("/services");

      setServices(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar serviços");
    }
  }

  async function loadSlots(date) {
    if (!date) return;

    try {
      const { data } = await client.get(
        `/availability/slots?date=${date}`
      );

      setSlots(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar horários");
    }
  }

  async function submit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await client.post("/public-booking", {
        customer_name: form.customer_name,
        pet_name: form.pet_name,
        service_id: form.service_id,
        scheduled_at: `${form.date} ${form.slot}:00`,
        notes: form.notes,
      });

      toast.success("Agendamento enviado!");

      setForm({
        customer_name: "",
        pet_name: "",
        service_id: "",
        date: "",
        slot: "",
        notes: "",
      });

      setSlots([]);
    } catch {
      toast.error("Erro ao enviar agendamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publicBookingPage">
      <motion.div
        className="bookingCard"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="sectionTitle">
          <span>Agendamento online</span>

          <h2>
            Agende o atendimento do seu pet
          </h2>
        </div>

        <form className="bookingForm" onSubmit={submit}>
          <label>
            <span>Seu nome</span>

            <input
              className="input"
              value={form.customer_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer_name: e.target.value,
                })
              }
              placeholder="Digite seu nome"
            />
          </label>

          <label>
            <span>Nome do pet</span>

            <input
              className="input"
              value={form.pet_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  pet_name: e.target.value,
                })
              }
              placeholder="Nome do pet"
            />
          </label>

          <label>
            <span>Serviço</span>

            <div className="inputIcon">
              <Scissors size={16} />

              <select
                className="input"
                value={form.service_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    service_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Selecione
                </option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label>
            <span>Data</span>

            <div className="inputIcon">
              <CalendarDays size={16} />

              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => {
                  setForm({
                    ...form,
                    date: e.target.value,
                    slot: "",
                  });

                  loadSlots(e.target.value);
                }}
              />
            </div>
          </label>

          <label className="full">
            <span>Horários disponíveis</span>

            <div className="slotGrid">
              {slots
                .filter((s) => s.available)
                .map((slot) => (
                  <button
                    type="button"
                    key={slot.time}
                    className={`slotBtn ${
                      form.slot === slot.time
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setForm({
                        ...form,
                        slot: slot.time,
                      })
                    }
                  >
                    <Clock3 size={14} />
                    {slot.time}
                  </button>
                ))}
            </div>
          </label>

          <label className="full">
            <span>Observações</span>

            <textarea
              className="input"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              placeholder="Informações importantes..."
            />
          </label>

          <button
            className="btn gold fullBtn"
            disabled={loading}
          >
            <PawPrint size={18} />

            {loading
              ? "Enviando..."
              : "Agendar atendimento"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
