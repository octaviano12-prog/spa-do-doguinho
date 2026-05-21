import CrudPage from "../../components/ui/CrudPage";

export default function ConfiguracoesPage() {
  return (
    <CrudPage
      title="Configurações"
      endpoint="siteProfile"
      fields={[
        { key: "site_name", label: "Nome do site" },
        { key: "contact_phone", label: "Telefone" },
        { key: "contact_whatsapp", label: "WhatsApp" },
        { key: "contact_address", label: "Endereço" }
      ]}
      columns={[
        { key: "site_name", label: "Site" },
        { key: "contact_phone", label: "Telefone" },
        { key: "contact_whatsapp", label: "WhatsApp" },
        { key: "contact_address", label: "Endereço" }
      ]}
    />
  );
}
