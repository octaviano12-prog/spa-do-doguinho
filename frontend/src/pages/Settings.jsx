import CrudPage from "../components/CrudPage";
export default function Settings() {
  return <CrudPage title="Configurações" subtitle="Configurações visuais e textos do site" endpoint="settings" searchFields={["setting_key","setting_value"]} defaults={{setting_key:"",setting_value:""}}
    columns={[{key:"setting_key",label:"Chave"},{key:"setting_value",label:"Valor"}]}
    fields={[{name:"setting_key",label:"Chave"},{name:"setting_value",label:"Valor",type:"textarea",full:true}]} />;
}
