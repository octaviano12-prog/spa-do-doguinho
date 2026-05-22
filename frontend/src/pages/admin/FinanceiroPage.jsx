import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function FinanceiroPage() {
  return (
    <CrudPage
      title="Financeiro"
      endpoint="payments"
      fields={[
        {
          key: "amount",
          label: "Valor"
        },

        {
          key: "method",
          label: "Método"
        },

        {
          key: "status",
          label: "Status"
        }
      ]}
      columns={[
        {
          key: "amount",
          label: "Valor"
        },

        {
          key: "method",
          label: "Método"
        },

        {
          key: "status",
          label: "Status"
        }
      ]}
    />
  );
}
