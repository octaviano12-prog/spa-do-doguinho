import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function EstoquePage() {
  return (
    <CrudPage
      title="Estoque"
      endpoint="stock"
      fields={[
        {
          key: "name",
          label: "Produto"
        },

        {
          key: "quantity",
          label: "Quantidade"
        },

        {
          key: "sale_price",
          label: "Preço"
        }
      ]}
      columns={[
        {
          key: "name",
          label: "Produto"
        },

        {
          key: "quantity",
          label: "Quantidade"
        },

        {
          key: "sale_price",
          label: "Preço"
        }
      ]}
    />
  );
}
