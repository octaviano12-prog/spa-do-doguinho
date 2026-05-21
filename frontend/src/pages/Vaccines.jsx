import React from "react";
import CrudPage from "../components/CrudPage";

export default function Vaccines() {
  return (
    <CrudPage
      title="Vacinas"
      subtitle="Controle premium de vacinas e próximas doses"
      endpoint="vaccines"
      searchFields={[
        "name",
        "notes",
      ]}
      defaults={{
        pet_id: "",
        name: "",
        applied_at: "",
        next_due: "",
        notes: "",
      }}
      columns={[
        {
          key: "pet_id",
          label: "Pet",
        },
        {
          key: "name",
          label: "Vacina",
        },
        {
          key: "applied_at",
          label: "Aplicada em",
        },
        {
          key: "next_due",
          label: "Próxima dose",
        },
      ]}
      fields={[
        {
          name: "pet_id",
          label: "ID do Pet",
          type: "number",
          placeholder: "Ex: 1",
        },
        {
          name: "name",
          label: "Nome da vacina",
          placeholder:
            "Ex: V10, Antirrábica...",
        },
        {
          name: "applied_at",
          label: "Aplicada em",
          type: "date",
        },
        {
          name: "next_due",
          label: "Próxima dose",
          type: "date",
        },
        {
          name: "notes",
          label: "Observações",
          type: "textarea",
          placeholder:
            "Informações importantes sobre a vacinação...",
          full: true,
        },
      ]}
    />
  );
}
