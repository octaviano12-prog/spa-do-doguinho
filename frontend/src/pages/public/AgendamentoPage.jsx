import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
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

const steps = ["Pet", "Serviço", "Data", "Pagamento", "Confirmar"];

export default function AgendamentoPage() {
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
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
  const selectedPet = useMemo(() => pets.find((item) => String(item.id) === String(form.petId)), [pets, form.petId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function canContinue() {
    if (step === 0) return Boolean(form.petId || form.pet);
    if (step === 1) return Boolean(form.serviceId);
    if (step === 2) return Boolean(form.date && form.time);
    if (step === 3) return Boolean(form.paymentMethod);
    return true;
  }

  function nextStep() {
    if (!canContinue()) {
      setError("Preencha esta etapa antes de continuar.");
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
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
    const petName = selectedPet?.name || form.pet;
    const text = encodeURIComponent(`Olá! Gostaria de agendar no SPA do Doguinho.\nNome: ${form.name}\nTelefone: ${form.phone}\nPet: ${petName}\nServiço: ${serviceName}\nData: ${form.date}\nHorário: ${form.time}\nPagamento: ${form.paymentMethod}\nObservações: ${form.notes}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  const paymentOptions = [
    ["pix", QrCode, "PIX", "Salvar como PIX. QR Code real será ligado ao Mercado Pago."],
    ["card", CreditCard, "Cartão", "Salvar como cartão. Cobrança online será ligada depois."],
    ["presencial", User, "Presencial", "Pagar no atendimento."]
  ];

  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#06150d]">
        <section className="relative px-4 md:px-6 pt-10 pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />
          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[420px_1fr] gap-8 items-start">
            <aside className="lg:sticky lg:top-28 space-y-5">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black"><CalendarDays size={18} /> Agendamento online</span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">Agende em poucos passos.</h1>
              <p className="text-white/70 text-lg leading-relaxed">Fluxo otimizado para celular: pet, serviço, data, pagamento e confirmação.</p>
              <div className="bg-white/10 border border-white/10 rounded-[34px] p-5 shadow-2xl hidden lg:block"><img src="/images/banho-tosa.svg" alt="Agendamento pet" className="w-full rounded-[28px]" /></div>
              {!customer && <div className="bg-yellow-400/15 border border-yellow-300/30 rounded-3xl p-5 text-yellow-50"><strong>Importante:</strong> para salvar no histórico, entre ou crie sua conta. <Link to="/cliente-login" className="underline font-black">Acessar área do cliente</Link></div>}
              {customer && <div className="bg-green-400/15 border border-green-300/30 rounded-3xl p-5 text-green-50"><strong>Cliente logado:</strong> {customer.name}</div>}
            </aside>

            <section className="bg-white rounded-[34px] md:rounded-[44px] p-5 md:p-8 shadow-2xl border border-green-100">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><PawPrint size={30} /></div>
                <div><h2 className="text-2xl md:text-3xl font-black text-slate-900">Agendamento</h2><p className="text-slate-500">Etapa {step + 1} de {steps.length}</p></div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-8">
                {steps.map((item, index) => <button key={item} type="button" onClick={() => setStep(index)} className={`rounded-2xl px-2 py-3 text-xs md:text-sm font-black transition ${index === step ? "bg-green-600 text-white" : index < step ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>{item}</button>)}
              </div>

              {step === 0 && <div className="space-y-5">
                <h3 className="text-3xl font-black text-slate-900">Quem é o pet?</h3>
                <div className="grid md:grid-cols-2 gap-4"><input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome do tutor" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" /><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Telefone" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" /></div>
                {pets.length > 0 && <div className="grid md:grid-cols-2 gap-4">{pets.map((pet) => <button key={pet.id} type="button" onClick={() => { updateField("petId", pet.id); updateField("pet", pet.name); }} className={`text-left rounded-3xl p-5 border transition ${String(form.petId) === String(pet.id) ? "bg-green-600 text-white border-green-600" : "bg-slate-50 text-slate-800 border-slate-200 hover:border-green-400"}`}><PawPrint className="mb-3" /><div className="font-black text-xl">{pet.name}</div><div className="opacity-70">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div></button>)}</div>}
                <input value={form.pet} onChange={(e) => { updateField("pet", e.target.value); updateField("petId", ""); }} placeholder="Ou digite o nome do pet" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
              </div>}

              {step === 1 && <div className="space-y-5">
                <h3 className="text-3xl font-black text-slate-900">Escolha o serviço</h3>
                {loading && <div className="text-slate-500">Carregando serviços...</div>}
                <div className="grid md:grid-cols-2 gap-4">{services.map((service) => <button key={service.id} type="button" onClick={() => updateField("serviceId", service.id)} className={`text-left rounded-3xl p-5 border transition ${String(form.serviceId) === String(service.id) ? "bg-green-600 text-white border-green-600" : "bg-slate-50 text-slate-800 border-slate-200 hover:border-green-400"}`}><Sparkles className="mb-3" /><div className="font-black text-xl">{service.name}</div><div className="opacity-70 mt-1">{service.duration_minutes || 60} min</div><div className="font-black text-2xl mt-3">{formatCurrency(service.price)}</div></button>)}</div>
              </div>}

              {step === 2 && <div className="space-y-5">
                <h3 className="text-3xl font-black text-slate-900">Data e horário</h3>
                <div className="grid md:grid-cols-2 gap-4"><input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 outline-none text-slate-900 focus:border-green-500 text-lg" /><input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 outline-none text-slate-900 focus:border-green-500 text-lg" /></div>
                <div className="bg-green-50 rounded-3xl p-5 border border-green-100 text-green-800 font-bold">Em breve, esta etapa vai mostrar apenas horários liberados pela tela de Disponibilidade.</div>
              </div>}

              {step === 3 && <div className="space-y-5">
                <h3 className="text-3xl font-black text-slate-900">Forma de pagamento</h3>
                <div className="grid md:grid-cols-3 gap-4">{paymentOptions.map(([value, Icon, label, description]) => <button key={value} type="button" onClick={() => updateField("paymentMethod", value)} className={`text-left rounded-3xl p-5 border transition ${form.paymentMethod === value ? "bg-green-600 text-white border-green-600" : "bg-slate-50 text-slate-800 border-slate-200 hover:border-green-400"}`}><Icon size={30} className="mb-4" /><div className="font-black text-xl">{label}</div><div className="text-sm opacity-75 mt-2">{description}</div></button>)}</div>
                <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={4} placeholder="Observações para o atendimento" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500" />
              </div>}

              {step === 4 && <div className="space-y-5">
                <h3 className="text-3xl font-black text-slate-900">Confirmar agendamento</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-3xl p-5 border"><div className="text-slate-400 font-black text-xs uppercase">Pet</div><div className="font-black text-slate-900 text-xl">{selectedPet?.name || form.pet || "Não informado"}</div></div>
                  <div className="bg-slate-50 rounded-3xl p-5 border"><div className="text-slate-400 font-black text-xs uppercase">Serviço</div><div className="font-black text-slate-900 text-xl">{selectedService?.name || "Não selecionado"}</div></div>
                  <div className="bg-slate-50 rounded-3xl p-5 border"><div className="text-slate-400 font-black text-xs uppercase">Data/Hora</div><div className="font-black text-slate-900 text-xl">{form.date || "--"} às {form.time || "--"}</div></div>
                  <div className="bg-slate-50 rounded-3xl p-5 border"><div className="text-slate-400 font-black text-xs uppercase">Pagamento</div><div className="font-black text-slate-900 text-xl">{form.paymentMethod.toUpperCase()}</div></div>
                </div>
                {selectedService && <div className="bg-green-50 rounded-3xl p-5 border border-green-100 flex items-center justify-between gap-4"><div><div className="text-sm font-black text-green-700 uppercase">Valor</div><div className="text-slate-500 flex items-center gap-2 mt-2"><Clock size={18} /> {selectedService.duration_minutes || 60} minutos</div></div><div className="text-3xl font-black text-green-700">{formatCurrency(selectedService.price)}</div></div>}
                {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 font-bold">{error}</div>}
                {success && <div className="bg-green-50 border border-green-100 text-green-700 rounded-2xl p-4 font-bold">{success}</div>}
                <button type="button" onClick={saveAppointment} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition disabled:opacity-60"><CheckCircle size={20} />{saving ? "Salvando..." : "Confirmar e salvar agendamento"}</button>
                <button type="button" onClick={openWhatsApp} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition"><MessageCircle size={20} />Enviar pelo WhatsApp</button>
              </div>}

              {error && step !== 4 && <div className="mt-6 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 font-bold">{error}</div>}

              <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={previousStep} disabled={step === 0} className="px-5 py-4 rounded-2xl font-black bg-slate-100 text-slate-700 disabled:opacity-40 flex items-center gap-2"><ArrowLeft size={18} /> Voltar</button>
                {step < steps.length - 1 && <button type="button" onClick={nextStep} className="px-6 py-4 rounded-2xl font-black bg-green-600 text-white flex items-center gap-2">Continuar <ArrowRight size={18} /></button>}
              </div>
            </section>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
