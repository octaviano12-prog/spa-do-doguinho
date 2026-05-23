import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  PawPrint,
  QrCode,
  Sparkles,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const API_URL = "https://spadodoguinho.com.br/api";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AgendamentoPage() {
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const savedCustomer = localStorage.getItem("spa_customer");
  const token = localStorage.getItem("spa_customer_token");
  const customer = savedCustomer ? JSON.parse(savedCustomer) : null;

  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    pet: "",
    petId: "",
    serviceId: "",
    date: "",
    time: "",
    paymentMethod: "pix",
    notes: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${API_PUBLIC}/services`);
        const data = await response.json();
        if (Array.isArray(data)) setServices(data.filter((item) => Number(item.active ?? 1) === 1));

        if (token) {
          const petsResponse = await fetch(`${API_URL}/customer/pets`, { headers: { Authorization: `Bearer ${token}` } });
          const petsData = await petsResponse.json();
          if (Array.isArray(petsData)) setPets(petsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const selectedService = useMemo(() => services.find((item) => String(item.id) === String(form.serviceId)), [services, form.serviceId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveAppointment() {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Entre ou crie sua conta para salvar o agendamento no painel.");
      return;
    }

    if (!form.serviceId || !form.date || !form.time) {
      setError("Selecione serviço, data e horário.");
      return;
    }

    if (!form.petId && !form.pet) {
      setError("Informe ou selecione o pet.");
      return;
    }

    setSaving(true);
    try {
      let finalPetId = form.petId;
      let finalPetName = form.pet;

      if (!finalPetId && form.pet) {
        const petResponse = await fetch(`${API_URL}/customer/pets`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: form.pet, species: "Cachorro" })
        });
        const petData = await petResponse.json();
        if (!petResponse.ok) throw new Error(petData.error || "Erro ao cadastrar pet.");
        finalPetId = petData.id;
        finalPetName = petData.name;
      }

      const response = await fetch(`${API_URL}/customer/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pet_id: finalPetId || null,
          pet_name: finalPetName || null,
          service_id: form.serviceId,
          date: form.date,
          time: form.time,
          payment_method: form.paymentMethod,
          notes: form.notes
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar agendamento.");

      setSuccess("Agendamento salvo com sucesso! Agora ele aparece no painel admin e na sua área do cliente.");
    } catch (err) {
      setError(err.message || "Erro ao salvar agendamento.");
    } finally {
      setSaving(false);
    }
  }

  function openWhatsApp() {
    const phone = "5518997493722";
    const serviceName = selectedService?.name || "Não selecionado";
    const text = encodeURIComponent(`Olá! Gostaria de agendar no SPA do Doguinho.\nNome: ${form.name}\nTelefone: ${form.phone}\nPet: ${form.pet}\nServiço: ${serviceName}\nData: ${form.date}\nHorário: ${form.time}\nPagamento: ${form.paymentMethod}\nObservações: ${form.notes}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <PublicLayout>
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />
          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black"><CalendarDays size={18} /> Agendamento online</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">Agende o cuidado do seu pet com praticidade.</h1>
              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-2xl">Escolha o serviço, data, horário e pagamento. Cliente logado salva o agendamento diretamente no painel.</p>
              <div className="mt-8 bg-white/10 border border-white/10 rounded-[34px] p-5 shadow-2xl"><img src="/images/banho-tosa.svg" alt="Agendamento pet" className="w-full rounded-[28px]" /></div>
              {!customer && <div className="mt-8 bg-yellow-400/15 border border-yellow-300/30 rounded-3xl p-5 text-yellow-50"><strong>Importante:</strong> para salvar no histórico, entre ou crie sua conta. <Link to="/cliente-login" className="underline font-black">Acessar área do cliente</Link></div>}
              {customer && <div className="mt-8 bg-green-400/15 border border-green-300/30 rounded-3xl p-5 text-green-50"><strong>Cliente logado:</strong> {customer.name}. O agendamento será salvo no sistema.</div>}
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-green-100">
              <div className="flex items-center gap-4 mb-7"><div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><PawPrint size={34} /></div><div><h2 className="text-3xl font-black text-slate-900">Agendamento</h2><p className="text-slate-500">Salve no sistema ou envie pelo WhatsApp</p></div></div>
              <div className="grid gap-4">
                <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome do tutor" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Telefone" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                {pets.length > 0 && <select value={form.petId} onChange={(e) => { updateField("petId", e.target.value); const pet = pets.find((p) => String(p.id) === String(e.target.value)); updateField("pet", pet?.name || ""); }} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"><option value="">Selecionar pet cadastrado</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select>}
                <input value={form.pet} onChange={(e) => { updateField("pet", e.target.value); updateField("petId", ""); }} placeholder="Nome do pet" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                <select value={form.serviceId} onChange={(e) => updateField("serviceId", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"><option value="">Selecione o serviço</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name} - {formatCurrency(service.price)}</option>)}</select>
                <div className="grid grid-cols-2 gap-4"><input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" /><input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" /></div>
                <div className="grid sm:grid-cols-3 gap-3">{[["pix", QrCode, "PIX"], ["card", CreditCard, "Cartão"], ["presencial", User, "Presencial"]].map(([value, Icon, label]) => <button key={value} type="button" onClick={() => updateField("paymentMethod", value)} className={`rounded-2xl p-4 border font-black flex flex-col items-center gap-2 transition ${form.paymentMethod === value ? "bg-green-600 text-white border-green-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-green-400"}`}><Icon size={24} />{label}</button>)}</div>
                <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={4} placeholder="Observações" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
                {selectedService && <div className="bg-green-50 rounded-3xl p-5 border border-green-100"><div className="flex items-center justify-between gap-4"><div><div className="text-sm font-black text-green-700 uppercase">Serviço selecionado</div><div className="text-2xl font-black text-slate-900 mt-1">{selectedService.name}</div><div className="text-slate-500 flex items-center gap-2 mt-2"><Clock size={18} /> {selectedService.duration_minutes || 60} minutos</div></div><div className="text-2xl font-black text-green-700">{formatCurrency(selectedService.price)}</div></div></div>}
                {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 font-bold">{error}</div>}
                {success && <div className="bg-green-50 border border-green-100 text-green-700 rounded-2xl p-4 font-bold">{success}</div>}
                <button type="button" onClick={saveAppointment} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition disabled:opacity-60"><CheckCircle size={20} />{saving ? "Salvando..." : "Confirmar e salvar agendamento"}</button>
                <button type="button" onClick={openWhatsApp} className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition"><MessageCircle size={20} />Enviar pelo WhatsApp</button>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-6 py-20"><div className="grid md:grid-cols-3 gap-6">{[[CheckCircle, "Histórico no painel", "Cada agendamento salvo aparece no admin e na área do cliente."], [Sparkles, "Disponibilidade inteligente", "A estrutura já permite bloquear dias e horários."], [CalendarDays, "Fluxo completo", "Cliente, pet, serviço, pagamento e status em um só lugar."]].map(([Icon, title, text]) => <div key={title} className="bg-white/10 border border-white/10 rounded-3xl p-7 text-white shadow-2xl"><Icon className="text-green-300 mb-4" size={36} /><h3 className="text-2xl font-black">{title}</h3><p className="text-white/60 mt-2">{text}</p></div>)}</div></section>
      </main>
    </PublicLayout>
  );
}
