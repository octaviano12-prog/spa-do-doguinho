import CrudPage from "../components/CrudPage";
export default function Customers() {
  return <CrudPage title="Clientes" subtitle="Cadastro completo de tutores" endpoint="customers" searchFields={["name","phone","email"]} defaults={{name:"",phone:"",email:"",address:"",notes:""}}
    columns={[{key:"name",label:"Nome"},{key:"phone",label:"Telefone"},{key:"email",label:"Email"},{key:"address",label:"Endereço"}]}
    fields={[{name:"name",label:"Nome"},{name:"phone",label:"Telefone"},{name:"email",label:"Email",type:"email"},{name:"address",label:"Endereço",full:true},{name:"notes",label:"Observações",type:"textarea",full:true}]} />;
}
