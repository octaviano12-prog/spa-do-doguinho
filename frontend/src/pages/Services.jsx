import React from "react";
import CrudPage from "../components/CrudPage";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Services() {
  return (
    <CrudPage
      title="Serviços"
      subtitle="Banho, tosa, hidratação, vacinas e serviços veterinários"
      endpoint="services"
      searchFields={[
        "name",
        "description",
      ]}
      defaults={{
        name: "",
        description: "",
        price: "",
        duration_minutes: 30,
        active: 1,
      }}
      columns={[
        {
          key: "name",
          label: "Serviço",
        },
        {
          key: "price",
          label: "Preço",
          render: (r) => money(r.price),
        },
        {
          key: "duration_minutes",
          label: "Duração",
          render: (r) =>
            `${r.duration_minutes || 0} min`,
        },
        {
          key: "active",
          label: "Ativo",
          render: (r) =>
            r.active ? "Sim" : "Não",
        },
      ]}
      fields={[
        {
          name: "name",
          label: "Nome do serviço",
          placeholder:
            "Ex: Banho premium",
        },
        {
          name: "price",
          label: "Preço",
          type: "number",
          placeholder: "Ex: 79.90",
        },
        {
          name: "duration_minutes",
          label: "Duração (minutos)",
          type: "number",
          placeholder: "Ex: 60",
        },
        {
          name: "active",
          label: "Serviço ativo",
          type: "select",
          options: [
            {
              value: 1,
              label: "Sim",
            },
            {
              value: 0,
              label: "Não",
            },
          ],
        },
        {
          name: "description",
          label: "Descrição",
          type: "textarea",
          placeholder:
            "Descreva detalhes do serviço...",
          full: true,
        },
      ]}
    />
  );
}
