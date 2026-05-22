import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function DisponibilidadePage() {
  return (
    <CrudPage
      title="Disponibilidade"
      endpoint="availability"
      fields={[
        { key: "day_of_week", label: "Dia da semana" },
        { key: "start_time", label: "Início" },
        { key: "end_time", label: "Fim" },
        { key: "interval_minutes", label: "Intervalo" }
      ]}
      columns={[
        { key: "day_of_week", label: "Dia" },
        { key: "start_time", label: "Início" },
        { key: "end_time", label: "Fim" },
        { key: "interval_minutes", label: "Intervalo" }
      ]}
    />
  );
}
