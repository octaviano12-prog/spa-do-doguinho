import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import DataTable from "./DataTable";
import Modal from "./Modal";
import PageHeader from "./PageHeader";

export default function CrudPage({ title, subtitle, endpoint, columns, fields, defaults, searchFields = [] }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get(`/${endpoint}`);
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error(`Erro ao carregar ${title}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => searchFields.some((field) => String(row[field] || "").toLowerCase().includes(term)));
  }, [rows, q, searchFields]);

  const perPage = 8;
  const total = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  function create() {
    setEditing(null);
    setForm(defaults);
    setOpen(true);
  }

  function edit(row) {
    setEditing(row);
    setForm({ ...defaults, ...row });
    setOpen(true);
  }

  async function remove(id) {
    if (!confirm("Deseja excluir este registro?")) return;
    try {
      await client.delete(`/${endpoint}/${id}`);
      toast.success("Removido com sucesso");
      load();
    } catch {
      toast.error("Erro ao remover");
    }
  }

  async function save(e) {
    e.preventDefault();
    try {
      if (editing?.id) await client.put(`/${endpoint}/${editing.id}`, form);
      else await client.post(`/${endpoint}`, form);
      toast.success("Salvo com sucesso");
      setOpen(false);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erro ao salvar");
    }
  }

  const actionColumn = {
    key: "_actions",
    label: "Ações",
    render: (row) => (
      <div className="actions">
        <button className="btn ghost" onClick={() => edit(row)}>Editar</button>
        <button className="btn danger" onClick={() => remove(row.id)}>Excluir</button>
      </div>
    )
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="headActions">
            <input className="input" placeholder="Pesquisar..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            <button className="btn gold" onClick={create}>Novo</button>
          </div>
        }
      />

      <DataTable loading={loading} columns={[...columns, actionColumn]} rows={pageRows} />

      <div className="card pager">
        <span>Página {page} de {total} • {filtered.length} registros</span>
        <div className="actions">
          <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <button className="btn ghost" disabled={page >= total} onClick={() => setPage(page + 1)}>Próxima</button>
        </div>
      </div>

      <Modal open={open} title={editing ? `Editar ${title}` : `Novo ${title}`} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={save}>
          {fields.map((field) => (
            <label key={field.name} className={field.full ? "full" : ""}>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea className="input" value={form[field.name] || ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              ) : field.type === "select" ? (
                <select className="input" value={form[field.name] ?? ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                  <option value="">Selecione</option>
                  {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input className="input" type={field.type || "text"} value={form[field.name] ?? ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              )}
            </label>
          ))}
          <div className="formFooter">
            <button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancelar</button>
            <button className="btn gold">Salvar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
