import React, { useEffect, useState } from "react";
import { CalendarDays, LogOut, PawPrint, Plus, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";

async function getData(path) {
  const token = localStorage.getItem("spa_customer_token");
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível carregar os dados.");
  return data;
}

function date(value) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "A confirmar";
}

export default function MobileAccountPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("spa_customer") || "null"));
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [me, petData, appointmentData] = await Promise.all([getData("/customer/me"), getData("/customer/pets"), getData("/customer/appointments")]);
      setCustomer(me);
      setPets(Array.isArray(petData) ? petData : []);
      setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      localStorage.setItem("spa_customer", JSON.stringify(me));
    } catch (err) {
      setError(err.message || "Erro ao carregar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function logout() {
    localStorage.removeItem("spa_customer_token");
    localStorage.removeItem("spa_customer");
    navigate("/mobile/login", { replace: true });
  }

  return (
    <MobileShell title="Minha conta">
      <section className="px-5 py-5">
        <div className="rounded-2xl bg-[#e7f4ed] p-5">
          <p className="text-sm font-bold text-[#0d6b54]">Olá,</p>
          <h1 className="text-2xl font-black">{customer?.name || "cliente"}</h1>
          <Link to="/mobile/agendar" className="mt-4 flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[#0d6b54] font-black text-white"><Plus size={19} />Novo agendamento</Link>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={load} className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#e2eadf] bg-white font-black"><RefreshCw size={17} />Atualizar</button>
          <button onClick={logout} className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 font-black text-red-700"><LogOut size={17} />Sair</button>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
        <h2 className="mb-3 mt-7 text-lg font-black">Próximos horários</h2>
        {loading && <p className="rounded-xl bg-white p-4 text-sm font-bold text-slate-400">Carregando...</p>}
        {!loading && !appointments.length && <p className="rounded-xl bg-white p-5 text-center text-sm font-bold text-slate-400 ring-1 ring-[#e2eadf]">Nenhum agendamento ainda.</p>}
        <div className="grid gap-3">
          {appointments.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-4 ring-1 ring-[#e2eadf]">
              <div className="flex items-center justify-between gap-2">
                <strong>{item.pet_name || "Seu pet"}</strong>
                <span className="rounded-full bg-[#e7f4ed] px-3 py-1 text-xs font-black text-[#0d6b54]">{item.status || "Pendente"}</span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-500"><CalendarDays size={15} />{date(item.scheduled_at || item.date)}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{item.service_name || "Atendimento"}</p>
            </div>
          ))}
        </div>
        <h2 className="mb-3 mt-7 text-lg font-black">Meus pets</h2>
        <div className="grid gap-2">
          {pets.map((pet) => <div key={pet.id} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-[#e2eadf]"><PawPrint className="text-[#0d6b54]" /><strong>{pet.name}</strong></div>)}
        </div>
      </section>
    </MobileShell>
  );
}
