import CrudPage from "../../components/ui/CrudPage";

export default function RegrasPage() {
  return (
    <CrudPage
      title="Regras"
      endpoint="availabilityRules"
      fields={[
        { key: "date", label: "Data" },
        { key: "start_time", label: "Início" },
        { key: "end_time", label: "Fim" }
      ]}
      columns={[
        { key: "date", label: "Data" },
        { key: "start_time", label: "Início" },
        { key: "end_time", label: "Fim" }
      ]}
    />
  );
}
