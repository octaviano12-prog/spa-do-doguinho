import React from "react";
import CrudPage from "../components/CrudPage";
export default function Pets() {
  return <CrudPage title="Pets" subtitle="Pets vinculados aos clientes" endpoint="pets" searchFields={["name","species","breed"]} defaults={{customer_id:"",name:"",species:"Cachorro",breed:"",birth_date:"",notes:""}}
    columns={[{key:"customer_id",label:"Cliente ID"},{key:"name",label:"Nome"},{key:"species",label:"Espécie"},{key:"breed",label:"Raça"},{key:"birth_date",label:"Nascimento"}]}
    fields={[{name:"customer_id",label:"ID Cliente",type:"number"},{name:"name",label:"Nome"},{name:"species",label:"Espécie"},{name:"breed",label:"Raça"},{name:"birth_date",label:"Nascimento",type:"date"},{name:"notes",label:"Observações",type:"textarea",full:true}]} />;
}
