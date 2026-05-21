import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";
import { Plus, Trash2 } from "lucide-react";

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black">
            Clientes
          </h1>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-3xl border shadow-sm grid md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Nome"
            className="border rounded-2xl px-4 h-12"
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
            className="border rounded-2xl px-4 h-12"
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
            className="border rounded-2xl px-4 h-12"
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

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Telefone</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {cliente.name}
                    </td>

                    <td className="p-4">
                      {cliente.email}
                    </td>

                    <td className="p-4">
                      {cliente.phone}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          handleDelete(cliente.id)
                        }
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
