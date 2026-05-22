import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function ServicosPage() {
  return (
    <CrudPage
      title="Serviços"
      endpoint="services"
      fields={[
        {
          key: "name",
          label: "Nome"
        },

        {
          key: "price",
          label: "Preço"
        },

        {
          key: "duration_minutes",
          label: "Duração"
        }
      ]}
      columns={[
        {
          key: "name",
          label: "Serviço"
        },

        {
          key: "price",
          label: "Preço"
        },

        {
          key: "duration_minutes",
          label: "Duração"
        }
      ]}
    />
  );
}
