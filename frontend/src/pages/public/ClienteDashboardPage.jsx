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
import { apiRequest } from "../../lib/api";

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

export default function ClienteDashboardPage() {
  const [customer, setCustomer] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  function logout() {
    localStorage.removeItem("spa_customer_token");
    localStorage.removeItem("spa_customer");
    window.location.href = "/cliente-login";
  }

  async function loadData() {
    setLoading(true);

    const savedCustomer = localStorage.getItem("spa_customer");
    const token = localStorage.getItem("spa_customer_token");

    if (!savedCustomer || !token) {
      window.location.href = "/cliente-login";
      return;
    }

    const parsedCustomer = JSON.parse(savedCustomer);
    setCustomer(parsedCustomer);

    try {
      const [petsData, appointmentsData, paymentsData] = await Promise.all([
        apiRequest("/pets").catch(() => []),
        apiRequest("/appointments").catch(() => []),
        apiRequest("/payments").catch(() => [])
      ]);

      const customerPets = Array.isArray(petsData)
        ? petsData.filter((item) => Number(item.customer_id) === Number(parsedCustomer.id))
        : [];

      const customerAppointments = Array.isArray(appointmentsData)
        ? appointmentsData.filter((item) => Number(item.customer_id) === Number(parsedCustomer.id))
        : [];

      const customerPayments = Array.isArray(paymentsData)
        ? paymentsData.filter((item) => {
            return customerAppointments.some((appointment) => Number(appointment.id) === Number(item.appointment_id));
          })
        : [];

      setPets(customerPets);
      setAppointments(customerAppointments);
      setPayments(customerPayments);
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
      <main className="relative overflow-hidden bg-[#06150d] min-h-[calc(100vh-80px)] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e44,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b22,transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <User size={18} />
                Área do cliente
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white mt-5">
                Olá, {customer?.name || "cliente"}!
              </h1>
              <p className="text-white/70 mt-3 text-lg max-w-3xl">
                Acompanhe seus pets, agendamentos, pagamentos e histórico de atendimento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={loadData} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 transition">
                <RefreshCw size={20} />
                Atualizar
              </button>
              <button onClick={logout} className="bg-red-500/20 hover:bg-red-500/30 border border-red-300/20 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 transition">
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["Meus pets", pets.length, PawPrint],
              ["Agendamentos", appointments.length, CalendarDays],
              ["Pagamentos", payments.length, CreditCard],
              ["Status", "Ativo", ShieldCheck]
            ].map(([label, value, Icon]) => (
              <div key={label} className="bg-white rounded-[30px] p-6 border border-green-100 shadow-2xl">
                <Icon className="text-green-700 mb-4" size={34} />
                <div className="text-slate-500 font-bold">{label}</div>
                <div className="text-3xl font-black text-slate-900 mt-2">{loading ? "..." : value}</div>
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-[34px] p-8 shadow-2xl border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Meus agendamentos</h2>
                  <p className="text-slate-500 mt-1">Histórico e próximos atendimentos.</p>
                </div>
                <Link to="/agendamento" className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 transition">
                  <Plus size={18} />
                  Agendar
                </Link>
              </div>

              <div className="space-y-4">
                {loading && <div className="text-slate-500">Carregando...</div>}
                {!loading && nextAppointments.length === 0 && (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 border">
                    Nenhum agendamento encontrado.
                  </div>
                )}
                {!loading && nextAppointments.map((item) => (
                  <div key={item.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="text-xs text-slate-400 font-black uppercase">Pet</div>
                      <div className="font-black text-slate-900">{item.pet_name || `Pet #${item.pet_id || "-"}`}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-black uppercase">Serviço</div>
                      <div className="font-black text-slate-900">{item.service_name || `Serviço #${item.service_id || "-"}`}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-black uppercase">Data</div>
                      <div className="font-black text-slate-900">{formatDate(item.scheduled_at || item.date)}</div>
                    </div>
                    <div className="md:text-right">
                      <span className="inline-flex bg-green-100 text-green-700 px-4 py-2 rounded-full font-black">
                        {item.status || "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[34px] p-8 shadow-2xl border border-green-100">
              <h2 className="text-3xl font-black text-slate-900 mb-6">Meus pets</h2>
              <div className="space-y-4">
                {loading && <div className="text-slate-500">Carregando...</div>}
                {!loading && pets.length === 0 && (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 border">
                    Nenhum pet cadastrado ainda.
                  </div>
                )}
                {!loading && pets.map((pet) => (
                  <div key={pet.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                      <Heart size={24} />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">{pet.name}</div>
                      <div className="text-slate-500 text-sm">{pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-green-50 rounded-3xl p-6 border border-green-100">
                <Clock className="text-green-700 mb-3" />
                <h3 className="font-black text-slate-900">Em breve</h3>
                <p className="text-slate-500 mt-2">Carteirinha, vacinas, pagamentos e histórico completo por pet.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
