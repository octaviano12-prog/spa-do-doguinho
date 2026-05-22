import CrudPage from "../../components/ui/CrudPage";

export default function PagamentosPage() {
  return (
    <CrudPage
      title="Pagamentos"
      endpoint="payments"
      fields={[
        { key: "amount", label: "Valor" },
        { key: "method", label: "Método" },
        { key: "status", label: "Status" }
      ]}
      columns={[
        { key: "amount", label: "Valor" },
        { key: "method", label: "Método" },
        { key: "status", label: "Status" }
      ]}
    />
  );
}
