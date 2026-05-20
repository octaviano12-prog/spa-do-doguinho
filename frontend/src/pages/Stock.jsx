import React from "react";
import CrudPage from "../components/CrudPage";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Stock() {
  return (
    <CrudPage
      title="Estoque"
      subtitle="Controle premium de produtos e materiais"
      endpoint="stock"
      searchFields={[
        "name",
        "notes",
        "unit",
      ]}
      defaults={{
        name: "",
        quantity: 0,
        min_quantity: 0,
        cost_price: 0,
        sale_price: 0,
        unit: "un",
        notes: "",
      }}
      columns={[
        {
          key: "name",
          label: "Produto",
        },
        {
          key: "quantity",
          label: "Qtd",
        },
        {
          key: "min_quantity",
          label: "Mínimo",
        },
        {
          key: "cost_price",
          label: "Custo",
          render: (r) => money(r.cost_price),
        },
        {
          key: "sale_price",
          label: "Venda",
          render: (r) => money(r.sale_price),
        },
        {
          key: "unit",
          label: "Unidade",
        },
      ]}
      fields={[
        {
          name: "name",
          label: "Nome do produto",
          placeholder: "Ex: Shampoo Premium",
        },
        {
          name: "quantity",
          label: "Quantidade",
          type: "number",
          placeholder: "Ex: 10",
        },
        {
          name: "min_quantity",
          label: "Quantidade mínima",
          type: "number",
          placeholder: "Ex: 3",
        },
        {
          name: "cost_price",
          label: "Preço de custo",
          type: "number",
          placeholder: "Ex: 25.90",
        },
        {
          name: "sale_price",
          label: "Preço de venda",
          type: "number",
          placeholder: "Ex: 49.90",
        },
        {
          name: "unit",
          label: "Unidade",
          type: "select",
          options: [
            { value: "un", label: "Unidade" },
            { value: "kg", label: "Kg" },
            { value: "g", label: "Grama" },
            { value: "L", label: "Litro" },
            { value: "ml", label: "ML" },
            { value: "pct", label: "Pacote" },
          ],
        },
        {
          name: "notes",
          label: "Observações",
          type: "textarea",
          placeholder:
            "Informações adicionais sobre o item...",
          full: true,
        },
      ]}
    />
  );
}
