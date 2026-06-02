import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Heart,
  MessageCircle,
  PawPrint,
  QrCode,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Wallet
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = import.meta.env.VITE_API_URL || "https://spadodoguinho.com.br/api";
const API_PUBLIC = `${API_URL}/public`;
const whatsappUrl = "https://wa.me/5518997493722?text=Olá! Gostaria de ajuda para agendar no SPA do Doguinho.";
const bookingHeroImage = "/images/banho-pet-home.webp";

const steps = [
  { title: "Serviço", text: "Escolha o cuidado" },
  { title: "Pet", text: "Selecione ou cadastre" },
  { title: "Horário", text: "Dia e hora" },
  { title: "Confirmar", text: "Revise e finalize" }
];

const emptyForm = {
  serviceId: "",
  petId: "",
  newPetName: "",
  newPetSpecies: "Cachorro",
  newPetBreed: "",
  newPetWeight: "",
  date: "",
  time: "",
  paymentMethod: "pix",
  notes: ""
};

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function dateLabel(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  });
}

function fullDate(value) {
  if (!value) return "Selecione uma data";
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function petSize(pet) {
  const size = String(pet?.size_category || "").toLowerCase();
  if (["pequeno", "small"].includes(size)) return "small";
  if (["medio", "médio", "medium"].includes(size)) return "medium";
  if (["grande", "large"].includes(size)) return "large";
  if (["gigante", "giant"].includes(size)) return "giant";

  const weight = Number(String(pet?.weight || "").replace(",", "."));
  if (!weight) return "";
  if (weight <= 10) return "small";
  if (weight <= 25) return "medium";
  if (weight <= 40) return "large";
  return "giant";
}

function servicePrice(service, pet) {
  const size = petSize(pet);
  return Number(service?.[`price_${size}`] || service?.price || 0);
}

function serviceDuration(service, pet) {
  const size = petSize(pet);
  return Number(service?.[`duration_${size}`] || service?.duration_minutes || pet?.estimated_bath_time || 60);
}

function pixImageSrc(payment) {
  const base64 = payment?.qr_code_base64 || "";
  if (!base64) return "";
  return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
}

function paymentStatusLabel(status) {
  const value = String(status || "pending").toLowerCase();
  if (["approved", "paid", "pago"].includes(value)) return "Pago";
  if (["rejected", "cancelled", "canceled"].includes(value)) return "Não aprovado";
  return "Aguardando pagamento";
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Não foi possível concluir a operação.");
  return data;
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export default function ClienteAgendamentoPage() {
  const token = localStorage.getItem("spa_customer_token");
  const savedCustomer = JSON.parse(localStorage.getItem("spa_customer") || "null");
  const wizardRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({ pix_enabled: 1, card_enabled: 1, cash_enabled: 1 });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return isoDate(date);
  }), []);

  const selectedService = services.find((item) => String(item.id) === String(form.serviceId));
  const selectedPet = pets.find((item) => String(item.id) === String(form.petId));
  const draftPet = selectedPet || { weight: form.newPetWeight, name: form.newPetName, species: form.newPetSpecies, breed: form.newPetBreed };
  const selectedPrice = servicePrice(selectedService, draftPet);
  const selectedDuration = serviceDuration(selectedService, draftPet);
  const progressPercent = ((step + 1) / steps.length) * 100;

  const paymentOptions = useMemo(() => [
    Number(paymentSettings.pix_enabled ?? 1) ? ["pix", QrCode, "PIX", "Gera QR Code ao confirmar"] : null,
    Number(paymentSettings.card_enabled ?? 1) ? ["card", CreditCard, "Cartão", "Crédito ou débito"] : null,
    Number(paymentSettings.cash_enabled ?? 1) ? ["presencial", Wallet, "Na loja", "Pague no atendimento"] : null
  ].filter(Boolean), [paymentSettings]);

  function scrollToWizard() {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [serviceResponse, petsResponse, paymentResponse] = await Promise.all([
        fetch(`${API_PUBLIC}/services`),
        fetch(`${API_URL}/customer/pets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_PUBLIC}/payment-settings`).catch(() => null)
      ]);

      const serviceData = await readJson(serviceResponse);
      const petsData = await readJson(petsResponse);
      setServices(Array.isArray(serviceData) ? serviceData.filter((item) => Number(item.active ?? 1) === 1) : []);
      setPets(Array.isArray(petsData) ? petsData : []);

      if (paymentResponse?.ok) {
        const paymentData = await paymentResponse.json();
        setPaymentSettings((current) => ({ ...current, ...paymentData }));
      }
    } catch (err) {
      setError(err.message || "Não foi possível carregar o agendamento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (paymentOptions.length && !paymentOptions.some(([method]) => method === form.paymentMethod)) {
      updateForm("paymentMethod", paymentOptions[0][0]);
    }
  }, [paymentOptions, form.paymentMethod]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.serviceId || !form.date) {
        setSlots([]);
        return;
      }

      setSlotsLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_PUBLIC}/available-slots?service_id=${form.serviceId}&date=${form.date}`);
        const data = await readJson(response);
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      } catch (err) {
        setSlots([]);
        setError(err.message || "Não foi possível buscar os horários.");
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [form.serviceId, form.date]);

  function updateForm(field, value) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseService(id) {
    setForm((current) => ({ ...current, serviceId: id, time: "" }));
    setError("");
  }

  function choosePet(id) {
    setForm((current) => ({ ...current, petId: id, newPetName: "", newPetBreed: "", newPetWeight: "" }));
    setError("");
  }

  function chooseNewPet(field, value) {
    setForm((current) => ({ ...current, petId: "", [field]: value }));
    setError("");
  }

  function nextStep() {
    if (step === 0 && !form.serviceId) return setError("Escolha um serviço para continuar.");
    if (step === 1 && !(form.petId || form.newPetName.trim())) return setError("Selecione um pet ou informe o nome do novo pet.");
    if (step === 2 && !(form.date && form.time)) return setError("Escolha a data e o horário do atendimento.");
    setError("");
    setStep((current) => Math.min(3, current + 1));
  }

  async function finishBooking() {
    setSaving(true);
    setError("");

    try {
      let petId = form.petId;
      let finalPetName = selectedPet?.name || form.newPetName.trim();

      if (!petId) {
        const petResponse = await fetch(`${API_URL}/customer/pets`, {
          method: "POST",
          headers: authHeaders(token),
          body: JSON.stringify({
            name: form.newPetName.trim(),
            species: form.newPetSpecies || "Cachorro",
            breed: form.newPetBreed || null,
            weight: form.newPetWeight || null
          })
        });
        const petData = await readJson(petResponse);
        petId = petData.id;
        finalPetName = petData.name;
      }

      const response = await fetch(`${API_URL}/customer/appointments`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          pet_id: petId,
          pet_name: finalPetName,
          service_id: form.serviceId,
          date: form.date,
          time: form.time,
          payment_method: form.paymentMethod,
          price: selectedPrice,
          total_price: selectedPrice,
          duration_minutes: selectedDuration,
          notes: form.notes
        })
      });

      const data = await readJson(response);
      setDone({
        ...data,
        pet_name: finalPetName,
        service_name: selectedService?.name,
        booked_date: form.date,
        booked_time: form.time,
        booked_amount: selectedPrice
      });
    } catch (err) {
      setError(err.message || "Não foi possível confirmar o agendamento.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    const pixPayment = done.payment?.method === "pix" ? done.payment : null;

    return (
      <PublicLayout>
        <main className="bg-[#fffdf7] px-5 py-12 text-[#12382f] md:px-8">
          <section className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[1fr_460px] lg:items-start">
            <div className="rounded-[34px] bg-white p-7 shadow-2xl ring-1 ring-[#e2eadf] md:p-10">
              <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0d6b54] text-white shadow-xl">
                <BadgeCheck size={46} />
              </span>
              <p className="mt-7 inline-flex rounded-full bg-[#e7f4ed] px-4 py-2 text-sm font-black uppercase tracking-[.12em] text-[#0d6b54]">
                Agendamento salvo
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Seu atendimento está reservado.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                O horário já entrou na agenda do SPA do Doguinho. Se você escolheu PIX, finalize pelo QR Code ao lado para deixar o pagamento adiantado.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Info label="Pet" value={done.pet_name || draftPet.name} />
                <Info label="Serviço" value={done.service_name || selectedService?.name} />
                <Info label="Data" value={fullDate(done.booked_date || form.date)} />
                <Info label="Horário" value={`${done.booked_time || form.time}`} />
                <Info label="Valor" value={money(done.payment?.amount || done.booked_amount || done.price)} />
                <Info label="Status" value={paymentStatusLabel(done.payment?.status)} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/cliente" className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-[#0d6b54] px-7 font-black text-white shadow-lg transition hover:bg-[#095642]">
                  Ver minha área
                </Link>
                <button
                  type="button"
                  onClick={() => { setDone(null); setForm(emptyForm); setStep(0); loadData(); }}
                  className="min-h-[56px] rounded-2xl border border-[#d7eadf] bg-white px-7 font-black text-[#0d6b54] shadow-sm transition hover:border-[#0d6b54]"
                >
                  Novo agendamento
                </button>
              </div>
            </div>

            {pixPayment ? (
              <PixPaymentCard payment={pixPayment} />
            ) : (
              <div className="rounded-[34px] bg-[#0d6b54] p-7 text-white shadow-2xl md:p-8">
                <Wallet size={42} />
                <h2 className="mt-5 text-3xl font-black">Pagamento combinado</h2>
                <p className="mt-3 leading-relaxed text-white/78">
                  O pagamento escolhido será tratado no atendimento. Você pode acompanhar esse agendamento pela área do cliente.
                </p>
              </div>
            )}
          </section>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-128px)] min-h-[620px] overflow-hidden bg-[#e9f6ee]">
          <img src={bookingHeroImage} alt="Agendamento SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/96 via-[#edf8f1]/72 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black uppercase tracking-[.14em] text-[#0d6b54] shadow-sm backdrop-blur">
                <CalendarDays size={16} /> Agendamento online
              </span>
              <h1 className="home-animate-fade-delay-1 mt-5 text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.65rem] 2xl:text-[5.15rem]">
                Vamos cuidar do seu doguinho
                <span className="home-shimmer-text block font-serif italic">com hora marcada.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Olá{savedCustomer?.name ? `, ${savedCustomer.name.split(" ")[0]}` : ""}! Escolha o serviço, selecione o pet, veja os horários livres e finalize com segurança em poucos passos.
              </p>
              <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={scrollToWizard} className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]">
                  Escolher serviço <ArrowRight size={18} />
                </button>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#e9fff2] px-6 py-3 font-black text-[#128c4b] shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <MessageCircle size={20} /> Ajuda no WhatsApp
                </a>
              </div>
              <div className="home-animate-fade-delay-3 mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
                {[
                  [ShieldCheck, "Seguro", "seus dados protegidos"],
                  [PawPrint, "Pet certo", "vínculo automático"],
                  [QrCode, "PIX", "QR Code ao finalizar"]
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-2xl bg-white/82 p-4 shadow-sm ring-1 ring-[#e2eadf] backdrop-blur">
                    <Icon className="text-[#0d6b54]" size={24} />
                    <b className="mt-3 block text-lg">{title}</b>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-float absolute bottom-8 right-8 hidden w-[330px] rounded-[26px] bg-[#12382f] p-5 text-white shadow-2xl xl:block">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-white"><Sparkles size={28} /></span>
              <div>
                <div className="text-sm font-black uppercase tracking-[.12em] text-white/60">Resumo</div>
                <h2 className="text-2xl font-black">Seu atendimento</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <InfoDark label="Serviço" value={selectedService?.name || "Escolha o serviço"} />
              <InfoDark label="Pet" value={selectedPet?.name || form.newPetName || "Escolha o pet"} />
              <div className="rounded-2xl bg-white p-5 text-[#12382f]">
                <div className="text-sm font-bold text-slate-500">Valor estimado</div>
                <div className="mt-1 text-3xl font-black">{money(selectedPrice)}</div>
                <div className="mt-1 text-sm font-bold text-slate-500">Duração: {selectedDuration || 0} min</div>
              </div>
            </div>
          </div>
        </section>

        <section ref={wizardRef} className="mx-auto max-w-[1880px] scroll-mt-28 px-5 py-12 md:px-8">
          <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-[#e2eadf]">
            <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#e7f4ed]">
              <div className="h-full rounded-full bg-[#0d6b54] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {steps.map((item, index) => (
                <button key={item.title} type="button" onClick={() => index < step && setStep(index)} className={`rounded-[22px] p-4 text-left transition ${index <= step ? "bg-[#0d6b54] text-white shadow-md" : "bg-[#f6faf7] text-slate-500"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-2xl font-black ${index <= step ? "bg-white/16" : "bg-white text-[#0d6b54]"}`}>{index + 1}</span>
                    {index < step && <Check size={21} />}
                  </div>
                  <h3 className="mt-3 text-lg font-black">{item.title}</h3>
                  <p className={`mt-1 text-sm font-semibold ${index <= step ? "text-white/72" : "text-slate-400"}`}>{item.text}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
              <AlertCircle /> {error}
            </div>
          )}

          <div className="rounded-[34px] bg-white p-6 shadow-2xl ring-1 ring-[#e2eadf] md:p-8">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center text-center text-slate-500">
                <div>
                  <RefreshCw className="mx-auto mb-4 animate-spin text-[#0d6b54]" size={38} />
                  <p className="font-black">Carregando agenda...</p>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && <ServiceStep services={services} selected={form.serviceId} onChoose={chooseService} pet={draftPet} />}
                {step === 1 && <PetStep pets={pets} form={form} onChoosePet={choosePet} onNewPet={chooseNewPet} />}
                {step === 2 && <TimeStep days={days} form={form} onChange={updateForm} slots={slots} slotsLoading={slotsLoading} />}
                {step === 3 && <ReviewStep form={form} pet={draftPet} service={selectedService} amount={selectedPrice} duration={selectedDuration} paymentOptions={paymentOptions} onChange={updateForm} />}
              </>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <button type="button" disabled={step === 0 || saving} onClick={() => setStep((current) => Math.max(0, current - 1))} className="min-h-[56px] rounded-2xl border border-[#d7eadf] bg-white px-7 font-black text-[#0d6b54] disabled:cursor-not-allowed disabled:opacity-40">
                Voltar
              </button>
              <button type="button" disabled={saving || loading} onClick={step === 3 ? finishBooking : nextStep} className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-8 font-black text-white shadow-lg transition hover:bg-[#095642] disabled:opacity-60">
                {saving ? "Salvando..." : step === 3 ? "Confirmar agendamento" : "Continuar"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function ServiceStep({ services, selected, onChoose, pet }) {
  return (
    <div>
      <SectionHeading icon={Scissors} title="Escolha o serviço" text="Selecione o atendimento que seu pet precisa hoje." />
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <button key={service.id} type="button" onClick={() => onChoose(service.id)} className={`group rounded-[28px] border p-6 text-left transition hover:-translate-y-1 hover:shadow-xl ${String(selected) === String(service.id) ? "border-[#0d6b54] bg-[#e7f4ed] shadow-lg" : "border-[#e2eadf] bg-white"}`}>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d6b54] text-white"><Sparkles size={30} /></span>
            <h3 className="mt-5 text-2xl font-black text-[#12382f]">{service.name}</h3>
            <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-slate-600">{service.description || "Serviço especial SPA do Doguinho."}</p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-400">Valor</div>
                <div className="text-2xl font-black text-[#0d6b54]">{money(servicePrice(service, pet))}</div>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 shadow-sm">{serviceDuration(service, pet)} min</div>
            </div>
          </button>
        ))}
      </div>
      {!services.length && (
        <div className="mt-7 rounded-[28px] border border-dashed border-[#d7eadf] bg-[#f6faf7] p-8 text-center text-slate-500">
          Nenhum serviço ativo encontrado. Confira o cadastro de serviços no painel administrativo.
        </div>
      )}
    </div>
  );
}

function PetStep({ pets, form, onChoosePet, onNewPet }) {
  return (
    <div>
      <SectionHeading icon={PawPrint} title="Quem será atendido?" text="Escolha um pet cadastrado ou informe um novo sem sair do fluxo." />
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <button key={pet.id} type="button" onClick={() => onChoosePet(pet.id)} className={`rounded-[24px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${String(form.petId) === String(pet.id) ? "border-[#0d6b54] bg-[#e7f4ed]" : "border-[#e2eadf] bg-white"}`}>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d6b54] text-white"><Heart size={26} /></span>
                <div className="min-w-0">
                  <h3 className="text-xl font-black">{pet.name}</h3>
                  <p className="truncate text-sm font-semibold text-slate-500">{pet.species || "Pet"}{pet.breed ? ` • ${pet.breed}` : ""}</p>
                </div>
              </div>
            </button>
          ))}
          {!pets.length && <div className="rounded-[24px] border border-dashed border-[#d7eadf] p-8 text-center text-slate-500 md:col-span-2">Você ainda não tem pets cadastrados. Cadastre aqui ao lado e continue o agendamento.</div>}
        </div>
        <div className="rounded-[28px] bg-[#f4f8f5] p-6 ring-1 ring-[#e2eadf]">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0d6b54]"><PawPrint /></span>
            <div>
              <h3 className="text-2xl font-black">Novo pet</h3>
              <p className="text-sm text-slate-500">Ele será salvo automaticamente ao confirmar.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <Field label="Nome do pet" value={form.newPetName} onChange={(value) => onNewPet("newPetName", value)} placeholder="Ex: Thor" />
            <label className="grid gap-2 font-bold text-slate-600">
              Espécie
              <select value={form.newPetSpecies} onChange={(event) => onNewPet("newPetSpecies", event.target.value)} className="min-h-[52px] rounded-2xl border border-[#d7eadf] bg-white px-4 outline-none">
                <option>Cachorro</option>
                <option>Gato</option>
                <option>Outro</option>
              </select>
            </label>
            <Field label="Raça" value={form.newPetBreed} onChange={(value) => onNewPet("newPetBreed", value)} placeholder="Opcional" required={false} />
            <Field label="Peso aproximado" value={form.newPetWeight} onChange={(value) => onNewPet("newPetWeight", value)} placeholder="Ex: 8.5" required={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeStep({ days, form, onChange, slots, slotsLoading }) {
  return (
    <div>
      <SectionHeading icon={CalendarDays} title="Escolha data e horário" text="Os horários vêm direto da agenda configurada no painel." />
      <div className="mt-7 grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-2 rounded-[28px] bg-[#f4f8f5] p-4 ring-1 ring-[#e2eadf]">
          {days.map((day) => (
            <button key={day} type="button" onClick={() => { onChange("date", day); onChange("time", ""); }} className={`rounded-2xl px-5 py-4 text-left font-black transition ${form.date === day ? "bg-[#0d6b54] text-white" : "bg-white text-[#12382f] hover:bg-[#e7f4ed]"}`}>
              {dateLabel(day)}
            </button>
          ))}
        </div>
        <div className="rounded-[28px] border border-[#e2eadf] bg-white p-6">
          <h3 className="text-2xl font-black">{fullDate(form.date)}</h3>
          <p className="mt-1 text-slate-500">Selecione um horário disponível.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {!form.date && <div className="col-span-full rounded-2xl bg-slate-50 p-8 text-center text-slate-500">Escolha uma data ao lado.</div>}
            {form.date && slotsLoading && <div className="col-span-full rounded-2xl bg-slate-50 p-8 text-center font-bold text-slate-500">Buscando horários...</div>}
            {form.date && !slotsLoading && slots.length === 0 && <div className="col-span-full rounded-2xl bg-slate-50 p-8 text-center text-slate-500">Nenhum horário livre para esta data.</div>}
            {form.date && !slotsLoading && slots.map((slot) => (
              <button key={slot.time} type="button" onClick={() => onChange("time", slot.time)} className={`min-h-[62px] rounded-2xl font-black transition ${form.time === slot.time ? "bg-[#0d6b54] text-white shadow-lg" : "bg-[#e7f4ed] text-[#0d6b54] hover:bg-[#d9eee3]"}`}>
                <Clock className="mx-auto mb-1" size={18} /> {slot.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ form, pet, service, amount, duration, paymentOptions, onChange }) {
  const isPix = form.paymentMethod === "pix";

  return (
    <div>
      <SectionHeading icon={CheckCircle2} title="Revise e confirme" text="Confira os dados antes de salvar o agendamento." />
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4 rounded-[28px] bg-[#f4f8f5] p-6 ring-1 ring-[#e2eadf]">
          <Info label="Pet" value={pet?.name || "Pet"} />
          <Info label="Serviço" value={service?.name || "Serviço"} />
          <Info label="Data" value={fullDate(form.date)} />
          <Info label="Horário" value={form.time} />
          <Info label="Duração" value={`${duration} minutos`} />
          <Info label="Valor" value={money(amount)} />
        </div>
        <div className="rounded-[28px] border border-[#e2eadf] bg-white p-6">
          <h3 className="text-2xl font-black">Pagamento</h3>
          <p className="mt-1 text-slate-500">Escolha como deseja pagar.</p>
          <div className="mt-5 grid gap-3">
            {paymentOptions.map(([method, Icon, title, text]) => (
              <button key={method} type="button" onClick={() => onChange("paymentMethod", method)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${form.paymentMethod === method ? "border-[#0d6b54] bg-[#e7f4ed]" : "border-[#e2eadf] bg-white"}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d6b54] text-white"><Icon size={22} /></span>
                <span><strong className="block">{title}</strong><small className="text-slate-500">{text}</small></span>
              </button>
            ))}
          </div>
          {isPix && (
            <div className="mt-4 rounded-2xl border border-[#cfe8d9] bg-[#f4fbf6] p-4 text-sm font-bold text-[#0d6b54]">
              O QR Code PIX aparece automaticamente depois que você clicar em confirmar.
            </div>
          )}
          <label className="mt-5 grid gap-2 font-bold text-slate-600">
            Observações
            <textarea value={form.notes} onChange={(event) => onChange("notes", event.target.value)} rows={4} placeholder="Alguma alergia, comportamento ou recado especial?" className="rounded-2xl border border-[#d7eadf] bg-white p-4 outline-none" />
          </label>
        </div>
      </div>
    </div>
  );
}

function PixPaymentCard({ payment }) {
  const [copied, setCopied] = useState(false);
  const imageSrc = pixImageSrc(payment);
  const pixCode = payment?.qr_code || "";
  const hasPaymentData = imageSrc || pixCode || payment?.ticket_url;

  async function copyPixCode() {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="rounded-[34px] bg-[#12382f] p-6 text-white shadow-2xl md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-white/70">PIX</p>
          <h2 className="mt-4 text-3xl font-black">Pague pelo QR Code</h2>
          <p className="mt-2 text-white/72">Escaneie no app do banco ou copie o código PIX.</p>
        </div>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0d6b54]"><QrCode size={30} /></span>
      </div>

      <div className="mt-6 rounded-[28px] bg-white p-5 text-[#12382f]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[.12em] text-slate-400">Valor PIX</div>
            <div className="text-3xl font-black">{money(payment?.amount)}</div>
          </div>
          <span className="rounded-full bg-[#e7f4ed] px-4 py-2 text-sm font-black text-[#0d6b54]">{paymentStatusLabel(payment?.status)}</span>
        </div>

        {imageSrc ? (
          <div className="rounded-[24px] bg-[#f4f8f5] p-4 text-center ring-1 ring-[#e2eadf]">
            <img src={imageSrc} alt="QR Code PIX para pagamento do agendamento" className="mx-auto h-64 w-64 max-w-full rounded-2xl bg-white object-contain p-3 shadow-sm" />
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-[24px] bg-[#f4f8f5] p-6 text-center text-slate-500 ring-1 ring-[#e2eadf]">
            <div>
              <QrCode className="mx-auto mb-3 text-[#0d6b54]" size={42} />
              <p className="font-bold">QR Code ainda não foi recebido.</p>
            </div>
          </div>
        )}

        {pixCode && (
          <div className="mt-5">
            <label className="text-xs font-black uppercase tracking-[.12em] text-slate-400">PIX copia e cola</label>
            <textarea readOnly value={pixCode} className="mt-2 h-24 w-full resize-none rounded-2xl border border-[#d7eadf] bg-[#f8fbf9] p-3 text-xs font-semibold text-slate-600 outline-none" />
            <button type="button" onClick={copyPixCode} className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] px-5 font-black text-white transition hover:bg-[#095642]">
              <Copy size={18} /> {copied ? "Código copiado" : "Copiar código PIX"}
            </button>
          </div>
        )}

        {payment?.ticket_url && (
          <a href={payment.ticket_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[#d7eadf] bg-white px-5 font-black text-[#0d6b54] transition hover:border-[#0d6b54]">
            <ExternalLink size={18} /> Abrir pagamento
          </a>
        )}

        {!hasPaymentData && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            O agendamento foi salvo, mas o provedor ainda não retornou o PIX. Confira se o token do Mercado Pago está ativo nas configurações de pagamento.
          </div>
        )}
      </div>
    </aside>
  );
}

function SectionHeading({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-4 py-2 text-sm font-black uppercase tracking-[.12em] text-[#0d6b54]"><Icon size={16} /> Etapa</span>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">{title}</h2>
        <p className="mt-2 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-[#e2eadf]">
      <div className="text-xs font-black uppercase tracking-[.12em] text-slate-400">{label}</div>
      <div className="mt-1 break-words text-lg font-black text-[#12382f]">{value || "-"}</div>
    </div>
  );
}

function InfoDark({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="text-xs font-black uppercase tracking-[.12em] text-white/48">{label}</div>
      <div className="mt-1 break-words text-base font-black text-white">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = true }) {
  return (
    <label className="grid gap-2 font-bold text-slate-600">
      {label}
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-[52px] rounded-2xl border border-[#d7eadf] bg-white px-4 outline-none focus:border-[#0d6b54]" />
    </label>
  );
}
