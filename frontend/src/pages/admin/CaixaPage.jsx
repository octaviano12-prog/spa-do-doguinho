import CrudPage from "../../components/ui/CrudPage";

export default function CaixaPage() {
  return (
    <CrudPage
      title="Caixa"
      endpoint="cash"
      fields={[
        { key: "type", label: "Tipo" },
        { key: "amount", label: "Valor" },
        { key: "description", label: "Descrição" }
      ]}
      columns={[
        { key: "type", label: "Tipo" },
        { key: "amount", label: "Valor" },
        { key: "description", label: "Descrição" }
      ]}
    />
  );
}
