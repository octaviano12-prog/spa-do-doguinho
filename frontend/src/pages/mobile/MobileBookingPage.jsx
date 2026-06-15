import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock, Copy, CreditCard, ExternalLink, PawPrint, QrCode, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import MobileShell from "../../components/mobile/MobileShell";

const API_PUBLIC = "/api/public";
const API_URL = "/api";
const steps = ["Pet", "Serviço", "Horário", "Finalizar"];

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function price(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

function shortDay(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" });
}

export default function MobileBookingPage() {
  const token = localStorage.getItem("spa_customer_token");
  const savedCustomer = JSON.parse(localStorage.getItem("spa_customer") || "null");
  const [step, setStep] = useState(0);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({ pix_enabled: 1, card_enabled: 1, cash_enabled: 1 });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({ petId: "", petName: "", serviceId: "", date: "", time: "", paymentMethod: "pix", notes: "" });
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return isoDate(date);
  }), []);
  const service = services.find((item) => String(item.id) === String(form.serviceId));
  const pet = pets.find((item) => String(item.id) === String(form.petId));
  const selectedPrice = servicePrice(service, pet);
  const selectedDuration = serviceDuration(service, pet);

  useEffect(() => {
    async function load() {
      try {
        const [serviceResponse, petsResponse, paymentResponse] = await Promise.all([
          fetch(`${API_PUBLIC}/services`),
          fetch(`${API_URL}/customer/pets`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_PUBLIC}/payment-settings`).catch(() => null)
        ]);
        const serviceData = await serviceResponse.json();
        const petsData = await petsResponse.json();
        setServices(Array.isArray(serviceData) ? serviceData.filter((item) => Number(item.active ?? 1) === 1) : []);
        setPets(Array.isArray(petsData) ? petsData : []);
        if (paymentResponse?.ok) {
          const paymentData = await paymentResponse.json();
          setPaymentSettings((current) => ({ ...current, ...paymentData }));
        }
      } catch {
        setError("Não foi possível carregar seus dados agora.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const paymentOptions = [
    Number(paymentSettings.pix_enabled ?? 1) ? ["pix", QrCode, "PIX"] : null,
    Number(paymentSettings.card_enabled ?? 1) ? ["card", CreditCard, "Cartão"] : null,
    Number(paymentSettings.cash_enabled ?? 1) ? ["presencial", Wallet, "Na loja"] : null
  ].filter(Boolean);

  useEffect(() => {
    if (paymentOptions.length && !paymentOptions.some(([method]) => method === form.paymentMethod)) {
      choose("paymentMethod", paymentOptions[0][0]);
    }
  }, [paymentSettings]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.serviceId || !form.date) return setSlots([]);
      setSlotsLoading(true);
      try {
        const response = await fetch(`${API_PUBLIC}/available-slots?service_id=${form.serviceId}&date=${form.date}&duration=${selectedDuration}`);
        const data = await response.json();
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      } catch {
        setSlots([]);
        setError("Não foi possível buscar horários.");
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, [form.date, form.serviceId, selectedDuration]);

  function choose(field, value) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function next() {
    if (step === 0 && !(form.petId || form.petName.trim())) return setError("Escolha ou informe seu pet.");
    if (step === 1 && !form.serviceId) return setError("Escolha um serviço.");
    if (step === 2 && !(form.date && form.time)) return setError("Escolha dia e horário.");
    setError("");
    setStep((current) => Math.min(3, current + 1));
  }

  async function finish() {
    setSaving(true);
    setError("");
    try {
      let petId = form.petId;
      let finalPetName = pet?.name || form.petName;
      if (!petId) {
        const petResponse = await fetch(`${API_URL}/customer/pets`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: form.petName, species: "Cachorro" })
        });
        const petData = await petResponse.json();
        if (!petResponse.ok) throw new Error(petData.error || "Erro ao salvar seu pet.");
        petId = petData.id;
        finalPetName = petData.name;
      }
      const response = await fetch(`${API_URL}/customer/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao confirmar agendamento.");
      setDone({ ...data, pet_name: finalPetName, service_name: service?.name, booked_date: form.date, booked_time: form.time });
    } catch (err) {
      setError(err.message || "Erro ao confirmar agendamento.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    const pixPayment = done.payment?.method === "pix" ? done.payment : null;

    return (
      <MobileShell title="Agendamento">
        <section className="px-5 py-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0d6b54] text-white"><Check size={42} /></span>
          <h1 className="mt-5 text-3xl font-black">Agendado!</h1>
          <p className="mt-2 text-slate-500">Seu horário foi reservado com sucesso.</p>
          <div className="mt-7 rounded-2xl bg-white p-5 text-left ring-1 ring-[#e2eadf]">
            <Info label="Pet" value={done.pet_name || pet?.name || form.petName} />
            <Info label="Serviço" value={done.service_name || service?.name || "Serviço"} />
            <Info label="Horário" value={`${done.booked_date || form.date} às ${done.booked_time || form.time}`} />
          </div>
          {pixPayment && <PixMobileCard payment={pixPayment} />}
          <Link to="/mobile/conta" className="mt-6 flex min-h-[56px] items-center justify-center rounded-xl bg-[#0d6b54] font-black text-white">Ver meus agendamentos</Link>
        </section>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Agendar">
      <section className="px-5 pb-5 pt-4">
        <h1 className="text-2xl font-black">Novo agendamento</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Olá, {savedCustomer?.name?.split(" ")[0] || "cliente"}.</p>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <div key={label} className={`rounded-xl px-1 py-3 text-center text-xs font-black ${index <= step ? "bg-[#0d6b54] text-white" : "bg-[#e7f4ed] text-[#0d6b54]"}`}>
              {label}
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 pb-6">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-[#e2eadf]">
          {loading ? <p className="py-8 text-center font-bold text-slate-400">Carregando...</p> : (
            <>
              {step === 0 && <PetStep pets={pets} form={form} choose={choose} />}
              {step === 1 && <ServiceStep services={services} pet={pet} form={form} choose={choose} />}
              {step === 2 && <TimeStep days={days} form={form} choose={choose} slots={slots} loading={slotsLoading} />}
              {step === 3 && <ReviewStep form={form} pet={pet} service={service} amount={selectedPrice} paymentOptions={paymentOptions} choose={choose} />}
            </>
          )}
        </div>
        {error && <p className="mt-3 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
        <div className="mt-4 flex gap-3">
          {step > 0 && <button onClick={() => setStep((current) => current - 1)} className="min-h-[56px] flex-1 rounded-xl border border-[#e2eadf] bg-white font-black">Voltar</button>}
          <button onClick={step === 3 ? finish : next} disabled={saving || loading} className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0d6b54] font-black text-white disabled:opacity-50">
            {saving ? "Salvando..." : step === 3 ? "Confirmar" : "Continuar"} <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </MobileShell>
  );
}

function PetStep({ pets, form, choose }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-black">Qual pet será cuidado?</h2>
      <div className="grid gap-3">
        {pets.map((pet) => <Choice key={pet.id} active={String(form.petId) === String(pet.id)} icon={PawPrint} title={pet.name} detail={pet.breed || pet.species || "Pet"} onClick={() => choose("petId", pet.id)} />)}
        <label className="rounded-xl border border-[#e2eadf] px-4 py-3">
          <span className="mb-2 block text-xs font-black uppercase text-slate-400">Novo pet</span>
          <input value={form.petName} onChange={(event) => { choose("petName", event.target.value); choose("petId", ""); }} placeholder="Nome do pet" className="w-full bg-transparent font-bold outline-none" />
        </label>
      </div>
    </div>
  );
}

function ServiceStep({ services, pet, form, choose }) {
  return <div><h2 className="mb-4 text-xl font-black">Escolha o serviço</h2><div className="grid gap-3">{services.map((item) => <Choice key={item.id} active={String(form.serviceId) === String(item.id)} icon={Sparkles} title={item.name} detail={price(servicePrice(item, pet))} onClick={() => choose("serviceId", item.id)} />)}</div></div>;
}

function TimeStep({ days, form, choose, slots, loading }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-black">Dia e horário</h2>
      <div className="flex gap-2 overflow-x-auto pb-3">{days.map((day) => <button key={day} onClick={() => { choose("date", day); choose("time", ""); }} className={`min-h-[62px] min-w-[74px] rounded-xl text-sm font-black ${form.date === day ? "bg-[#0d6b54] text-white" : "bg-[#e7f4ed] text-[#0d6b54]"}`}><CalendarDays size={16} className="mx-auto mb-1" />{shortDay(day)}</button>)}</div>
      {form.date && (
        <div className="mt-4">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm font-bold text-slate-400">Buscando horários...</p>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-5 text-center">
              <Clock className="mx-auto mb-2 text-amber-600" size={24} />
              <p className="font-black text-amber-800">Não temos horários disponíveis nesta data.</p>
              <p className="mt-1 text-sm font-semibold text-amber-700">Escolha outro dia para continuar o agendamento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => <button key={slot.time} onClick={() => choose("time", slot.time)} className={`min-h-[54px] rounded-xl text-sm font-black ${form.time === slot.time ? "bg-[#0d6b54] text-white" : "bg-slate-50"}`}><Clock size={15} className="mx-auto mb-1" />{slot.label}</button>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewStep({ form, pet, service, amount, paymentOptions, choose }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-black">Confirme a reserva</h2>
      <Info label="Pet" value={pet?.name || form.petName} />
      <Info label="Serviço" value={service?.name} />
      <Info label="Data e hora" value={`${form.date} às ${form.time}`} />
      <Info label="Valor" value={price(amount)} />
      <h3 className="mb-3 mt-5 text-sm font-black uppercase text-slate-400">Pagamento</h3>
      <div className="grid grid-cols-2 gap-2">
        {paymentOptions.map(([method, Icon, text]) => <button key={method} onClick={() => choose("paymentMethod", method)} className={`flex min-h-[56px] items-center justify-center gap-2 rounded-xl font-black ${form.paymentMethod === method ? "bg-[#0d6b54] text-white" : "bg-[#e7f4ed] text-[#0d6b54]"}`}><Icon size={18} />{text}</button>)}
      </div>
      {form.paymentMethod === "pix" && <p className="mt-3 rounded-xl bg-[#f4fbf6] p-3 text-sm font-bold text-[#0d6b54]">O QR Code PIX aparece após confirmar.</p>}
      <textarea value={form.notes} onChange={(event) => choose("notes", event.target.value)} rows={3} placeholder="Observações (opcional)" className="mt-4 w-full rounded-xl border border-[#e2eadf] p-3 outline-none" />
    </div>
  );
}

function PixMobileCard({ payment }) {
  const [copied, setCopied] = useState(false);
  const imageSrc = pixImageSrc(payment);
  const pixCode = payment?.qr_code || "";

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
    <div className="mt-5 rounded-2xl bg-[#12382f] p-5 text-left text-white">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0d6b54]"><QrCode size={24} /></span>
        <div>
          <h2 className="text-xl font-black">PIX gerado</h2>
          <p className="text-sm font-semibold text-white/65">{paymentStatusLabel(payment?.status)}</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-white p-4 text-center text-[#12382f]">
        <div className="mb-3 text-left text-xs font-black uppercase tracking-[.12em] text-slate-400">Valor {price(payment?.amount)}</div>
        {imageSrc ? <img src={imageSrc} alt="QR Code PIX" className="mx-auto h-56 w-56 rounded-xl bg-white object-contain p-2" /> : <p className="py-6 text-sm font-bold text-slate-500">QR Code ainda não recebido.</p>}
        {pixCode && (
          <>
            <textarea readOnly value={pixCode} className="mt-4 h-20 w-full resize-none rounded-xl border border-[#e2eadf] bg-[#f8fbf9] p-3 text-xs font-semibold text-slate-600 outline-none" />
            <button type="button" onClick={copyPixCode} className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0d6b54] font-black text-white">
              <Copy size={17} /> {copied ? "Copiado" : "Copiar PIX"}
            </button>
          </>
        )}
        {payment?.ticket_url && <a href={payment.ticket_url} target="_blank" rel="noreferrer" className="mt-3 flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#e2eadf] bg-white font-black text-[#0d6b54]"><ExternalLink size={17} /> Abrir pagamento</a>}
      </div>
    </div>
  );
}

function Choice({ active, icon: Icon, title, detail, onClick }) {
  return <button onClick={onClick} className={`flex min-h-[68px] items-center gap-3 rounded-xl border p-3 text-left ${active ? "border-[#0d6b54] bg-[#e7f4ed]" : "border-[#e2eadf]"}`}><Icon size={23} className="text-[#0d6b54]" /><span className="flex-1"><strong className="block">{title}</strong><small className="font-semibold text-slate-500">{detail}</small></span>{active && <Check size={19} className="text-[#0d6b54]" />}</button>;
}

function Info({ label, value }) {
  return <div className="mb-3 flex justify-between gap-3 rounded-xl bg-[#f4f8f5] p-3"><span className="text-sm font-bold text-slate-500">{label}</span><strong className="text-right text-sm">{value || "-"}</strong></div>;
}
