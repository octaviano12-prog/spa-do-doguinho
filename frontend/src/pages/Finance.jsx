import CrudPage from "../components/CrudPage";
const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function Finance() {
  return <CrudPage title="Financeiro" subtitle="Pagamentos e recebimentos" endpoint="payments" searchFields={["method","status","description"]} defaults={{appointment_id:"",amount:"",method:"PIX",type:"entrada",status:"paid",description:"",paid_at:""}}
    columns={[{key:"appointment_id",label:"Agendamento"},{key:"amount",label:"Valor",render:r=>money(r.amount)},{key:"method",label:"Forma"},{key:"type",label:"Tipo"},{key:"status",label:"Status"}]}
    fields={[{name:"appointment_id",label:"ID Agendamento",type:"number"},{name:"amount",label:"Valor",type:"number"},{name:"method",label:"Forma"},{name:"type",label:"Tipo",type:"select",options:[{value:"entrada",label:"Entrada"},{value:"saida",label:"Saída"}]},{name:"status",label:"Status",type:"select",options:[{value:"paid",label:"Pago"},{value:"pending",label:"Pendente"},{value:"refunded",label:"Estornado"},{value:"canceled",label:"Cancelado"}]},{name:"paid_at",label:"Pago em",type:"datetime-local"},{name:"description",label:"Descrição",type:"textarea",full:true}]} />;
}
