import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  PawPrint,
  Scissors,
} from "lucide-react";

import client from "../api/client";

const whatsappHref =
  "https://wa.me/5518999999999";

export default function PublicBooking() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [success, setSuccess] = useState(false);

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

  async function loadSlots(date, serviceId = form.service_id) {
    if (!date) return;

    try {
      const { data } = await client.get(
        `/availability/slots?date=${date}&service_id=${serviceId || ""}`
      );

      setSlots(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar horários");
    }
  }

  const selectedService = useMemo(() => {
    return services.find(
      (s) => String(s.id) === String(form.service_id)
    );
  }, [services, form.service_id]);

  async function submit(e) {
    e.preventDefault();

    if (!form.slot) {
      return toast.error(
        "Selecione um horário"
      );
    }

    if (!form.customer_name || !form.pet_name || !form.service_id || !form.date) {
      return toast.error("Preencha nome, pet, serviço e data");
    }

    setLoading(true);

    try {
      await client.post("/public-booking", {
        customer_name: form.customer_name,
        pet_name: form.pet_name,
        service_id: form.service_id,
        scheduled_at: `${form.date} ${form.slot}:00`,
        notes: form.notes,
      });

      setSuccess(true);

      toast.success(
        "Agendamento enviado!"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Erro ao enviar agendamento"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publicBookingPage">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            className="bookingCard"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
          >
            <div className="sectionTitle">
              <span>
                Agendamento online
              </span>

              <h2>
                Agende o atendimento
                do seu pet
              </h2>
            </div>

            <form
              className="bookingForm"
              onSubmit={submit}
            >
              <label>
                <span>Seu nome</span>

                <input
                  className="input"
                  value={form.customer_name}
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_name:
                        e.target.value,
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
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pet_name:
                        e.target.value,
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
                    required
                    onChange={(e) => {
                      setForm({
                        ...form,
                        service_id:
                          e.target.value,
                        slot: "",
                      })
                      if (form.date) loadSlots(form.date, e.target.value);
                    }}
                  >
                    <option value="">
                      Selecione
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      )
                    )}
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
                    required
                    onChange={(e) => {
                      setForm({
                        ...form,
                        date:
                          e.target.value,
                        slot: "",
                      });

                      loadSlots(
                        e.target.value,
                        form.service_id
                      );
                    }}
                  />
                </div>
              </label>

              <label className="full">
                <span>
                  Horários disponíveis
                </span>

                <div className="slotGrid">
                  {slots
                    .filter(
                      (s) => s.available
                    )
                    .map((slot) => (
                      <button
                        type="button"
                        key={slot.time}
                        className={`slotBtn ${
                          form.slot ===
                          slot.time
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setForm({
                            ...form,
                            slot:
                              slot.time,
                          })
                        }
                      >
                        <Clock3 size={14} />
                        {slot.time}
                      </button>
                    ))}
                  {form.date && slots.filter((s) => s.available).length === 0 && (
                    <span className="mutedText">Nenhum horário disponível para esta data.</span>
                  )}
                </div>
              </label>

              <label className="full">
                <span>
                  Observações
                </span>

                <textarea
                  className="input"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes:
                        e.target.value,
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
        ) : (
          <motion.div
            key="success"
            className="bookingSuccess"
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div className="successIcon">
              <CheckCircle2 size={70} />
            </div>

            <span className="successBadge">
              Agendamento enviado
            </span>

            <h2>
              Tudo certo com o
              atendimento 💚
            </h2>

            <p>
              Recebemos sua solicitação
              e entraremos em contato.
            </p>

            <div className="successResume">
              <div>
                <strong>Tutor</strong>
                <span>
                  {form.customer_name}
                </span>
              </div>

              <div>
                <strong>Pet</strong>
                <span>
                  {form.pet_name}
                </span>
              </div>

              <div>
                <strong>Serviço</strong>
                <span>
                  {selectedService?.name ||
                    "Não informado"}
                </span>
              </div>

              <div>
                <strong>Data</strong>
                <span>
                  {form.date} às{" "}
                  {form.slot}
                </span>
              </div>
            </div>

            <div className="heroButtons">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn gold"
              >
                <MessageCircle
                  size={18}
                />
                WhatsApp
              </a>

              <button
                className="btn ghost"
                onClick={() =>
                  window.location.href =
                    "/"
                }
              >
                <CalendarCheck
                  size={18}
                />
                Voltar ao site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  PawPrint,
  Scissors,
} from "lucide-react";

import client from "../api/client";

const whatsappHref =
  "https://wa.me/5518999999999";

export default function PublicBooking() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [success, setSuccess] = useState(false);

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

  const selectedService = useMemo(() => {
    return services.find(
      (s) => String(s.id) === String(form.service_id)
    );
  }, [services, form.service_id]);

  async function submit(e) {
    e.preventDefault();

    if (!form.slot) {
      return toast.error(
        "Selecione um horário"
      );
    }

    setLoading(true);

    try {
      await client.post("/public-booking", {
        customer_name: form.customer_name,
        pet_name: form.pet_name,
        service_id: form.service_id,
        scheduled_at: `${form.date} ${form.slot}:00`,
        notes: form.notes,
      });

      setSuccess(true);

      toast.success(
        "Agendamento enviado!"
      );
    } catch {
      toast.error(
        "Erro ao enviar agendamento"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publicBookingPage">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            className="bookingCard"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
          >
            <div className="sectionTitle">
              <span>
                Agendamento online
              </span>

              <h2>
                Agende o atendimento
                do seu pet
              </h2>
            </div>

            <form
              className="bookingForm"
              onSubmit={submit}
            >
              <label>
                <span>Seu nome</span>

                <input
                  className="input"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_name:
                        e.target.value,
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
                      pet_name:
                        e.target.value,
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
                        service_id:
                          e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Selecione
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      )
                    )}
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
                        date:
                          e.target.value,
                        slot: "",
                      });

                      loadSlots(
                        e.target.value
                      );
                    }}
                  />
                </div>
              </label>

              <label className="full">
                <span>
                  Horários disponíveis
                </span>

                <div className="slotGrid">
                  {slots
                    .filter(
                      (s) => s.available
                    )
                    .map((slot) => (
                      <button
                        type="button"
                        key={slot.time}
                        className={`slotBtn ${
                          form.slot ===
                          slot.time
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setForm({
                            ...form,
                            slot:
                              slot.time,
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
                <span>
                  Observações
                </span>

                <textarea
                  className="input"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes:
                        e.target.value,
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
        ) : (
          <motion.div
            key="success"
            className="bookingSuccess"
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div className="successIcon">
              <CheckCircle2 size={70} />
            </div>

            <span className="successBadge">
              Agendamento enviado
            </span>

            <h2>
              Tudo certo com o
              atendimento 💚
            </h2>

            <p>
              Recebemos sua solicitação
              e entraremos em contato.
            </p>

            <div className="successResume">
              <div>
                <strong>Tutor</strong>
                <span>
                  {form.customer_name}
                </span>
              </div>

              <div>
                <strong>Pet</strong>
                <span>
                  {form.pet_name}
                </span>
              </div>

              <div>
                <strong>Serviço</strong>
                <span>
                  {selectedService?.name ||
                    "Não informado"}
                </span>
              </div>

              <div>
                <strong>Data</strong>
                <span>
                  {form.date} às{" "}
                  {form.slot}
                </span>
              </div>
            </div>

            <div className="heroButtons">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn gold"
              >
                <MessageCircle
                  size={18}
                />
                WhatsApp
              </a>

              <button
                className="btn ghost"
                onClick={() =>
                  window.location.href =
                    "/"
                }
              >
                <CalendarCheck
                  size={18}
                />
                Voltar ao site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
