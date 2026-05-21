import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import CrudPage from "../components/CrudPage";

export default function Pets() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const { data } = await client.get("/customers");
        setCustomers(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Erro ao carregar clientes");
      }
    }

    loadCustomers();
  }, []);

  const customerOptions = useMemo(
    () => customers.map((item) => ({ value: item.id, label: item.name })),
    [customers]
  );

  return (
    <CrudPage
      title="Pets"
      subtitle="Pets cadastrados no SPA do Doguinho"
      endpoint="pets"
      searchFields={[
        "name",
        "species",
        "breed",
        "customer_name",
      ]}
      defaults={{
        customer_id: "",
        name: "",
        species: "Cachorro",
        breed: "",
        birth_date: "",
        notes: "",
      }}
      columns={[
        {
          key: "customer_name",
          label: "Tutor",
        },
        {
          key: "name",
          label: "Pet",
        },
        {
          key: "species",
          label: "Espécie",
        },
        {
          key: "breed",
          label: "Raça",
        },
        {
          key: "birth_date",
          label: "Nascimento",
        },
      ]}
      fields={[
        {
          name: "customer_id",
          label: "Tutor",
          type: "select",
          options: customerOptions,
        },
        {
          name: "name",
          label: "Nome do pet",
          placeholder: "Ex: Thor",
        },
        {
          name: "species",
          label: "Espécie",
          type: "select",
          options: [
            {
              value: "Cachorro",
              label: "Cachorro",
            },
            {
              value: "Gato",
              label: "Gato",
            },
            {
              value: "Ave",
              label: "Ave",
            },
            {
              value: "Outro",
              label: "Outro",
            },
          ],
        },
        {
          name: "breed",
          label: "Raça",
          placeholder: "Ex: Shih-tzu",
        },
        {
          name: "birth_date",
          label: "Nascimento",
          type: "date",
        },
        {
          name: "notes",
          label: "Observações",
          type: "textarea",
          placeholder:
            "Informações importantes sobre o pet...",
          full: true,
        },
      ]}
    />
  );
}
import React from "react";
import CrudPage from "../components/CrudPage";

export default function Pets() {
  return (
    <CrudPage
      title="Pets"
      subtitle="Pets cadastrados no SPA do Doguinho"
      endpoint="pets"
      searchFields={[
        "name",
        "species",
        "breed",
      ]}
      defaults={{
        customer_id: "",
        name: "",
        species: "Cachorro",
        breed: "",
        birth_date: "",
        notes: "",
      }}
      columns={[
        {
          key: "customer_id",
          label: "Cliente",
        },
        {
          key: "name",
          label: "Pet",
        },
        {
          key: "species",
          label: "Espécie",
        },
        {
          key: "breed",
          label: "Raça",
        },
        {
          key: "birth_date",
          label: "Nascimento",
        },
      ]}
      fields={[
        {
          name: "customer_id",
          label: "ID do Cliente",
          type: "number",
          placeholder: "Ex: 1",
        },
        {
          name: "name",
          label: "Nome do pet",
          placeholder: "Ex: Thor",
        },
        {
          name: "species",
          label: "Espécie",
          type: "select",
          options: [
            {
              value: "Cachorro",
              label: "Cachorro",
            },
            {
              value: "Gato",
              label: "Gato",
            },
            {
              value: "Ave",
              label: "Ave",
            },
            {
              value: "Outro",
              label: "Outro",
            },
          ],
        },
        {
          name: "breed",
          label: "Raça",
          placeholder: "Ex: Shih-tzu",
        },
        {
          name: "birth_date",
          label: "Nascimento",
          type: "date",
        },
        {
          name: "notes",
          label: "Observações",
          type: "textarea",
          placeholder:
            "Informações importantes sobre o pet...",
          full: true,
        },
      ]}
    />
  );
}
