import React from "react";
import CrudPage from "../components/CrudPage";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Finance() {
  return (
    <CrudPage
      title="Financeiro"
      subtitle="Controle premium de pagamentos, entradas e saídas"
      endpoint="payments"
      searchFields={[
        "method",
        "status",
        "description",
        "type",
      ]}
      defaults={{
        appointment_id: "",
        amount: "",
        method: "PIX",
        type: "entrada",
        status: "paid",
        description: "",
        paid_at: "",
      }}
      columns={[
        { key: "appointment_id", label: "Agendamento" },
        {
          key: "amount",
          label: "Valor",
          render: (r) => money(r.amount),
        },
        { key: "method", label: "Forma" },
        { key: "type", label: "Tipo" },
        { key: "status", label: "Status" },
        { key: "paid_at", label: "Pago em" },
      ]}
      fields={[
        {
          name: "appointment_id",
          label: "ID do Agendamento",
          type: "number",
          placeholder: "Ex: 1",
        },
        {
          name: "amount",
          label: "Valor",
          type: "number",
          placeholder: "Ex: 80.00",
        },
        {
          name: "method",
          label: "Forma de pagamento",
          type: "select",
          options: [
            { value: "PIX", label: "PIX" },
            { value: "Dinheiro", label: "Dinheiro" },
            { value: "Cartão Débito", label: "Cartão Débito" },
            { value: "Cartão Crédito", label: "Cartão Crédito" },
            { value: "Mercado Pago", label: "Mercado Pago" },
            { value: "Outro", label: "Outro" },
          ],
        },
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
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "paid", label: "Pago" },
            { value: "pending", label: "Pendente" },
            { value: "refunded", label: "Estornado" },
            { value: "canceled", label: "Cancelado" },
          ],
        },
        {
          name: "paid_at",
          label: "Pago em",
          type: "datetime-local",
        },
        {
          name: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Ex: Banho e tosa, compra de produto, despesa etc.",
          full: true,
        },
      ]}
    />
  );
}
