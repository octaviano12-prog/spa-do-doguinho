import React from "react";
import { motion } from "framer-motion";
import { Database, Loader2 } from "lucide-react";

export default function DataTable({
  columns,
  rows,
  loading,
  empty = "Nenhum registro encontrado",
}) {
  if (loading) {
    return (
      <div className="card tableWrap premiumTableWrap">
        <div className="tableLoading">
          <Loader2 size={22} className="spin" />
          <span>Carregando registros...</span>
        </div>

        <table>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td colSpan={columns.length}>
                  <span className="skeletonLine" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <motion.div
      className="card tableWrap premiumTableWrap"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty premiumEmpty">
                <Database size={22} />
                <span>{empty}</span>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.035,
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key] ?? "-"}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Database, Loader2 } from "lucide-react";

export default function DataTable({
  columns,
  rows,
  loading,
  empty = "Nenhum registro encontrado",
}) {
  if (loading) {
    return (
      <div className="card tableWrap premiumTableWrap">
        <div className="tableLoading">
          <Loader2 size={22} className="spin" />
          <span>Carregando registros...</span>
        </div>

        <table>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td colSpan={columns.length}>
                  <span className="skeletonLine" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <motion.div
      className="card tableWrap premiumTableWrap"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty premiumEmpty">
                <Database size={22} />
                <span>{empty}</span>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.035,
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key] || "-"}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
