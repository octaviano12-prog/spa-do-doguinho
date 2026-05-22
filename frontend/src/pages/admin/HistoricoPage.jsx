import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function HistoricoPage() {
  return (
    <CrudPage
      title="Histórico"
      endpoint="serviceHistory"
      fields={[
        { key: "professional", label: "Profissional" },
        { key: "notes", label: "Observações" }
      ]}
      columns={[
        { key: "professional", label: "Profissional" },
        { key: "notes", label: "Observações" }
      ]}
    />
  );
}
