import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  Heart,
  LogOut,
  PawPrint,
  Plus,
  RefreshCw,
  ShieldCheck,
  Syringe,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";

function parseDate(value) {
  if (!value) return null;
  const text = String(value).replace(" ", "T");
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return "A confirmar";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateOnly(value) {
  const date = parseDate(value);
  if (!date) return "A confirmar";
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusLabel(value) {
  const key = String(value || "pending").toLowerCase();
  const labels = {
    pending: "Pendente",
    pendente: "Pendente",
    confirmed: "Confirmado",
    confirmado: "Confirmado",
    done: "Concluído",
    completed: "Concluído",
    concluido: "Concluído",
    paid: "Pago",
    approved: "Pago",
    pago: "Pago",
    canceled: "Cancelado",
    cancelado: "Cancelado",
    refunded: "Estornado"
  };
  return labels[key] || String(value || "Pendente");
}

function statusClass(value) {
  const key = String(value || "pending").toLowerCase();
  if (["paid", "approved", "pago", "done", "completed", "concluido", "confirmed", "confirmado"].includes(key)) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (["canceled", "cancelado", "refunded"].includes(key)) {
    return "bg-red-100 text-red-700";
  }
  return "bg-amber-100 text-amber-700";
}

function sizeLabel(value) {
  const key = String(value || "").toLowerCase();
  const labels = { pequeno: "Pequeno", medio: "Médio", grande: "Grande", gigante: "Gigante" };
  return labels[key] || "Em atualização";
}

async function customerRequest(path) {
  const token = localStorage.getItem("spa_customer_token");

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao carregar dados do cliente.");
  }

  return data;
}

export default function ClienteDashboardPage() {
  const [customer, setCustomer] = useState(null);
  const [pets, setPets] = useState([]);
  const [petRecords, setPetRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function logout() {
    localStorage.removeItem("spa_customer_token");
    localStorage.removeItem("spa_customer");
    window.location.href = "/cliente-login";
  }

  async function loadData() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("spa_customer_token");

    if (!token) {
      window.location.href = "/cliente-login";
      return;
    }

    try {
      const [meData, petsData, appointmentsData, paymentsData, recordsData] = await Promise.all([
        customerRequest("/customer/me"),
        customerRequest("/customer/pets"),
        customerRequest("/customer/appointments"),
        customerRequest("/customer/payments"),
        customerRequest("/customer/pet-records").catch(() => [])
      ]);

      const petList = Array.isArray(petsData) ? petsData : [];
      const recordList = Array.isArray(recordsData) ? recordsData : [];

      setCustomer(meData);
      localStorage.setItem("spa_customer", JSON.stringify(meData));
      setPets(petList);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setPetRecords(recordList);
      setSelectedPetId((current) => {
        const options = recordList.length ? recordList : petList;
        if (current && options.some((pet) => Number(pet.id) === Number(current))) return current;
        return options[0]?.id || null;
      });
    } catch (err) {
      setError(err.message || "Erro ao carregar área do cliente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const nextAppointments = useMemo(() => appointments.slice(0, 5), [appointments]);

  const petRecordList = useMemo(() => {
    if (petRecords.length) return petRecords;

    return pets.map((pet) => {
      const petAppointments = appointments.filter((item) => Number(item.pet_id) === Number(pet.id));
      const petPayments = payments.filter((payment) => petAppointments.some((item) => Number(item.id) === Number(payment.appointment_id)));
      return {
        ...pet,
        appointments: petAppointments,
        payments: petPayments,
        vaccinations: [],
        service_history: petAppointments.map((appointment) => ({
          id: `appointment-${appointment.id}`,
          date: appointment.scheduled_at || appointment.date,
          service_name: appointment.service_name,
          professional: "SPA do Doguinho",
          notes: appointment.notes || "Registro gerado pelo agendamento.",
          status: appointment.status
        }))
      };
    });
  }, [appointments, payments, petRecords, pets]);

  const selectedPet = useMemo(() => {
    if (!petRecordList.length) return null;
    return petRecordList.find((pet) => Number(pet.id) === Number(selectedPetId)) || petRecordList[0];
  }, [petRecordList, selectedPetId]);

  return (
    <PublicLayout>
      <main className="min-h-[calc(100vh-80px)] overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="bg-[#e7f4ed] px-5 py-12 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 font-black text-emerald-900 shadow-sm">
                <User size={18} />
                Área do cliente
              </span>
              <h1 className="mt-5 text-5xl font-black md:text-6xl">
                Olá, {customer?.name || "cliente"}!
              </h1>
              <p className="mt-3 max-w-3xl text-lg text-slate-600">
                Acompanhe seus pets, agendamentos, pagamentos e histórico de atendimento.
              </p>
            </div>

            <div className="hidden overflow-hidden rounded-[32px] bg-white p-3 shadow-xl ring-1 ring-black/5 lg:block">
              <img src="/images/sobre-hero.webp" alt="Área do cliente" className="h-64 w-full rounded-[24px] object-cover" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] space-y-8 px-5 py-10 md:px-8">
          <div className="flex flex-wrap gap-3">
            <button onClick={loadData} className="flex items-center gap-2 rounded-2xl border border-[#e2eadf] bg-white px-6 py-4 font-black text-[#12382f] shadow-sm transition hover:border-[#0d6b54]">
              <RefreshCw size={20} />
              Atualizar
            </button>
            <button onClick={logout} className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 font-black text-red-700 transition hover:bg-red-100">
              <LogOut size={20} />
              Sair
            </button>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["Meus pets", pets.length, PawPrint],
              ["Agendamentos", appointments.length, CalendarDays],
              ["Pagamentos", payments.length, CreditCard],
              ["Status", "Ativo", ShieldCheck]
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-black/5">
                <Icon className="mb-4 text-[#0d6b54]" size={34} />
                <div className="font-bold text-slate-500">{label}</div>
                <div className="mt-2 text-3xl font-black">{loading ? "..." : value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[34px] bg-white p-8 shadow-xl ring-1 ring-black/5 xl:col-span-2">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">Meus agendamentos</h2>
                  <p className="mt-1 text-slate-500">Histórico e próximos atendimentos.</p>
                </div>
                <Link to="/agendamento" className="flex items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] px-5 py-3 font-black text-white transition hover:bg-[#095642]">
                  <Plus size={18} />
                  Agendar
                </Link>
              </div>

              <div className="space-y-4">
                {loading && <div className="text-slate-500">Carregando...</div>}
                {!loading && nextAppointments.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">
                    Você ainda não tem agendamentos cadastrados.
                  </div>
                )}
                {!loading && nextAppointments.map((item) => (
                  <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-4 md:items-center">
                    <Info label="Pet" value={item.pet_name || `Pet #${item.pet_id || "-"}`} />
                    <Info label="Serviço" value={item.service_name || `Serviço #${item.service_id || "-"}`} />
                    <Info label="Data" value={formatDate(item.scheduled_at || item.date)} />
                    <div className="md:text-right">
                      <span className={`inline-flex rounded-full px-4 py-2 font-black ${statusClass(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-8 shadow-xl ring-1 ring-black/5">
              <h2 className="mb-6 text-3xl font-black">Meus pets</h2>
              <div className="space-y-3">
                {loading && <div className="text-slate-500">Carregando...</div>}
                {!loading && petRecordList.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-slate-500">
                    Cadastre seu primeiro pet no próximo agendamento.
                  </div>
                )}
                {!loading && petRecordList.map((pet) => {
                  const active = Number(selectedPet?.id) === Number(pet.id);
                  return (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`flex w-full gap-4 rounded-2xl border p-5 text-left transition ${active ? "border-[#0d6b54] bg-emerald-50 shadow-sm" : "border-slate-100 bg-slate-50 hover:border-emerald-200"}`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                        <Heart size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black">{pet.name}</div>
                        <div className="text-sm text-slate-500">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!loading && selectedPet && <PetRecordPanel pet={selectedPet} />}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs font-black uppercase text-slate-400">{label}</div>
      <div className="font-black">{value}</div>
    </div>
  );
}

function PetRecordPanel({ pet }) {
  const vaccinations = Array.isArray(pet.vaccinations) ? pet.vaccinations : [];
  const payments = Array.isArray(pet.payments) ? pet.payments : [];
  const serviceHistory = Array.isArray(pet.service_history) ? pet.service_history : [];
  const appointments = Array.isArray(pet.appointments) ? pet.appointments : [];

  return (
    <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d6b54] text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-black">Carteirinha digital</h3>
          <p className="mt-1 text-sm text-slate-600">Dados completos de {pet.name} para consulta rápida.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DetailTile label="Espécie" value={pet.species || "Pet"} />
        <DetailTile label="Raça" value={pet.breed || "Em atualização"} />
        <DetailTile label="Peso" value={pet.weight ? `${pet.weight} kg` : "Em atualização"} />
        <DetailTile label="Porte" value={sizeLabel(pet.size_category)} />
        <DetailTile label="Nascimento" value={formatDateOnly(pet.birth_date)} />
        <DetailTile label="Banho" value={pet.estimated_bath_time ? `${pet.estimated_bath_time} min` : "Em atualização"} />
      </div>

      {(pet.allergies || pet.behavior || pet.notes) && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-600">
          {pet.allergies && <p><strong>Alergias:</strong> {pet.allergies}</p>}
          {pet.behavior && <p><strong>Comportamento:</strong> {pet.behavior}</p>}
          {pet.notes && <p><strong>Observações:</strong> {pet.notes}</p>}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MiniStat icon={Syringe} label="Vacinas" value={vaccinations.length} />
        <MiniStat icon={CreditCard} label="Pagamentos" value={payments.length} />
        <MiniStat icon={FileText} label="Histórico" value={serviceHistory.length || appointments.length} />
      </div>

      <RecordSection title="Vacinas" icon={Syringe} count={vaccinations.length} isEmpty={!vaccinations.length} emptyText="A carteirinha de vacinação ainda não tem registros para este pet.">
        {vaccinations.slice(0, 4).map((item) => (
          <RecordItem key={`${item.source_table || "vaccine"}-${item.id}`} title={item.vaccine_name || "Vacina"} badge={formatDateOnly(item.next_dose_date)}>
            Aplicada em {formatDateOnly(item.date)}{item.notes ? ` • ${item.notes}` : ""}
          </RecordItem>
        ))}
      </RecordSection>

      <RecordSection title="Pagamentos" icon={CreditCard} count={payments.length} isEmpty={!payments.length} emptyText="Os pagamentos deste pet aparecerão aqui após os agendamentos.">
        {payments.slice(0, 4).map((item) => (
          <RecordItem key={item.id} title={item.description || item.service_name || `Pagamento #${item.id}`} badge={statusLabel(item.status)} badgeClass={statusClass(item.status)}>
            {formatCurrency(item.amount)} • {item.method || "Pagamento"} • {formatDateOnly(item.paid_at || item.created_at || item.scheduled_at)}
          </RecordItem>
        ))}
      </RecordSection>

      <RecordSection title="Histórico" icon={FileText} count={serviceHistory.length || appointments.length} isEmpty={!serviceHistory.length && !appointments.length} emptyText="O histórico completo deste pet aparecerá aqui conforme os atendimentos forem registrados.">
        {serviceHistory.slice(0, 4).map((item) => (
          <RecordItem key={item.id} title={item.service_name || "Atendimento"} badge={formatDateOnly(item.date)}>
            {item.professional || "SPA do Doguinho"}{item.notes ? ` • ${item.notes}` : ""}
          </RecordItem>
        ))}
      </RecordSection>
    </div>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-3">
      <div className="text-[11px] font-black uppercase text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-black text-[#12382f] break-words">{value}</div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-emerald-100">
      <Icon className="mx-auto mb-2 text-[#0d6b54]" size={20} />
      <div className="text-xl font-black">{value}</div>
      <div className="text-[11px] font-black uppercase text-slate-400">{label}</div>
    </div>
  );
}

function RecordSection({ title, icon: Icon, count, emptyText, isEmpty, children }) {
  return (
    <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 font-black">
          <Icon size={18} className="text-[#0d6b54]" />
          {title}
        </h4>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-[#0d6b54]">{count}</span>
      </div>
      {isEmpty ? <p className="text-sm text-slate-500">{emptyText}</p> : <div className="space-y-2">{children}</div>}
    </div>
  );
}

function RecordItem({ title, badge, badgeClass = "bg-slate-100 text-slate-600", children }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-2">
        <strong className="text-sm leading-snug">{title}</strong>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-black ${badgeClass}`}>{badge}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{children}</p>
    </div>
  );
}
