import CrudPage from "../components/CrudPage";
export default function Stock() {
  return <CrudPage title="Estoque" subtitle="Produtos, quantidade mínima e preços" endpoint="stock" searchFields={["name","notes"]} defaults={{name:"",quantity:0,min_quantity:0,cost_price:0,sale_price:0,unit:"un",notes:""}}
    columns={[{key:"name",label:"Item"},{key:"quantity",label:"Qtd"},{key:"min_quantity",label:"Mínima"},{key:"cost_price",label:"Custo"},{key:"sale_price",label:"Venda"}]}
    fields={[{name:"name",label:"Nome"},{name:"quantity",label:"Quantidade",type:"number"},{name:"min_quantity",label:"Qtd mínima",type:"number"},{name:"cost_price",label:"Preço custo",type:"number"},{name:"sale_price",label:"Preço venda",type:"number"},{name:"unit",label:"Unidade"},{name:"notes",label:"Observações",type:"textarea",full:true}]} />;
}
