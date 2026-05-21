import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import CrudPage from "../components/CrudPage";

export default function Vaccines() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function loadPets() {
      try {
        const { data } = await client.get("/pets");
        setPets(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Erro ao carregar pets");
      }
    }

    loadPets();
  }, []);

  const petOptions = useMemo(
    () => pets.map((item) => ({
      value: item.id,
      label: `${item.name}${item.customer_name ? ` - ${item.customer_name}` : ""}`,
    })),
    [pets]
  );

  return (
    <CrudPage
      title="Vacinas"
      subtitle="Controle premium de vacinas e próximas doses"
      endpoint="vaccines"
      searchFields={[
        "name",
        "notes",
        "pet_name",
        "customer_name",
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
          key: "pet_name",
          label: "Pet",
        },
        {
          key: "customer_name",
          label: "Tutor",
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
          label: "Pet",
          type: "select",
          options: petOptions,
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
