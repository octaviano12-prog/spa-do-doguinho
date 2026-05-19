import React from "react";
import CrudPage from "../components/CrudPage";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Cash() {
  return (
    <CrudPage
      title="Caixa"
      subtitle="Controle de entradas, saídas e fechamento diário"
      endpoint="cash"
      searchFields={["description", "method", "type"]}
      defaults={{
        type: "entrada",
        amount: "",
        method: "Dinheiro",
        description: "",
      }}
      columns={[
        { key: "type", label: "Tipo" },
        { key: "amount", label: "Valor", render: (r) => money(r.amount) },
        { key: "method", label: "Forma" },
        { key: "description", label: "Descrição" },
        { key: "created_at", label: "Data" },
      ]}
      fields={[
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { value: "entrada", label: "Entrada" },
            { value: "saida", label: "Saída" },
          ],
        },
        {
          name: "amount",
          label: "Valor",
          type: "number",
          placeholder: "Ex: 150.00",
        },
        {
          name: "method",
          label: "Forma de pagamento",
          type: "select",
          options: [
            { value: "Dinheiro", label: "Dinheiro" },
            { value: "PIX", label: "PIX" },
            { value: "Cartão Débito", label: "Cartão Débito" },
            { value: "Cartão Crédito", label: "Cartão Crédito" },
            { value: "Mercado Pago", label: "Mercado Pago" },
            { value: "Outro", label: "Outro" },
          ],
        },
        {
          name: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Ex: Entrada de banho, compra de produto, sangria do caixa...",
          full: true,
        },
      ]}
    />
  );
}
