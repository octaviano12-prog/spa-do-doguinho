import CrudPage from "../../components/ui/CrudPage";

export default function AgendamentosPage() {
  return (
    <CrudPage
      title="Agendamentos"
      endpoint="appointments"
      fields={[
        {
          key: "customer_id",
          label: "Cliente ID"
        },

        {
          key: "pet_id",
          label: "Pet ID"
        },

        {
          key: "service_id",
          label: "Serviço ID"
        },

        {
          key: "scheduled_at",
          label: "Data"
        }
      ]}
      columns={[
        {
          key: "customer_name",
          label: "Cliente"
        },

        {
          key: "pet_name",
          label: "Pet"
        },

        {
          key: "service_name",
          label: "Serviço"
        },

        {
          key: "scheduled_at",
          label: "Data"
        },

        {
          key: "status",
          label: "Status"
        }
      ]}
    />
  );
}
