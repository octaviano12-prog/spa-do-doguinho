import React from "react";
import CrudPage from "../components/CrudPage";

export default function Customers() {
  return (
    <CrudPage
      title="Clientes"
      subtitle="Cadastro completo de tutores do SPA do Doguinho"
      endpoint="customers"
      searchFields={["name", "phone", "email", "address"]}
      defaults={{
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      }}
      columns={[
        { key: "name", label: "Nome" },
        { key: "phone", label: "Telefone" },
        { key: "email", label: "E-mail" },
        { key: "address", label: "Endereço" },
      ]}
      fields={[
        {
          name: "name",
          label: "Nome do tutor",
          placeholder: "Ex: Maria Silva",
        },
        {
          name: "phone",
          label: "Telefone / WhatsApp",
          placeholder: "Ex: (18) 99999-9999",
        },
        {
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "Ex: cliente@email.com",
        },
        {
          name: "address",
          label: "Endereço",
          placeholder: "Rua, número, bairro, cidade",
          full: true,
        },
        {
          name: "notes",
          label: "Observações",
          type: "textarea",
          placeholder: "Informações importantes sobre o cliente...",
          full: true,
        },
      ]}
    />
  );
}
