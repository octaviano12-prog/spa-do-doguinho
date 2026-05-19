import React from "react";
import CrudPage from "../components/CrudPage";
export default function Vaccines() {
  return <CrudPage title="Vacinas" subtitle="Controle de vacinas e próximas doses" endpoint="vaccines" searchFields={["name","notes"]} defaults={{pet_id:"",name:"",applied_at:"",next_due:"",notes:""}}
    columns={[{key:"pet_id",label:"Pet ID"},{key:"name",label:"Vacina"},{key:"applied_at",label:"Aplicada"},{key:"next_due",label:"Próxima"}]}
    fields={[{name:"pet_id",label:"ID Pet",type:"number"},{name:"name",label:"Vacina"},{name:"applied_at",label:"Aplicada em",type:"date"},{name:"next_due",label:"Próxima dose",type:"date"},{name:"notes",label:"Observações",type:"textarea",full:true}]} />;
}
