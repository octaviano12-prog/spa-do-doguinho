import { useEffect, useState } from "react";

import AdminLayout from "../admin/AdminLayout";
import AdminTable from "./AdminTable";

import { apiRequest } from "../../lib/api";

export default function CrudPage({
  title,
  endpoint,
  fields,
  columns
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialForm = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.key]: ""
    }),
    {}
  );

  const [form, setForm] = useState(initialForm);

  async function loadData() {
    try {
      const response = await apiRequest(
        `/${endpoint}`
      );

      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await apiRequest(`/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm(initialForm);

      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Excluir registro?")) return;

    try {
      await apiRequest(
        `/${endpoint}/${id}`,
        {
          method: "DELETE"
        }
      );

      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const tableColumns = [
    ...columns,

    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <button
          onClick={() =>
            handleDelete(row.id)
          }
          className="bg-red-100 text-red-600 px-4 py-2 rounded-2xl"
        >
          Excluir
        </button>
      )
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black">
            {title}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`bg-white rounded-3xl p-6 border shadow-sm grid md:grid-cols-${fields.length + 1} gap-4`}
        >
          {fields.map((field) => (
            <input
              key={field.key}
              placeholder={field.label}
              className="h-12 border rounded-2xl px-4"
              value={form[field.key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field.key]:
                    e.target.value
                })
              }
            />
          ))}

          <button className="bg-green-700 text-white rounded-2xl font-bold">
            Adicionar
          </button>
        </form>

        <AdminTable
          columns={tableColumns}
          data={data}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
}
