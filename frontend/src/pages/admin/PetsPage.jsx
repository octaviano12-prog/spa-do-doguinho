import CrudPage from "../../components/ui/CrudPage";

export default function PetsPage() {
  return (
    <CrudPage
      title="Pets"
      endpoint="pets"
      fields={[
        {
          key: "name",
          label: "Nome"
        },

        {
          key: "species",
          label: "Espécie"
        },

        {
          key: "breed",
          label: "Raça"
        }
      ]}
      columns={[
        {
          key: "name",
          label: "Nome"
        },

        {
          key: "species",
          label: "Espécie"
        },

        {
          key: "breed",
          label: "Raça"
        }
      ]}
    />
  );
}
