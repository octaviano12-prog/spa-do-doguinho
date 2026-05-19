import CrudPage from "../components/CrudPage";
const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function Cash() {
  return <CrudPage title="Caixa" subtitle="Entradas, saídas e fechamento de caixa" endpoint="cash" searchFields={["description","method","type"]} defaults={{type:"entrada",amount:"",method:"Dinheiro",description:""}}
    columns={[{key:"type",label:"Tipo"},{key:"amount",label:"Valor",render:r=>money(r.amount)},{key:"method",label:"Forma"},{key:"description",label:"Descrição"},{key:"created_at",label:"Data"}]}
    fields={[{name:"type",label:"Tipo",type:"select",options:[{value:"entrada",label:"Entrada"},{value:"saida",label:"Saída"}]},{name:"amount",label:"Valor",type:"number"},{name:"method",label:"Forma"},{name:"description",label:"Descrição",type:"textarea",full:true}]} />;
}
