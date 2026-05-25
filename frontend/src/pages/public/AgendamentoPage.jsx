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
  ExternalLink,
  Heart,
  LogIn,
  MessageCircle,
  PawPrint,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
  Wallet
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const API_URL = "https://spadodoguinho.com.br/api";

const steps = [
  { label: "Pet", icon: PawPrint },
  { label: "Serviço", icon: Sparkles },
  { label: "Data", icon: CalendarDays },
  { label: "Pagamento", icon: CreditCard },
  { label: "Confirmar", icon: CheckCircle }
];

const defaultPaymentSettings = {
  pix_enabled: 1,
  card_enabled: 1,
  cash_enabled: 1,
  deposit_required: 0,
  deposit_percent: 0
};
const fieldClassName =
  "w-full rounded-2xl border border-[#d7eadf] bg-white px-5 py-4 text-[#12382f] outline-none transition focus:border-[#0d6b54] focus:ring-4 focus:ring-emerald-900/10";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
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

function servicePriceBySize(service, pet) {
  const size = normalizeSize(pet?.size_category) || sizeFromWeight(pet?.weight);
  return Number(service?.[`price_${size}`] || service?.price || 0);
}

function serviceDurationBySize(service, pet) {
  const size = normalizeSize(pet?.size_category) || sizeFromWeight(pet?.weight);
  return Number(service?.[`duration_${size}`] || service?.duration_minutes || pet?.estimated_bath_time || 60);
}

function displayPetSize(pet) {
  const size = normalizeSize(pet?.size_category) || sizeFromWeight(pet?.weight);
  return {
    small: "Pequeno",
    medium: "Médio",
    large: "Grande",
    giant: "Gigante"
  }[size] || "Porte não informado";
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
  const availableDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        return toISODate(date);
      }),
    []
  );

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
        const [servicesResponse, settingsResponse] = await Promise.all([
          fetch(`${API_PUBLIC}/services`),
          fetch(`${API_PUBLIC}/payment-settings`).catch(() => null)
        ]);
        const data = await servicesResponse.json();

        if (Array.isArray(data)) {
          setServices(data.filter((item) => Number(item.active ?? 1) === 1));
        }

        if (settingsResponse?.ok) {
          setPaymentSettings({
            ...defaultPaymentSettings,
            ...((await settingsResponse.json()) || {})
          });
        }

        if (token) {
          const petsResponse = await fetch(`${API_URL}/customer/pets`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const petsData = await petsResponse.json();
          if (Array.isArray(petsData)) setPets(petsData);
        }
      } catch (loadError) {
        console.error("Erro ao carregar dados:", loadError);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  const selectedService = useMemo(
    () => services.find((item) => String(item.id) === String(form.serviceId)),
    [services, form.serviceId]
  );

  const selectedPet = useMemo(
    () => pets.find((item) => String(item.id) === String(form.petId)),
    [pets, form.petId]
  );

  const servicePrice = useMemo(
    () => servicePriceBySize(selectedService, selectedPet),
    [selectedService, selectedPet]
  );

  const serviceDuration = useMemo(
    () => serviceDurationBySize(selectedService, selectedPet),
    [selectedService, selectedPet]
  );

  const paymentAmount = useMemo(() => {
    if (Number(paymentSettings.deposit_required || 0) && Number(paymentSettings.deposit_percent || 0) > 0) {
      return (servicePrice * Number(paymentSettings.deposit_percent || 0)) / 100;
    }

    return servicePrice;
  }, [servicePrice, paymentSettings]);

  const paymentOptions = useMemo(
    () =>
      [
        [Number(paymentSettings.pix_enabled ?? 1) ? "pix" : null, QrCode, "PIX", "QR Code ou copia e cola."],
        [Number(paymentSettings.card_enabled ?? 1) ? "card" : null, CreditCard, "Cartão", "Online ou presencial."],
        [Number(paymentSettings.cash_enabled ?? 1) ? "presencial" : null, Wallet, "Presencial", "Pagar no atendimento."]
      ].filter(([value]) => Boolean(value)),
    [paymentSettings]
  );

  useEffect(() => {
    if (paymentOptions.length && !paymentOptions.some(([value]) => value === form.paymentMethod)) {
      updateField("paymentMethod", paymentOptions[0][0]);
    }
  }, [paymentOptions, form.paymentMethod]);

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
        const response = await fetch(
          `${API_PUBLIC}/available-slots?service_id=${form.serviceId}&date=${form.date}&duration=${serviceDuration}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Erro ao carregar horários.");

        setSlots(Array.isArray(data.slots) ? data.slots : []);

        if (data.blocked) {
          setSlotsMessage(data.reason || "Data bloqueada.");
        } else if (!data.slots?.length) {
          setSlotsMessage(data.reason || "Nenhum horário disponível neste dia.");
        }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name: form.pet, species: "Cachorro" })
        });
        const petData = await petResponse.json();

        if (!petResponse.ok) throw new Error(petData.error || "Erro ao cadastrar pet.");

        finalPetId = petData.id;
        finalPetName = petData.name;
      }

      const response = await fetch(`${API_URL}/customer/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
          notes: form.notes
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
    const text = encodeURIComponent(
      `Olá! Gostaria de agendar no SPA do Doguinho.\nNome: ${form.name}\nTelefone: ${form.phone}\nPet: ${petName}\nPorte: ${selectedPet ? displayPetSize(selectedPet) : "Não informado"}\nServiço: ${serviceName}\nValor: ${formatCurrency(servicePrice)}\nTempo: ${serviceDuration} min\nData: ${form.date}\nHorário: ${form.time}\nPagamento: ${form.paymentMethod}\nObservações: ${form.notes}`
    );

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
      serviceId: "",
      date: "",
      time: "",
      paymentMethod: paymentOptions[0]?.[0] || "presencial",
      notes: ""
    });
  }

  const hasRealPix = Boolean(
    confirmedAppointment?.payment?.qr_code ||
      confirmedAppointment?.payment?.qr_code_base64 ||
      confirmedAppointment?.payment?.ticket_url
  );

  const paymentInstruction =
    form.paymentMethod === "pix"
      ? hasRealPix
        ? "PIX gerado com sucesso. Pague pelo QR Code ou copie o código PIX abaixo."
        : "Seu agendamento foi registrado e o pagamento PIX ficou pendente. Configure o Access Token do Mercado Pago para gerar QR Code real."
      : form.paymentMethod === "card"
        ? "Seu agendamento foi registrado com pagamento por cartão."
        : "Seu agendamento foi registrado. O pagamento será feito presencialmente no atendimento.";
  const CurrentStepIcon = steps[step].icon;

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative bg-[#e7f4ed] px-5 py-12 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7eadf] bg-white px-5 py-3 font-black text-[#0d6b54] shadow-sm transition hover:border-[#0d6b54]"
              >
                <ArrowLeft size={18} />
                Voltar ao site
              </Link>

              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-black text-[#0d6b54] shadow-sm">
                <Sparkles size={18} />
                Agendamento inteligente
              </span>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.98] md:text-7xl">
                Reserve o cuidado ideal em poucos passos.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Escolha pet, serviço, horário e pagamento com preço calculado por porte e confirmação pelo painel do cliente.
              </p>

              <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
                <HeroMetric icon={CalendarDays} title="Horários reais" text="Datas livres aparecem na hora" />
                <HeroMetric icon={ShieldCheck} title="Sem surpresa" text="Valor e tempo antes de confirmar" />
                <HeroMetric icon={MessageCircle} title="WhatsApp pronto" text="Pedido montado automaticamente" />
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[40px] bg-white p-3 shadow-2xl ring-1 ring-[#e2eadf]">
                <img
                  src="/images/banho-pet-home.webp"
                  alt="Atendimento premium para pets"
                  className="h-[520px] w-full rounded-[30px] object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 rounded-[28px] bg-white/90 p-5 shadow-xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f4ed] text-[#0d6b54]">
                    <PawPrint size={30} />
                  </div>
                  <div>
                    <div className="font-black text-slate-950">Atendimento com ficha do pet</div>
                    <p className="text-sm font-semibold text-slate-500">Histórico, porte, serviço e pagamento no mesmo fluxo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto grid max-w-[1680px] gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="rounded-[36px] bg-white p-5 shadow-2xl ring-1 ring-[#e2eadf] md:p-8">
              {confirmedAppointment ? (
                <SuccessView
                  form={form}
                  selectedPet={selectedPet}
                  selectedService={selectedService}
                  paymentAmount={paymentAmount}
                  confirmedAppointment={confirmedAppointment}
                  paymentInstruction={paymentInstruction}
                  copyPixCode={copyPixCode}
                  success={success}
                  openWhatsApp={openWhatsApp}
                  resetFlow={resetFlow}
                />
              ) : (
                <>
                  <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e7f4ed] text-[#0d6b54]">
                        <CurrentStepIcon size={34} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-950">Agendar atendimento</h2>
                        <p className="font-semibold text-slate-500">Etapa {step + 1} de {steps.length}</p>
                      </div>
                    </div>

                    {!token && (
                      <Link
                        to="/cliente-login"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition hover:bg-slate-800"
                      >
                        <LogIn size={19} />
                        Entrar ou criar conta
                      </Link>
                    )}
                  </div>

                  <div className="mb-8 overflow-x-auto pb-2">
                    <div className="grid min-w-[620px] grid-cols-5 gap-2 rounded-[28px] bg-[#e7f4ed] p-2">
                      {steps.map((item, index) => (
                        <StepButton key={item.label} item={item} index={index} current={step} setStep={setStep} />
                      ))}
                    </div>
                  </div>

                  {step === 0 && <PetStep form={form} updateField={updateField} pets={pets} token={token} />}
                  {step === 1 && (
                    <ServiceStep
                      services={services}
                      form={form}
                      updateField={updateField}
                      selectedPet={selectedPet}
                      loading={loading}
                    />
                  )}
                  {step === 2 && (
                    <DateStep
                      availableDays={availableDays}
                      form={form}
                      updateField={updateField}
                      serviceDuration={serviceDuration}
                      slotsLoading={slotsLoading}
                      slotsMessage={slotsMessage}
                      slots={slots}
                    />
                  )}
                  {step === 3 && (
                    <PaymentStep
                      paymentOptions={paymentOptions}
                      form={form}
                      updateField={updateField}
                      paymentSettings={paymentSettings}
                      paymentAmount={paymentAmount}
                    />
                  )}
                  {step === 4 && (
                    <ConfirmStep
                      form={form}
                      selectedPet={selectedPet}
                      selectedService={selectedService}
                      serviceDuration={serviceDuration}
                      paymentAmount={paymentAmount}
                      error={error}
                      success={success}
                      saveAppointment={saveAppointment}
                      saving={saving}
                      openWhatsApp={openWhatsApp}
                      token={token}
                    />
                  )}

                  {error && step !== 4 && <Alert type="error" text={error} />}

                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                    <button
                      onClick={previousStep}
                      disabled={step === 0}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#e7f4ed] px-5 py-4 font-black text-slate-700 shadow-sm disabled:opacity-40"
                    >
                      <ArrowLeft size={18} />
                      Voltar
                    </button>

                    {step < steps.length - 1 && (
                      <button
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#0d6b54] px-6 py-4 font-black text-white shadow-lg transition hover:bg-[#095642]"
                      >
                        Continuar
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <SummaryPanel
              form={form}
              selectedPet={selectedPet}
              selectedService={selectedService}
              serviceDuration={serviceDuration}
              servicePrice={servicePrice}
              paymentAmount={paymentAmount}
              token={token}
            />
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function HeroMetric({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-[#e2eadf]">
      <Icon className="text-[#0d6b54]" size={28} />
      <b className="mt-3 block text-slate-950">{title}</b>
      <p className="mt-1 text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

function StepButton({ item, index, current, setStep }) {
  const Icon = item.icon;
  const active = index === current;
  const done = index < current;

  return (
    <button
      type="button"
      onClick={() => setStep(index)}
      className={`flex min-h-[74px] flex-col items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black transition ${
        active
          ? "bg-[#0d6b54] text-white shadow-lg"
          : done
            ? "bg-emerald-100 text-emerald-800"
            : "bg-white/60 text-slate-500 hover:bg-white"
      }`}
    >
      <Icon size={20} />
      {item.label}
    </button>
  );
}

function SummaryPanel({ form, selectedPet, selectedService, serviceDuration, servicePrice, paymentAmount, token }) {
  const petName = selectedPet?.name || form.pet || "Pet não escolhido";
  const serviceName = selectedService?.name || "Serviço não escolhido";
  const dateTime = form.date && form.time ? `${formatDay(form.date)} às ${form.time}` : "Horário não escolhido";

  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <div className="overflow-hidden rounded-[36px] bg-[#10231a] text-white shadow-2xl">
        <img src="/images/galeria-pet-01.webp" alt="Banho premium" className="h-52 w-full object-cover" />

        <div className="p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-emerald-100">
            <Heart size={16} />
            Resumo do cuidado
          </span>

          <div className="mt-6 space-y-4">
            <SummaryLine label="Pet" value={petName} />
            <SummaryLine label="Serviço" value={serviceName} />
            <SummaryLine label="Data" value={dateTime} />
            <SummaryLine label="Tempo" value={`${serviceDuration || 0} min`} />
          </div>

          <div className="mt-7 rounded-[28px] bg-white p-5 text-[#10231a]">
            <div className="text-sm font-black uppercase text-slate-400">Total estimado</div>
            <div className="mt-2 text-4xl font-black text-[#0d6b54]">{formatCurrency(servicePrice)}</div>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Pagamento nesta etapa: {formatCurrency(paymentAmount)}
            </p>
          </div>

          {!token && (
            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/10 p-5">
              <b>Conta do cliente</b>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Entrar antes de confirmar salva o horário no painel e mantém o histórico do pet.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="text-xs font-black uppercase text-white/50">{label}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5">
      <div className="text-xs font-black uppercase text-slate-400">{label}</div>
      <div className="mt-2 break-words text-xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function Alert({ type, text }) {
  return (
    <div
      className={`mt-5 rounded-2xl border p-4 font-bold ${
        type === "error"
          ? "border-red-100 bg-red-50 text-red-700"
          : "border-emerald-100 bg-emerald-50 text-emerald-700"
      }`}
    >
      {text}
    </div>
  );
}

function PetStep({ form, updateField, pets, token }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Quem vai receber o cuidado?</h3>
        <p className="mt-2 text-slate-500">Selecione um pet salvo ou informe o nome para seguir pelo WhatsApp.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Nome do tutor"
          className={fieldClassName}
        />
        <input
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Telefone / WhatsApp"
          className={fieldClassName}
        />
      </div>

      {!token && (
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 text-emerald-900">
          <b>Com conta, fica mais fácil.</b>
          <p className="mt-2 text-sm font-semibold">
            Entrando pelo Google ou e-mail, seus pets aparecem aqui e o agendamento fica salvo no painel.
          </p>
        </div>
      )}

      {pets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => {
                updateField("petId", pet.id);
                updateField("pet", pet.name);
              }}
              className={`min-h-[150px] rounded-[28px] border p-5 text-left transition ${
                String(form.petId) === String(pet.id)
                  ? "border-[#0d6b54] bg-[#0d6b54] text-white shadow-lg"
                  : "border-slate-100 bg-white text-slate-800 hover:border-emerald-300"
              }`}
            >
              <PawPrint className="mb-4" />
              <div className="text-xl font-black">{pet.name}</div>
              <div className="mt-1 opacity-75">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div>
              <div className="mt-3 text-sm font-black opacity-80">
                {displayPetSize(pet)} {pet.weight ? `• ${pet.weight} kg` : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      <input
        value={form.pet}
        onChange={(event) => {
          updateField("pet", event.target.value);
          updateField("petId", "");
        }}
        placeholder="Ou digite o nome do pet"
        className={fieldClassName}
      />
    </div>
  );
}

function ServiceStep({ services, form, updateField, selectedPet, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Escolha o serviço</h3>
        <p className="mt-2 text-slate-500">O preço e a duração acompanham o porte cadastrado do pet.</p>
      </div>

      {selectedPet && (
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 font-bold text-emerald-900">
          Pet selecionado: {selectedPet.name} • {displayPetSize(selectedPet)}
        </div>
      )}

      {loading && <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">Carregando serviços...</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const price = servicePriceBySize(service, selectedPet);
          const duration = serviceDurationBySize(service, selectedPet);
          const active = String(form.serviceId) === String(service.id);

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                updateField("serviceId", service.id);
                updateField("date", "");
                updateField("time", "");
              }}
              className={`min-h-[190px] rounded-[30px] border p-5 text-left transition ${
                active
                  ? "border-[#0d6b54] bg-[#0d6b54] text-white shadow-lg"
                  : "border-slate-100 bg-white text-slate-800 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <Sparkles />
                <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? "bg-white/20" : "bg-emerald-50 text-emerald-800"}`}>
                  {duration} min
                </span>
              </div>
              <div className="mt-5 text-2xl font-black">{service.name}</div>
              <p className="mt-2 line-clamp-2 text-sm opacity-75">{service.description || "Cuidado premium para deixar o pet limpo e confortável."}</p>
              <div className="mt-5 text-3xl font-black">{formatCurrency(price)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateStep({ availableDays, form, updateField, serviceDuration, slotsLoading, slotsMessage, slots }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Data e horário</h3>
        <p className="mt-2 text-slate-500">Tempo estimado: {serviceDuration} minutos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {availableDays.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => {
              updateField("date", day);
              updateField("time", "");
            }}
            className={`min-h-[84px] rounded-2xl border p-4 text-left font-black transition ${
              form.date === day
                ? "border-[#0d6b54] bg-[#0d6b54] text-white"
                : "border-slate-100 bg-white text-slate-700 hover:border-emerald-300"
            }`}
          >
            <CalendarDays size={20} className="mb-2" />
            {formatDay(day)}
          </button>
        ))}
      </div>

      {form.date && (
        <div className="rounded-[30px] bg-slate-50 p-5">
          <h4 className="mb-4 text-xl font-black text-slate-950">Horários livres</h4>

          {slotsLoading && <div className="rounded-2xl bg-white p-5 font-bold text-slate-500">Buscando horários...</div>}

          {!slotsLoading && slotsMessage && (
            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 font-bold text-yellow-800">
              {slotsMessage}
            </div>
          )}

          {!slotsLoading && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => updateField("time", slot.time)}
                  className={`min-h-[76px] rounded-2xl border p-3 font-black transition ${
                    form.time === slot.time
                      ? "border-[#0d6b54] bg-[#0d6b54] text-white"
                      : "border-slate-100 bg-white text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <Clock size={18} className="mx-auto mb-2" />
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentStep({ paymentOptions, form, updateField, paymentSettings, paymentAmount }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Forma de pagamento</h3>
        <p className="mt-2 text-slate-500">Escolha como prefere deixar o atendimento combinado.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {paymentOptions.map(([value, Icon, label, description]) => {
          const active = form.paymentMethod === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => updateField("paymentMethod", value)}
              className={`min-h-[160px] rounded-[30px] border p-5 text-left transition ${
                active
                  ? "border-[#0d6b54] bg-[#0d6b54] text-white shadow-lg"
                  : "border-slate-100 bg-white text-slate-800 hover:border-emerald-300"
              }`}
            >
              <Icon size={30} className="mb-4" />
              <div className="text-xl font-black">{label}</div>
              <div className="mt-2 text-sm opacity-75">{description}</div>
            </button>
          );
        })}
      </div>

      {Number(paymentSettings.deposit_required || 0) ? (
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 font-bold text-emerald-900">
          Será cobrado sinal de {paymentSettings.deposit_percent}%: {formatCurrency(paymentAmount)}.
        </div>
      ) : null}

      <textarea
        value={form.notes}
        onChange={(event) => updateField("notes", event.target.value)}
        rows={4}
        placeholder="Observações para o atendimento"
        className={fieldClassName}
      />
    </div>
  );
}

function ConfirmStep({
  form,
  selectedPet,
  selectedService,
  serviceDuration,
  paymentAmount,
  error,
  success,
  saveAppointment,
  saving,
  openWhatsApp,
  token
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-black text-slate-950">Confirmar agendamento</h3>
        <p className="mt-2 text-slate-500">Confira tudo antes de salvar ou enviar para o WhatsApp.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Pet" value={selectedPet?.name || form.pet || "Não informado"} />
        <Info label="Porte" value={selectedPet ? displayPetSize(selectedPet) : "Não informado"} />
        <Info label="Serviço" value={selectedService?.name || "Não selecionado"} />
        <Info label="Data/Hora" value={`${form.date || "--"} às ${form.time || "--"}`} />
      </div>

      {selectedService && (
        <div className="flex items-center justify-between gap-4 rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
          <div>
            <div className="text-sm font-black uppercase text-emerald-700">Valor</div>
            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <Clock size={18} />
              {serviceDuration} minutos
            </div>
          </div>
          <div className="text-right text-3xl font-black text-[#0d6b54]">{formatCurrency(paymentAmount)}</div>
        </div>
      )}

      {!token && (
        <div className="rounded-[28px] border border-yellow-100 bg-yellow-50 p-5 font-bold text-yellow-900">
          Para salvar no painel, entre ou crie sua conta. Você ainda pode enviar o pedido pelo WhatsApp.
        </div>
      )}

      {error && <Alert type="error" text={error} />}
      {success && <Alert type="success" text={success} />}

      <button
        onClick={saveAppointment}
        disabled={saving}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] py-5 text-lg font-black text-white shadow-lg transition hover:bg-[#095642] disabled:opacity-60"
      >
        <CheckCircle size={20} />
        {saving ? "Salvando..." : "Confirmar e salvar agendamento"}
      </button>

      <button
        onClick={openWhatsApp}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:bg-slate-800"
      >
        <MessageCircle size={20} />
        Enviar pelo WhatsApp
      </button>
    </div>
  );
}

function SuccessView({
  form,
  selectedPet,
  selectedService,
  paymentAmount,
  confirmedAppointment,
  paymentInstruction,
  copyPixCode,
  success,
  openWhatsApp,
  resetFlow
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[34px] border border-emerald-100 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0d6b54] text-white shadow-xl">
          <CheckCircle size={42} />
        </div>
        <h2 className="mt-6 text-4xl font-black text-slate-950">Agendamento confirmado!</h2>
        <p className="mt-3 font-bold text-slate-500">Seu horário foi salvo no SPA do Doguinho.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Pet" value={selectedPet?.name || form.pet} />
        <Info label="Serviço" value={selectedService?.name} />
        <Info label="Data e horário" value={`${form.date} às ${form.time}`} />
        <Info
          label="Pagamento"
          value={`${form.paymentMethod.toUpperCase()} • ${formatCurrency(confirmedAppointment?.payment?.amount || paymentAmount)}`}
        />
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 font-bold text-emerald-900">
        {paymentInstruction}
      </div>

      {form.paymentMethod === "pix" && (
        <div className="space-y-4 rounded-[30px] border-2 border-dashed border-emerald-200 bg-white p-8 text-center">
          {confirmedAppointment?.payment?.qr_code_base64 ? (
            <img
              src={`data:image/png;base64,${confirmedAppointment.payment.qr_code_base64}`}
              alt="QR Code PIX"
              className="mx-auto h-64 w-64 rounded-2xl border object-contain"
            />
          ) : (
            <QrCode size={70} className="mx-auto text-[#0d6b54]" />
          )}

          <h3 className="text-2xl font-black text-slate-950">PIX para pagamento</h3>

          {confirmedAppointment?.payment?.qr_code && (
            <div className="break-all rounded-2xl border bg-slate-50 p-4 text-left text-xs text-slate-600">
              {confirmedAppointment.payment.qr_code}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {confirmedAppointment?.payment?.qr_code && (
              <button
                onClick={copyPixCode}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] px-6 py-4 font-black text-white hover:bg-[#095642]"
              >
                <Copy size={18} />
                Copiar PIX
              </button>
            )}

            {confirmedAppointment?.payment?.ticket_url && (
              <a
                href={confirmedAppointment.payment.ticket_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white hover:bg-slate-800"
              >
                <ExternalLink size={18} />
                Abrir pagamento
              </a>
            )}
          </div>
        </div>
      )}

      {success && <Alert type="success" text={success} />}

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/cliente" className="rounded-2xl bg-[#0d6b54] py-4 text-center font-black text-white hover:bg-[#095642]">
          Área do Cliente
        </Link>
        <button
          onClick={openWhatsApp}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-black text-white hover:bg-slate-800"
        >
          <MessageCircle size={20} />
          WhatsApp
        </button>
        <button onClick={resetFlow} className="rounded-2xl bg-slate-100 py-4 font-black text-slate-800 hover:bg-slate-200">
          Novo agendamento
        </button>
      </div>
    </div>
  );
}
