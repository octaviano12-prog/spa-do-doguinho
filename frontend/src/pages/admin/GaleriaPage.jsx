import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function GaleriaPage() {
  return (
    <CrudPage
      title="Galeria"
      endpoint="gallery"
      fields={[
        {
          key: "title",
          label: "Título"
        },

        {
          key: "image_url",
          label: "Imagem URL"
        },

        {
          key: "category",
          label: "Categoria"
        }
      ]}
      columns={[
        {
          key: "title",
          label: "Título"
        },

        {
          key: "category",
          label: "Categoria"
        },

        {
          key: "image_url",
          label: "Imagem"
        }
      ]}
    />
  );
}
