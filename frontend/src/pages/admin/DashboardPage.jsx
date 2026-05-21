import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminTable from "../../components/ui/AdminTable";

import { apiRequest } from "../../lib/api";

import {
  Plus,
  Trash2,
  Mail,
  Phone
} from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  async function loadClientes() {
    try {
      const data = await apiRequest("/customers");

      setClientes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm({
        name: "",
        email: "",
        phone: ""
      });

      loadClientes();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Excluir cliente?")) return;

    try {
      await apiRequest(`/customers/${id}`, {
        method: "DELETE"
      });

      loadClientes();
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Cliente"
    },

    {
      key: "email",
      label: "E-mail",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Mail size={16} />
          {row.email}
        </div>
      )
    },

    {
      key: "phone",
      label: "Telefone",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Phone size={16} />
          {row.phone}
        </div>
      )
    },

    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
        >
          <Trash2 size={18} />
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black">
            Clientes
          </h1>

          <p className="text-gray-500 mt-2">
            Gerencie todos os clientes do sistema.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-6 border shadow-sm grid md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Nome"
            className="h-12 border rounded-2xl px-4"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <input
            placeholder="E-mail"
            className="h-12 border rounded-2xl px-4"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            placeholder="Telefone"
            className="h-12 border rounded-2xl px-4"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }
          />

          <button className="bg-green-700 hover:bg-green-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            <Plus size={18} />
            Adicionar
          </button>
        </form>

        <AdminTable
          columns={columns}
          data={clientes}
          loading={loading}
          emptyMessage="Nenhum cliente cadastrado"
        />
      </div>
    </AdminLayout>
  );
}
