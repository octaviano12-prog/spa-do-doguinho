import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Home,
  MessageCircle,
  PawPrint,
  QrCode,
  Ruler,
  ShieldCheck,
  Sparkles,
  User,
  Weight
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const API_URL = "https://spadodoguinho.com.br/api";
const steps = ["Pet", "Serviço", "Data", "Pagamento", "Confirmar"];
const defaultPaymentSettings = { pix_enabled: 1, card_enabled: 1, cash_enabled: 1, deposit_required: 0, deposit_percent: 0 };
const dogHero = "/images/dog-hero.png";

const sizeOptions = [
  { value: "small", label: "Pequeno", detail: "até 10 kg", time: "~1h" },
  { value: "medium", label: "Médio", detail: "10 a 25 kg", time: "~1h30" },
  { value: "large", label: "Grande", detail: "25 a 40 kg", time: "~2h" },
  { value: "giant", label: "Gigante", detail: "acima de 40 kg", time: "~2h30" }
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDay(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  });
}

function normalizeSize(value) {
  const size = String(value || "").toLowerCase();
  if (["pequeno", "small"].includes(size)) return "small";
  if (["medio", "médio", "medium"].includes(size)) return "medium";
  if (["grande", "large"].includes(size)) return "large";
  if (["gigante", "giant"].includes(size)) return "giant";
  return "";
}

function sizeFromWeight(weight) {
  const w = Number(String(weight || "").replace(",", "."));
  if (!w) return "";
  if (w <= 10) return "small";
  if (w <= 25) return "medium";
  if (w <= 40) return "large";
  return "giant";
}

function displaySizeFromValue(size) {
  return sizeOptions.find((item) => item.value === size)?.label || "Porte não informado";
}

function petSize(pet, form) {
  return normalizeSize(pet?.size_category) || normalizeSize(form?.petSize) || sizeFromWeight(pet?.weight || form?.petWeight);
}

function servicePriceBySize(service, pet, form) {
  const size = petSize(pet, form);
  return Number(service?.[`price_${size}`] || service?.price || 0);
}

function serviceDurationBySize(service, pet, form) {
  const size = petSize(pet, form);
  const fallbackBySize = { small: 60, medium: 90, large: 120, giant: 150 }[size];
  return Number(service?.[`duration_${size}`] || service?.duration_minutes || pet?.estimated_bath_time || fallbackBySize || 60);
}

function displayPetSize(pet, form) {
  return displaySizeFromValue(petSize(pet, form));
}

function cleanWeight(value) {
  return String(value || "").replace(",", ".");
}

export default function AgendamentoPage() {
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(defaultPaymentSettings);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [error, setError] = useState("");

  const savedCustomer = localStorage.getItem("spa_customer");
  const token = localStorage.getItem("spa_customer_token");
  const customer = savedCustomer ? JSON.parse(savedCustomer) : null;

  const availableDays = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return toISODate(date);
  }), []);

  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    pet: "",
    petId: "",
    petSpecies: "Cachorro",
    petBreed: "",
    petWeight: "",
    petSize: "",
    serviceId: "",
    date: "",
    time: "",
    paymentMethod: "pix",
    notes: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesResponse, settingsResponse] = await Promise.all([
          fetch(`${API_PUBLIC}/services`),
          fetch(`${API_PUBLIC}/payment-settings`).catch(() => null)
        ]);

        const data = await servicesResponse.json();
        if (Array.isArray(data)) setServices(data.filter((item) => Number(item.active ?? 1) === 1));

        if (settingsResponse?.ok) {
          setPaymentSettings({ ...defaultPaymentSettings, ...((await settingsResponse.json()) || {}) });
        }

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
  const selectedSize = useMemo(() => petSize(selectedPet, form), [selectedPet, form]);
  const servicePrice = useMemo(() => servicePriceBySize(selectedService, selectedPet, form), [selectedService, selectedPet, form]);
  const serviceDuration = useMemo(() => serviceDurationBySize(selectedService, selectedPet, form), [selectedService, selectedPet, form]);
  const paymentAmount = useMemo(() => Number(paymentSettings.deposit_required || 0) && Number(paymentSettings.deposit_percent || 0) > 0 ? servicePrice * Number(paymentSettings.deposit_percent || 0) / 100 : servicePrice, [servicePrice, paymentSettings]);
  const paymentOptions = useMemo(() => [
    [Number(paymentSettings.pix_enabled ?? 1) ? "pix" : null, QrCode, "PIX", "Pagamento via PIX com QR Code."],
    [Number(paymentSettings.card_enabled ?? 1) ? "card" : null, CreditCard, "Cartão", "Pagamento com cartão online ou presencial."],
    [Number(paymentSettings.cash_enabled ?? 1) ? "presencial" : null, User, "Presencial", "Pagar no atendimento."]
  ].filter(([value]) => Boolean(value)), [paymentSettings]);

  useEffect(() => {
    if (paymentOptions.length && !paymentOptions.some(([value]) => value === form.paymentMethod)) {
      updateField("paymentMethod", paymentOptions[0][0]);
    }
  }, [paymentOptions]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.serviceId || !form.date) {
        setSlots([]);
        setSlotsMessage("");
        return;
      }

      setSlotsLoading(true);
      setSlotsMessage("");
      setSlots([]);

      try {
        const response = await fetch(`${API_PUBLIC}/available-slots?service_id=${form.serviceId}&date=${form.date}&duration=${serviceDuration}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao carregar horários.");
        setSlots(Array.isArray(data.slots) ? data.slots : []);
        if (data.blocked) setSlotsMessage(data.reason || "Data bloqueada.");
        else if (!data.slots?.length) setSlotsMessage(data.reason || "Nenhum horário disponível neste dia.");
      } catch (err) {
        setSlotsMessage(err.message || "Erro ao carregar horários.");
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [form.serviceId, form.date, serviceDuration]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function selectSavedPet(pet) {
    const size = normalizeSize(pet?.size_category) || sizeFromWeight(pet?.weight);
    setForm((current) => ({
      ...current,
      petId: pet.id,
      pet: pet.name || "",
      petSpecies: pet.species || "Cachorro",
      petBreed: pet.breed || "",
      petWeight: pet.weight || "",
      petSize: size,
      date: "",
      time: ""
    }));
    setError("");
  }

  function canContinue() {
    if (step === 0) return Boolean((form.petId || form.pet) && (selectedSize || form.petWeight));
    if (step === 1) return Boolean(form.serviceId);
    if (step === 2) return Boolean(form.date && form.time);
    if (step === 3) return Boolean(form.paymentMethod);
    return true;
  }

  function nextStep() {
    if (!canContinue()) {
      setError(step === 0 ? "Informe o pet e o peso ou porte para calcular o valor corretamente." : "Preencha esta etapa antes de continuar.");
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
          body: JSON.stringify({
            name: form.pet,
            species: form.petSpecies || "Cachorro",
            breed: form.petBreed || null,
            weight: cleanWeight(form.petWeight) || null,
            size_category: selectedSize || form.petSize || null,
            estimated_bath_time: serviceDuration
          })
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
          price: servicePrice,
          total_price: servicePrice,
          duration_minutes: serviceDuration,
          notes: `${form.notes || ""}${form.petWeight ? `\nPeso informado: ${form.petWeight} kg` : ""}${selectedSize ? `\nPorte: ${displaySizeFromValue(selectedSize)}` : ""}`.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar agendamento.");
      setConfirmedAppointment(data);
      setSuccess("Agendamento salvo com sucesso!");
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
    const text = encodeURIComponent(`Olá! Gostaria de agendar no SPA do Doguinho.\nNome: ${form.name}\nTelefone: ${form.phone}\nPet: ${petName}\nEspécie: ${form.petSpecies}\nRaça: ${form.petBreed || "Não informada"}\nPeso: ${form.petWeight || selectedPet?.weight || "Não informado"} kg\nPorte: ${displayPetSize(selectedPet, form)}\nServiço: ${serviceName}\nValor: ${formatCurrency(servicePrice)}\nTempo: ${serviceDuration} min\nData: ${form.date}\nHorário: ${form.time}\nPagamento: ${form.paymentMethod}\nObservações: ${form.notes}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function copyPixCode() {
    const code = confirmedAppointment?.payment?.qr_code;
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setSuccess("Código PIX copiado.");
  }

  function resetFlow() {
    setConfirmedAppointment(null);
    setSuccess("");
    setError("");
    setStep(0);
    setForm({
      name: customer?.name || "",
      phone: customer?.phone || "",
      pet: "",
      petId: "",
      petSpecies: "Cachorro",
      petBreed: "",
      petWeight: "",
      petSize: "",
      serviceId: "",
      date: "",
      time: "",
      paymentMethod: paymentOptions[0]?.[0] || "presencial",
      notes: ""
    });
  }

  const hasRealPix = Boolean(confirmedAppointment?.payment?.qr_code || confirmedAppointment?.payment?.qr_code_base64 || confirmedAppointment?.payment?.ticket_url);
  const paymentInstruction = form.paymentMethod === "pix"
    ? hasRealPix
      ? "PIX gerado com sucesso. Pague pelo QR Code ou copie o código PIX abaixo."
      : "Seu agendamento foi registrado e o pagamento PIX ficou pendente. Configure o Access Token do Mercado Pago para gerar QR Code real."
    : form.paymentMethod === "card"
      ? "Seu agendamento foi registrado com pagamento por cartão."
      : "Seu agendamento foi registrado. O pagamento será feito presencialmente no atendimento.";

  return (
    <PublicLayout>
      <main className="relative min-h-screen overflow-hidden bg-[#03160d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(70,170,93,.45),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(204,169,91,.22),transparent_25%),linear-gradient(135deg,#03160d,#082a18_50%,#03140c)]" />
        <div className="absolute -left-16 top-28 h-72 w-72 rounded-full bg-green-700/20 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-yellow-700/10 blur-3xl" />

        <section className="relative px-4 pb-20 pt-8 md:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_560px]">
            <aside className="pt-6 text-white lg:pt-16">
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black text-green-50 transition hover:bg-white/15">
                  <Home size={18} /> Voltar para o site
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/10 px-5 py-3 font-black text-yellow-100 shadow-lg">
                  <PawPrint size={18} /> Agendamento premium
                </span>
              </div>

              <h1 className="mt-8 text-5xl font-black leading-[.98] tracking-tight md:text-7xl">
                Reserve o cuidado ideal para o seu pet.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Preencha os dados do pet, escolha o serviço e veja valor e tempo mudarem conforme peso e porte.
              </p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
                <Mini icon={CalendarDays} title="Agenda" text="rápida" />
                <Mini icon={Weight} title="Peso" text="calcula porte" />
                <Mini icon={ShieldCheck} title="Ambiente" text="seguro" />
              </div>

              <div className="relative mt-10 hidden lg:block">
                <div className="absolute inset-x-24 bottom-0 h-24 rounded-full bg-black/40 blur-2xl" />
                <img src={dogHero} alt="Cachorro feliz" className="relative mx-auto h-[360px] w-[360px] rounded-full border border-yellow-300/25 object-cover shadow-2xl" onError={(event) => { event.currentTarget.src = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=90"; }} />
              </div>
            </aside>

            <section className="rounded-[38px] border border-yellow-700/20 bg-[#fffaf0] p-5 shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-8">
              {confirmedAppointment ? (
                <SuccessView form={form} selectedPet={selectedPet} selectedService={selectedService} paymentAmount={paymentAmount} confirmedAppointment={confirmedAppointment} paymentInstruction={paymentInstruction} copyPixCode={copyPixCode} success={success} openWhatsApp={openWhatsApp} resetFlow={resetFlow} />
              ) : (
                <>
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-green-700 shadow-inner">
                      <PawPrint size={34} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-950">Agendar atendimento</h2>
                      <p className="font-semibold text-slate-500">Etapa {step + 1} de {steps.length}</p>
                    </div>
                  </div>

                  <div className="mb-8 grid grid-cols-5 gap-2 rounded-3xl border border-yellow-900/10 bg-white/70 p-2">
                    {steps.map((item, index) => (
                      <button key={item} type="button" onClick={() => setStep(index)} className={`rounded-2xl px-2 py-3 text-xs font-black transition md:text-sm ${index === step ? "bg-green-700 text-white shadow-lg" : index < step ? "bg-green-100 text-green-700" : "text-slate-400 hover:bg-white"}`}>
                        {item}
                      </button>
                    ))}
                  </div>

                  {step === 0 && <PetStep form={form} updateField={updateField} pets={pets} selectedPet={selectedPet} selectSavedPet={selectSavedPet} selectedSize={selectedSize} />}
                  {step === 1 && <ServiceStep services={services} form={form} updateField={updateField} selectedPet={selectedPet} selectedSize={selectedSize} loading={loading} />}
                  {step === 2 && <DateStep availableDays={availableDays} form={form} updateField={updateField} serviceDuration={serviceDuration} slotsLoading={slotsLoading} slotsMessage={slotsMessage} slots={slots} />}
                  {step === 3 && <PaymentStep paymentOptions={paymentOptions} form={form} updateField={updateField} paymentSettings={paymentSettings} paymentAmount={paymentAmount} />}
                  {step === 4 && <ConfirmStep form={form} selectedPet={selectedPet} selectedService={selectedService} selectedSize={selectedSize} serviceDuration={serviceDuration} paymentAmount={paymentAmount} error={error} success={success} saveAppointment={saveAppointment} saving={saving} openWhatsApp={openWhatsApp} />}

                  {error && step !== 4 && <Alert type="error" text={error} />}

                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-yellow-900/10 pt-6">
                    <button onClick={previousStep} disabled={step === 0} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-700 shadow-sm disabled:opacity-40">
                      <ArrowLeft size={18} /> Voltar
                    </button>
                    {step < steps.length - 1 && (
                      <button onClick={nextStep} className="flex items-center gap-2 rounded-2xl bg-green-700 px-6 py-4 font-black text-white shadow-lg hover:bg-green-800">
                        Continuar <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function Mini({ icon: Icon, title, text }) {
  return <div className="rounded-3xl border border-yellow-400/20 bg-white/10 p-4 text-center"><Icon className="mx-auto text-yellow-300" /><b className="mt-3 block text-yellow-100">{title}</b><span className="text-sm text-white/70">{text}</span></div>;
}

function Info({ label, value }) {
  return <div className="rounded-3xl border border-yellow-900/10 bg-white p-5"><div className="text-xs font-black uppercase text-slate-400">{label}</div><div className="break-words text-xl font-black text-slate-900">{value}</div></div>;
}

function Alert({ type, text }) {
  return <div className={`${type === "error" ? "border-red-100 bg-red-50 text-red-700" : "border-green-100 bg-green-50 text-green-700"} mt-5 rounded-2xl border p-4 font-bold`}>{text}</div>;
}

function PetStep({ form, updateField, pets, selectSavedPet, selectedSize }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Dados completos do pet</h3>
        <p className="mt-2 font-semibold text-slate-500">O peso ajuda o sistema a calcular porte, preço e duração do banho/tosa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome do tutor" className="input-premium" />
        <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Telefone do tutor" className="input-premium" />
      </div>

      {pets.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-black uppercase text-slate-400">Pets já cadastrados</div>
          <div className="grid gap-4 md:grid-cols-2">
            {pets.map((pet) => (
              <button key={pet.id} type="button" onClick={() => selectSavedPet(pet)} className={`rounded-3xl border p-5 text-left transition ${String(form.petId) === String(pet.id) ? "border-green-700 bg-green-700 text-white shadow-lg" : "border-yellow-900/10 bg-white text-slate-800 hover:border-green-400"}`}>
                <PawPrint className="mb-3" />
                <div className="text-xl font-black">{pet.name}</div>
                <div className="opacity-70">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div>
                <div className="mt-2 text-sm font-black opacity-80">{displayPetSize(pet, form)} {pet.weight ? `• ${pet.weight} kg` : ""}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[30px] border border-yellow-900/10 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.pet} onChange={(e) => { updateField("pet", e.target.value); updateField("petId", ""); }} placeholder="Nome do pet" className="input-premium" />
          <select value={form.petSpecies} onChange={(e) => updateField("petSpecies", e.target.value)} className="input-premium">
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Outro">Outro</option>
          </select>
          <input value={form.petBreed} onChange={(e) => updateField("petBreed", e.target.value)} placeholder="Raça / pelagem" className="input-premium" />
          <input value={form.petWeight} onChange={(e) => { const weight = e.target.value; updateField("petWeight", weight); updateField("petSize", sizeFromWeight(weight)); }} placeholder="Peso aproximado em kg" inputMode="decimal" className="input-premium" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {sizeOptions.map((item) => (
            <button key={item.value} type="button" onClick={() => updateField("petSize", item.value)} className={`rounded-2xl border p-4 text-left transition ${selectedSize === item.value ? "border-green-700 bg-green-700 text-white shadow-lg" : "border-slate-100 bg-slate-50 text-slate-700 hover:border-green-300"}`}>
              <Ruler size={20} />
              <div className="mt-2 font-black">{item.label}</div>
              <div className="text-xs opacity-70">{item.detail}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-green-100 bg-green-50 p-5 text-green-800">
        <div className="flex items-center gap-3 font-black"><Weight size={22} /> Porte calculado: {displaySizeFromValue(selectedSize)}</div>
        <p className="mt-2 text-sm font-semibold text-green-700">Você pode informar o peso ou selecionar manualmente o porte.</p>
      </div>
    </div>
  );
}

function ServiceStep({ services, form, updateField, selectedPet, selectedSize, loading }) {
  return (
    <div className="space-y-5">
      <h3 className="text-3xl font-black text-slate-950">Escolha o serviço</h3>
      <div className="rounded-3xl border border-green-100 bg-green-50 p-5 font-bold text-green-800">
        Pet: {selectedPet?.name || form.pet || "novo pet"} • Porte: {displaySizeFromValue(selectedSize)}
      </div>
      {loading && <div className="text-slate-500">Carregando serviços...</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const price = servicePriceBySize(service, selectedPet, form);
          const duration = serviceDurationBySize(service, selectedPet, form);
          return (
            <button key={service.id} type="button" onClick={() => { updateField("serviceId", service.id); updateField("date", ""); updateField("time", ""); }} className={`rounded-3xl border p-5 text-left transition ${String(form.serviceId) === String(service.id) ? "border-green-700 bg-green-700 text-white shadow-lg" : "border-yellow-900/10 bg-white text-slate-800 hover:border-green-400"}`}>
              <Sparkles className="mb-3" />
              <div className="text-xl font-black">{service.name}</div>
              <div className="mt-1 opacity-70">{duration} min conforme porte</div>
              <div className="mt-3 text-2xl font-black">{formatCurrency(price)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateStep({ availableDays, form, updateField, serviceDuration, slotsLoading, slotsMessage, slots }) {
  return (
    <div className="space-y-5">
      <h3 className="text-3xl font-black text-slate-950">Data e horário</h3>
      <p className="font-bold text-slate-500">Tempo estimado: {serviceDuration} minutos.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {availableDays.map((day) => (
          <button key={day} type="button" onClick={() => { updateField("date", day); updateField("time", ""); }} className={`rounded-2xl border p-4 font-black transition ${form.date === day ? "border-green-700 bg-green-700 text-white" : "border-yellow-900/10 bg-white text-slate-700 hover:border-green-400"}`}>
            <CalendarDays size={20} className="mb-2" />{formatDay(day)}
          </button>
        ))}
      </div>
      {form.date && (
        <div className="mt-6">
          <h4 className="mb-3 text-xl font-black text-slate-900">Horários livres</h4>
          {slotsLoading && <div className="rounded-2xl bg-white p-5 font-bold text-slate-500">Buscando horários...</div>}
          {!slotsLoading && slotsMessage && <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 font-bold text-yellow-800">{slotsMessage}</div>}
          {!slotsLoading && slots.length > 0 && <div className="grid grid-cols-3 gap-3 md:grid-cols-5">{slots.map((slot) => <button key={slot.time} type="button" onClick={() => updateField("time", slot.time)} className={`rounded-2xl border p-4 font-black transition ${form.time === slot.time ? "border-green-700 bg-green-700 text-white" : "border-yellow-900/10 bg-white text-slate-700 hover:border-green-400"}`}><Clock size={18} className="mx-auto mb-2" />{slot.label}</button>)}</div>}
        </div>
      )}
    </div>
  );
}

function PaymentStep({ paymentOptions, form, updateField, paymentSettings, paymentAmount }) {
  return (
    <div className="space-y-5">
      <h3 className="text-3xl font-black text-slate-950">Forma de pagamento</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {paymentOptions.map(([value, Icon, label, description]) => (
          <button key={value} type="button" onClick={() => updateField("paymentMethod", value)} className={`rounded-3xl border p-5 text-left transition ${form.paymentMethod === value ? "border-green-700 bg-green-700 text-white shadow-lg" : "border-yellow-900/10 bg-white text-slate-800 hover:border-green-400"}`}>
            <Icon size={30} className="mb-4" />
            <div className="text-xl font-black">{label}</div>
            <div className="mt-2 text-sm opacity-75">{description}</div>
          </button>
        ))}
      </div>
      {Number(paymentSettings.deposit_required || 0) ? <div className="rounded-3xl border border-green-100 bg-green-50 p-5 font-bold text-green-800">Será cobrado sinal de {paymentSettings.deposit_percent}%: {formatCurrency(paymentAmount)}.</div> : null}
      <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={4} placeholder="Observações para o atendimento" className="input-premium w-full" />
    </div>
  );
}

function ConfirmStep({ form, selectedPet, selectedService, selectedSize, serviceDuration, paymentAmount, error, success, saveAppointment, saving, openWhatsApp }) {
  return (
    <div className="space-y-5">
      <h3 className="text-3xl font-black text-slate-950">Confirmar agendamento</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Pet" value={selectedPet?.name || form.pet || "Não informado"} />
        <Info label="Porte/Peso" value={`${displaySizeFromValue(selectedSize)}${form.petWeight ? ` • ${form.petWeight} kg` : ""}`} />
        <Info label="Serviço" value={selectedService?.name || "Não selecionado"} />
        <Info label="Data/Hora" value={`${form.date || "--"} às ${form.time || "--"}`} />
      </div>
      {selectedService && <div className="flex items-center justify-between gap-4 rounded-3xl border border-green-100 bg-green-50 p-5"><div><div className="text-sm font-black uppercase text-green-700">Valor</div><div className="mt-2 flex items-center gap-2 text-slate-500"><Clock size={18} /> {serviceDuration} minutos</div></div><div className="text-3xl font-black text-green-700">{formatCurrency(paymentAmount)}</div></div>}
      {error && <Alert type="error" text={error} />}
      {success && <Alert type="success" text={success} />}
      <button onClick={saveAppointment} disabled={saving} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-700 py-5 text-lg font-black text-white shadow-lg transition hover:bg-green-800 disabled:opacity-60"><CheckCircle size={20} />{saving ? "Salvando..." : "Confirmar e salvar agendamento"}</button>
      <button onClick={openWhatsApp} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:bg-slate-800"><MessageCircle size={20} />Enviar pelo WhatsApp</button>
    </div>
  );
}

function SuccessView({ form, selectedPet, selectedService, paymentAmount, confirmedAppointment, paymentInstruction, copyPixCode, success, openWhatsApp, resetFlow }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[34px] border border-green-100 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-white shadow-xl"><CheckCircle size={42} /></div>
        <h2 className="mt-6 text-4xl font-black text-slate-950">Agendamento confirmado!</h2>
        <p className="mt-3 font-bold text-slate-500">Seu horário foi salvo no SPA do Doguinho.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Pet" value={selectedPet?.name || form.pet} />
        <Info label="Serviço" value={selectedService?.name} />
        <Info label="Data e horário" value={`${form.date} às ${form.time}`} />
        <Info label="Pagamento" value={`${form.paymentMethod.toUpperCase()} • ${formatCurrency(confirmedAppointment?.payment?.amount || paymentAmount)}`} />
      </div>
      <div className="rounded-3xl border border-green-100 bg-green-50 p-6 font-bold text-green-800">{paymentInstruction}</div>
      {form.paymentMethod === "pix" && <div className="space-y-4 rounded-[30px] border-2 border-dashed border-green-200 bg-white p-8 text-center">{confirmedAppointment?.payment?.qr_code_base64 ? <img src={`data:image/png;base64,${confirmedAppointment.payment.qr_code_base64}`} alt="QR Code PIX" className="mx-auto h-64 w-64 rounded-2xl border object-contain" /> : <QrCode size={70} className="mx-auto text-green-700" />}<h3 className="text-2xl font-black text-slate-900">PIX para pagamento</h3>{confirmedAppointment?.payment?.qr_code && <div className="break-all rounded-2xl border bg-slate-50 p-4 text-left text-xs text-slate-600">{confirmedAppointment.payment.qr_code}</div>}{confirmedAppointment?.payment?.qr_code && <button onClick={copyPixCode} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-6 py-4 font-black text-white hover:bg-green-800"><Copy size={18} /> Copiar PIX</button>}</div>}
      {success && <Alert type="success" text={success} />}
      <div className="grid gap-3 md:grid-cols-3"><Link to="/cliente" className="rounded-2xl bg-green-700 py-4 text-center font-black text-white hover:bg-green-800">Área do Cliente</Link><button onClick={openWhatsApp} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-black text-white hover:bg-slate-800"><MessageCircle size={20} /> WhatsApp</button><button onClick={resetFlow} className="rounded-2xl bg-white py-4 font-black text-slate-800 hover:bg-slate-100">Novo agendamento</button></div>
    </div>
  );
}
