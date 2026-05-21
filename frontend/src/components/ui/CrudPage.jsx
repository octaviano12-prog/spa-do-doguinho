import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import AdminLayout from "../admin/AdminLayout";
import AdminTable from "./AdminTable";

import { apiRequest } from "../../lib/api";

import {
  Plus
} from "lucide-react";

export default function CrudPage({
  title,
  endpoint,
  fields,
  columns
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const initialForm =
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.key]: ""
      }),
      {}
    );

  const [form, setForm] =
    useState(initialForm);

  async function loadData() {
    try {
      const response =
        await apiRequest(
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
      await apiRequest(
        `/${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify(form)
        }
      );

      setForm(initialForm);

      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (
      !confirm(
        "Excluir registro?"
      )
    )
      return;

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
          className="bg-red-100 hover:bg-red-200 transition text-red-600 px-4 py-2 rounded-2xl font-bold"
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
          <h1 className="text-5xl font-black text-white">
            {title}
          </h1>

          <p className="text-green-100 mt-2">
            Gerencie os registros do sistema.
          </p>
        </div>

        <motion.form
          initial={{
            opacity: 0,
            y: 15
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          onSubmit={handleSubmit}
          className="glass rounded-[32px] border border-white/30 shadow-2xl p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4"
        >

          {fields.map((field) => (
            <div
              key={field.key}
            >
              <label className="text-sm font-bold text-gray-700">
                {field.label}
              </label>

              <input
                placeholder={
                  field.label
                }
                className="mt-2 h-14 w-full bg-white rounded-2xl border border-gray-200 px-4 outline-none focus:ring-4 focus:ring-green-200 transition"
                value={
                  form[field.key]
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    [field.key]:
                      e.target.value
                  })
                }
              />
            </div>
          ))}

          <button className="h-14 mt-auto bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-[1.02] transition-all rounded-2xl text-white font-black flex items-center justify-center gap-2 shadow-xl">
            <Plus size={18} />

            Adicionar
          </button>
        </motion.form>

        <div className="glass rounded-[32px] border border-white/30 shadow-2xl overflow-hidden">
          <AdminTable
            columns={tableColumns}
            data={data}
            loading={loading}
          />
        </div>

      </div>
    </AdminLayout>
  );
}
