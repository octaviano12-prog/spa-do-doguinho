import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Lock,
  MessageCircle,
  PawPrint,
  QrCode,
  ShieldCheck,
  Sparkles,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function AgendamentoPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pet: "",
    serviceId: "",
    date: "",
    time: "",
    paymentMethod: "pix",
    notes: ""
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_PUBLIC}/services`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setServices(data.filter((item) => Number(item.active ?? 1) === 1));
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const selectedService = useMemo(() => {
    return services.find((item) => String(item.id) === String(form.serviceId));
  }, [services, form.serviceId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildMessage() {
    const serviceName = selectedService?.name || "Não selecionado";
    const price = selectedService?.price ? formatCurrency(selectedService.price) : "A confirmar";
    const payment = {
      pix: "PIX",
      card: "Cartão",
      presencial: "Pagamento presencial"
    }[form.paymentMethod] || form.paymentMethod;

    return [
      "Olá! Gostaria de agendar um atendimento no SPA do Doguinho.",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Pet: ${form.pet}`,
      `Serviço: ${serviceName}`,
      `Valor: ${price}`,
      `Data: ${form.date}`,
      `Horário: ${form.time}`,
      `Pagamento: ${payment}`,
      `Observações: ${form.notes}`
    ].join("\n");
  }

  function openWhatsApp() {
    const phone = "5518997493722";
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <PublicLayout>
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <CalendarDays size={18} />
                Agendamento online
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">
                Agende o cuidado do seu pet com praticidade.
              </h1>

              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-2xl">
                Escolha o serviço, informe os dados do pet e selecione a forma de pagamento. A estrutura está preparada para login do cliente, histórico e pagamentos online.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-10">
                {[
                  [Lock, "Login do cliente", "Histórico completo"],
                  [QrCode, "PIX", "Pagamento online"],
                  [ShieldCheck, "Agenda segura", "Disponibilidade real"]
                ].map(([Icon, title, text]) => (
                  <div key={title} className="bg-white/10 border border-white/10 rounded-3xl p-5 text-white">
                    <Icon className="text-green-300 mb-4" size={32} />
                    <div className="font-black">{title}</div>
                    <div className="text-white/55 text-sm mt-1">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-green-100">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                  <PawPrint size={34} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Pré-agendamento</h2>
                  <p className="text-slate-500">Envie os dados para confirmação</p>
                </div>
              </div>

              <div className="grid gap-4">
                <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome do tutor" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Telefone" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                <input value={form.pet} onChange={(e) => updateField("pet", e.target.value)} placeholder="Nome do pet" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />

                <select value={form.serviceId} onChange={(e) => updateField("serviceId", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500">
                  <option value="">Selecione o serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(service.price)}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                  <input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    ["pix", QrCode, "PIX"],
                    ["card", CreditCard, "Cartão"],
                    ["presencial", User, "Presencial"]
                  ].map(([value, Icon, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateField("paymentMethod", value)}
                      className={`rounded-2xl p-4 border font-black flex flex-col items-center gap-2 transition ${
                        form.paymentMethod === value ? "bg-green-600 text-white border-green-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-green-400"
                      }`}
                    >
                      <Icon size={24} />
                      {label}
                    </button>
                  ))}
                </div>

                <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={4} placeholder="Observações" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />

                {selectedService && (
                  <div className="bg-green-50 rounded-3xl p-5 border border-green-100">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-green-700 uppercase">Serviço selecionado</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">{selectedService.name}</div>
                        <div className="text-slate-500 flex items-center gap-2 mt-2"><Clock size={18} /> {selectedService.duration_minutes || 60} minutos</div>
                      </div>
                      <div className="text-2xl font-black text-green-700">{formatCurrency(selectedService.price)}</div>
                    </div>
                  </div>
                )}

                <button type="button" onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition">
                  <MessageCircle size={20} />
                  Enviar pré-agendamento
                </button>

                <Link to="/login" className="text-center text-slate-500 hover:text-green-700 font-bold transition">
                  Já tem conta? Entrar no painel
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              [CheckCircle, "Histórico no painel", "Cada agendamento será registrado para consulta futura."],
              [Sparkles, "Disponibilidade inteligente", "Bloqueios, feriados e horários serão respeitados."],
              [CalendarDays, "Fluxo completo", "Cliente, pet, serviço, pagamento e status em um só lugar."]
            ].map(([Icon, title, text]) => (
              <div key={title} className="bg-white/10 border border-white/10 rounded-3xl p-7 text-white shadow-2xl">
                <Icon className="text-green-300 mb-4" size={36} />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="text-white/60 mt-2">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
