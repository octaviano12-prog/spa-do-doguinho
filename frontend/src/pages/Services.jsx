import React from "react";
import CrudPage from "../components/CrudPage";
const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function Services() {
  return <CrudPage title="Serviços" subtitle="Banho, tosa, vacinas e demais serviços" endpoint="services" searchFields={["name","description"]} defaults={{name:"",description:"",price:"",duration_minutes:30,active:1}}
    columns={[{key:"name",label:"Serviço"},{key:"price",label:"Preço",render:r=>money(r.price)},{key:"duration_minutes",label:"Duração"},{key:"active",label:"Ativo",render:r=>r.active ? "Sim" : "Não"}]}
    fields={[{name:"name",label:"Nome"},{name:"price",label:"Preço",type:"number"},{name:"duration_minutes",label:"Duração (min)",type:"number"},{name:"active",label:"Ativo",type:"select",options:[{value:1,label:"Sim"},{value:0,label:"Não"}]},{name:"description",label:"Descrição",type:"textarea",full:true}]} />;
}
