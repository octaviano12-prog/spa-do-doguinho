import React, { useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Briefcase, CheckCircle, Clock, Lock, RefreshCw, Save, Unlock, Wallet } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyMovement = { type: "entrada", amount: "", method: "dinheiro", description: "" };
const today = () => new Date().toISOString().slice(0, 10);
const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const num = (v) => Number(String(v || 0).replace(",", ".")) || 0;
const norm = (v) => String(v || "").toLowerCase();

export default function CaixaPage() {
  const [cash, setCash] = useState([]);
  const [closings, setClosings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [movement, setMovement] = useState(emptyMovement);
  const [openingAmount, setOpeningAmount] = useState("");
  const [operator, setOperator] = useState(localStorage.getItem("spa_admin_name") || "Operador");
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [cashData, closingData, paymentsData] = await Promise.all([
        apiRequest("/cash").catch(() => []),
        apiRequest("/cashClosings").catch(() => []),
        apiRequest("/payments").catch(() => [])
      ]);
      setCash(Array.isArray(cashData) ? cashData : []);
      setClosings(Array.isArray(closingData) ? closingData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar caixa.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const dayMovements = useMemo(() => cash.filter((item) => String(item.date || item.created_at || "").slice(0, 10) === date), [cash, date]);
  const dayPayments = useMemo(() => payments.filter((item) => String(item.paid_at || item.created_at || "").slice(0, 10) === date), [payments, date]);
  const dayClosing = useMemo(() => closings.find((item) => String(item.date || item.created_at || "").slice(0, 10) === date), [closings, date]);
  const isClosed = Boolean(dayClosing?.closed_at || ["closed", "fechado"].includes(norm(dayClosing?.status)));
  const isOpen = Boolean(dayClosing) && !isClosed;

  const summary = useMemo(() => {
    const opening = Number(dayClosing?.opening_amount || dayClosing?.initial_amount || 0);
    const entries = dayMovements.filter((i) => ["entrada", "in", "income"].includes(norm(i.type))).reduce((s, i) => s + Number(i.amount || 0), 0);
    const exits = dayMovements.filter((i) => ["saida", "saída", "out", "expense"].includes(norm(i.type))).reduce((s, i) => s + Number(i.amount || 0), 0);
    const paid = dayPayments.filter((i) => ["paid", "approved", "pago"].includes(norm(i.status || i.payment_status))).reduce((s, i) => s + Number(i.amount || 0), 0);
    const expected = opening + entries + paid - exits;
    return { opening, entries, exits, paid, expected, totalIn: entries + paid };
  }, [dayMovements, dayPayments, dayClosing]);

  async function openCash(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest("/cashClosings", {
        method: "POST",
        body: JSON.stringify({ date, operator, status: "open", opening_amount: num(openingAmount), initial_amount: num(openingAmount), opened_at: new Date().toISOString() })
      });
      setOpeningAmount("");
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao abrir caixa. Verifique se a tabela cash_closings existe.");
    } finally {
      setSaving(false);
    }
  }

  async function closeCash() {
    if (!dayClosing) return;
    const counted = window.prompt("Valor contado no caixa:", String(summary.expected.toFixed(2)).replace(".", ","));
    if (!counted) return;
    const countedValue = num(counted);
    setSaving(true);
    setError("");
    try {
      await apiRequest(`/cashClosings/${dayClosing.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "closed", closed_at: new Date().toISOString(), closing_amount: countedValue, expected_amount: summary.expected, difference_amount: countedValue - summary.expected })
      });
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao fechar caixa.");
    } finally {
      setSaving(false);
    }
  }

  async function addMovement(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest("/cash", { method: "POST", body: JSON.stringify({ ...movement, date, operator, amount: num(movement.amount), status: "confirmed" }) });
      setMovement(emptyMovement);
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao lançar movimentação. Verifique se a tabela cash_movements existe.");
    } finally {
      setSaving(false);
    }
  }

  const cards = [
    ["Abertura", money(summary.opening), Unlock],
    ["Entradas", money(summary.totalIn), ArrowUpCircle],
    ["Saídas", money(summary.exits), ArrowDownCircle],
    ["Previsto", money(summary.expected), Wallet],
    [isClosed ? "Fechado" : isOpen ? "Aberto" : "Não aberto", isClosed ? "Conferido" : isOpen ? "Operando" : "Aguardando", isClosed ? Lock : Clock]
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Briefcase size={18}/> Operação de caixa</span><h1 className="text-5xl font-black text-white mt-5">Caixa</h1><p className="text-green-100/80 mt-3 max-w-3xl">Abra o caixa, registre entradas e saídas, confira recebimentos e faça o fechamento do dia.</p></div>
          <button onClick={loadData} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20"><RefreshCw size={20}/> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">{cards.map(([label, value, Icon]) => <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl"><div className="flex items-center justify-between gap-4"><div><div className="text-slate-500 font-bold">{label}</div><div className="text-2xl font-black text-slate-900 mt-2 break-words">{value}</div></div><div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center"><Icon size={26}/></div></div></div>)}</div>

        <div className="grid xl:grid-cols-[390px_minmax(0,1fr)] gap-6 items-start">
          <section className="space-y-6">
            <form onSubmit={openCash} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-5">Abrir caixa</h2>
              <div className="grid gap-4"><input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"/><input value={operator} onChange={(e)=>setOperator(e.target.value)} placeholder="Operador" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"/><input value={openingAmount} onChange={(e)=>setOpeningAmount(e.target.value)} placeholder="Valor inicial" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"/><button disabled={saving || isOpen || isClosed} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"><Unlock size={20}/> Abrir caixa</button></div>
            </form>

            <form onSubmit={addMovement} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-5">Lançamento rápido</h2>
              <div className="grid gap-4"><select value={movement.type} onChange={(e)=>setMovement({...movement,type:e.target.value})} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"><option value="entrada">Entrada</option><option value="saida">Saída</option></select><input value={movement.amount} onChange={(e)=>setMovement({...movement,amount:e.target.value})} placeholder="Valor" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"/><select value={movement.method} onChange={(e)=>setMovement({...movement,method:e.target.value})} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"><option value="dinheiro">Dinheiro</option><option value="pix">PIX</option><option value="cartao">Cartão</option><option value="outro">Outro</option></select><input value={movement.description} onChange={(e)=>setMovement({...movement,description:e.target.value})} placeholder="Descrição" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none"/><button disabled={saving || !isOpen} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"><Save size={20}/> Lançar</button></div>
            </form>
          </section>

          <section className="space-y-6">
            <div className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h2 className="text-2xl font-black text-slate-900">Fechamento do dia</h2><p className="text-slate-500">Confira o valor previsto antes de fechar.</p></div><button onClick={closeCash} disabled={!isOpen || saving} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 disabled:opacity-50"><Lock size={20}/> Fechar caixa</button></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6"><div className="bg-white rounded-2xl p-5 border"><b>Recebimentos</b><div className="text-2xl font-black text-green-700 mt-2">{money(summary.paid)}</div></div><div className="bg-white rounded-2xl p-5 border"><b>Entrada manual</b><div className="text-2xl font-black text-green-700 mt-2">{money(summary.entries)}</div></div><div className="bg-white rounded-2xl p-5 border"><b>Saída manual</b><div className="text-2xl font-black text-red-700 mt-2">{money(summary.exits)}</div></div><div className="bg-white rounded-2xl p-5 border"><b>Valor previsto</b><div className="text-2xl font-black text-slate-900 mt-2">{money(summary.expected)}</div></div></div>{isClosed && <div className="mt-5 bg-green-50 border border-green-100 text-green-800 rounded-2xl p-4 font-bold flex items-center gap-2"><CheckCircle/> Caixa fechado: contado {money(dayClosing.closing_amount)} • diferença {money(dayClosing.difference_amount)}</div>}</div>

            <div className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl"><h2 className="text-2xl font-black text-slate-900 mb-5">Movimentações do dia</h2><div className="space-y-3">{loading && <div className="text-slate-500">Carregando...</div>}{!loading && dayMovements.length === 0 && dayPayments.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhuma movimentação neste dia.</div>}{dayPayments.map((p)=><div key={`p-${p.id}`} className="bg-white rounded-2xl p-4 border flex justify-between gap-4"><div><b>Recebimento #{p.id}</b><div className="text-slate-500 text-sm">{p.method || "pagamento"} • {p.status || "pendente"}</div></div><div className="font-black text-green-700">{money(p.amount)}</div></div>)}{dayMovements.map((m)=><div key={`m-${m.id}`} className="bg-white rounded-2xl p-4 border flex justify-between gap-4"><div><b>{norm(m.type).includes("saida") ? "Saída" : "Entrada"}</b><div className="text-slate-500 text-sm">{m.description || "Sem descrição"} • {m.method || "-"}</div></div><div className={`font-black ${norm(m.type).includes("saida") ? "text-red-700" : "text-green-700"}`}>{money(m.amount)}</div></div>)}</div></div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
