import React from "react";

import CrudPage from "../../components/ui/CrudPage";

export default function UsuariosPage() {
  return (
    <CrudPage
      title="Usuários"
      endpoint="users"
      fields={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "role", label: "Perfil" }
      ]}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "role", label: "Perfil" }
      ]}
    />
  );
}
