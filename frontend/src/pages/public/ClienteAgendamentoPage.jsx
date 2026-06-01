import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  PawPrint,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  User,
  Wallet
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = import.meta.env.VITE_API_URL || "https://spadodoguinho.com.br/api";
const API_PUBLIC = `${API_URL}/public`;

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

  const paymentOptions = useMemo(() => [
    Number(paymentSettings.pix_enabled ?? 1) ? ["pix", CreditCard, "PIX", "Pagamento instantâneo"] : null,
    Number(paymentSettings.card_enabled ?? 1) ? ["card", CreditCard, "Cartão", "Crédito ou débito"] : null,
    Number(paymentSettings.cash_enabled ?? 1) ? ["presencial", Wallet, "Na loja", "Pague no atendimento"] : null
  ].filter(Boolean), [paymentSettings]);

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
  }, [paymentOptions]);

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
      setDone({ ...data, pet_name: finalPetName, service_name: selectedService?.name });
    } catch (err) {
      setError(err.message || "Não foi possível confirmar o agendamento.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <PublicLayout>
        <main className="bg-[#fffdf7] px-5 py-14 text-[#12382f] md:px-8">
          <section className="mx-auto max-w-5xl rounded-[34px] bg-white p-8 text-center shadow-2xl ring-1 ring-[#e2eadf] md:p-12">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#0d6b54] text-white shadow-xl">
              <Check size={52} />
            </span>
            <h1 className="mt-7 text-4xl font-black md:text-5xl">Agendamento confirmado!</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Seu horário foi salvo no sistema e já aparece na área do cliente e no painel administrativo.
            </p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 rounded-[28px] bg-[#f4f8f5] p-5 text-left md:grid-cols-3">
              <Info label="Pet" value={done.pet_name || draftPet.name} />
              <Info label="Serviço" value={done.service_name || selectedService?.name} />
              <Info label="Quando" value={`${fullDate(form.date)} às ${form.time}`} />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/cliente" className="rounded-2xl bg-[#0d6b54] px-7 py-4 font-black text-white shadow-lg hover:bg-[#095642]">Ver minha área</Link>
              <button onClick={() => { setDone(null); setForm(emptyForm); setStep(0); loadData(); }} className="rounded-2xl border border-[#d7eadf] bg-white px-7 py-4 font-black text-[#0d6b54] shadow-sm">Novo agendamento</button>
            </div>
          </section>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative overflow-hidden bg-[#e7f4ed] px-5 py-12 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(13,107,84,.16),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(244,200,106,.20),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-[1fr_430px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-black uppercase tracking-[.12em] text-[#0d6b54] shadow-sm">
                <CalendarDays size={16} /> Agendamento online
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.95] tracking-[-.04em] md:text-6xl">
                Escolha o cuidado ideal para o seu doguinho.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Olá{savedCustomer?.name ? `, ${savedCustomer.name.split(" ")[0]}` : ""}! Em poucos passos você escolhe serviço, pet, data, horário e confirma tudo com segurança.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  [ShieldCheck, "Dados protegidos"],
                  [PawPrint, "Pet vinculado"],
                  [CheckCircle2, "Agenda integrada"]
                ].map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/75 p-4 font-black text-[#0d6b54] shadow-sm ring-1 ring-white/80">
                    <Icon size={22} /> {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[34px] bg-white/86 p-6 shadow-2xl ring-1 ring-white/80 backdrop-blur">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d6b54] text-white"><Sparkles size={32} /></span>
                <div>
                  <div className="text-sm font-black uppercase tracking-[.12em] text-slate-400">Resumo</div>
                  <h2 className="text-2xl font-black">Seu atendimento</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <Info label="Serviço" value={selectedService?.name || "Escolha o serviço"} />
                <Info label="Pet" value={selectedPet?.name || form.newPetName || "Escolha o pet"} />
                <Info label="Data" value={form.date ? fullDate(form.date) : "Escolha a data"} />
                <Info label="Horário" value={form.time || "Escolha o horário"} />
                <div className="rounded-2xl bg-[#0d6b54] p-5 text-white">
                  <div className="text-sm font-bold text-white/70">Valor estimado</div>
                  <div className="mt-1 text-3xl font-black">{money(selectedPrice)}</div>
                  <div className="mt-1 text-sm text-white/70">Duração: {selectedDuration || 0} min</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-10 md:px-8">
          <div className="mb-8 grid gap-3 md:grid-cols-4">
            {steps.map((item, index) => (
              <button key={item.title} type="button" onClick={() => index < step && setStep(index)} className={`rounded-[24px] p-5 text-left shadow-sm ring-1 transition ${index <= step ? "bg-[#0d6b54] text-white ring-[#0d6b54]" : "bg-white text-slate-500 ring-[#e2eadf]"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl font-black ${index <= step ? "bg-white/16" : "bg-[#e7f4ed] text-[#0d6b54]"}`}>{index + 1}</span>
                  {index < step && <Check size={22} />}
                </div>
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <p className={`mt-1 text-sm font-semibold ${index <= step ? "text-white/70" : "text-slate-400"}`}>{item.text}</p>
              </button>
            ))}
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
          <label className="mt-5 grid gap-2 font-bold text-slate-600">
            Observações
            <textarea value={form.notes} onChange={(event) => onChange("notes", event.target.value)} rows={4} placeholder="Alguma alergia, comportamento ou recado especial?" className="rounded-2xl border border-[#d7eadf] bg-white p-4 outline-none" />
          </label>
        </div>
      </div>
    </div>
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

function Field({ label, value, onChange, placeholder, required = true }) {
  return (
    <label className="grid gap-2 font-bold text-slate-600">
      {label}
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-[52px] rounded-2xl border border-[#d7eadf] bg-white px-4 outline-none focus:border-[#0d6b54]" />
    </label>
  );
}
