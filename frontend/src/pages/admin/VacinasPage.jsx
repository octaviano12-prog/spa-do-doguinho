import CrudPage from "../../components/ui/CrudPage";

export default function VacinasPage() {
  return (
    <CrudPage
      title="Vacinas"
      endpoint="vaccinations"
      fields={[
        {
          key: "vaccine_name",
          label: "Vacina"
        },

        {
          key: "date",
          label: "Aplicação"
        },

        {
          key: "next_dose_date",
          label: "Próxima Dose"
        }
      ]}
      columns={[
        {
          key: "vaccine_name",
          label: "Vacina"
        },

        {
          key: "date",
          label: "Aplicação"
        },

        {
          key: "next_dose_date",
          label: "Próxima Dose"
        }
      ]}
    />
  );
}
