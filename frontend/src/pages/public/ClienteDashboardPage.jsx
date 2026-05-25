import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Heart,
  LogOut,
  PawPrint,
  Plus,
  RefreshCw,
  ShieldCheck,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";

function formatDate(value) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
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
      const [meData, petsData, appointmentsData, paymentsData] = await Promise.all([
        customerRequest("/customer/me"),
        customerRequest("/customer/pets"),
        customerRequest("/customer/appointments"),
        customerRequest("/customer/payments")
      ]);

      setCustomer(meData);
      localStorage.setItem("spa_customer", JSON.stringify(meData));
      setPets(Array.isArray(petsData) ? petsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
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
                    Nenhum agendamento encontrado.
                  </div>
                )}
                {!loading && nextAppointments.map((item) => (
                  <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-4 md:items-center">
                    <Info label="Pet" value={item.pet_name || `Pet #${item.pet_id || "-"}`} />
                    <Info label="Serviço" value={item.service_name || `Serviço #${item.service_id || "-"}`} />
                    <Info label="Data" value={formatDate(item.scheduled_at || item.date)} />
                    <div className="md:text-right">
                      <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 font-black text-emerald-700">
                        {item.status || "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-8 shadow-xl ring-1 ring-black/5">
              <h2 className="mb-6 text-3xl font-black">Meus pets</h2>
              <div className="space-y-4">
                {loading && <div className="text-slate-500">Carregando...</div>}
                {!loading && pets.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-slate-500">
                    Nenhum pet cadastrado ainda.
                  </div>
                )}
                {!loading && pets.map((pet) => (
                  <div key={pet.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <Heart size={24} />
                    </div>
                    <div>
                      <div className="font-black">{pet.name}</div>
                      <div className="text-sm text-slate-500">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                <Clock className="mb-3 text-[#0d6b54]" />
                <h3 className="font-black">Em breve</h3>
                <p className="mt-2 text-slate-600">Carteirinha, vacinas, pagamentos e histórico completo por pet.</p>
              </div>
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
