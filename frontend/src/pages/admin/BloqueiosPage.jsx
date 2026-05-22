import CrudPage from "../../components/ui/CrudPage";

export default function BloqueiosPage() {
  return (
    <CrudPage
      title="Bloqueios"
      endpoint="blockedDates"
      fields={[
        { key: "date", label: "Data" },
        { key: "time", label: "Hora" },
        { key: "reason", label: "Motivo" }
      ]}
      columns={[
        { key: "date", label: "Data" },
        { key: "time", label: "Hora" },
        { key: "reason", label: "Motivo" }
      ]}
    />
  );
}
