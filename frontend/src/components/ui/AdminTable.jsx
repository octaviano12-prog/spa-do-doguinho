import React from "react";

export default function AdminTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "Nenhum registro encontrado"
}) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left p-4 font-black">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-green-50/40 transition">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
