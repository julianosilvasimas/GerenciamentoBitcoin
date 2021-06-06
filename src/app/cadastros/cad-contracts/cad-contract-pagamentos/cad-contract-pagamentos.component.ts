import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cad-contract-pagamentos',
  templateUrl: './cad-contract-pagamentos.component.html',
  styleUrls: ['./cad-contract-pagamentos.component.scss']
})
export class CadContractPagamentosComponent implements OnInit {

  constructor() { }

  @Input() investimento;
  @Input() Recebedor;
  cols=[
    { label: "Data",  cxlabel:true ,value: 'dataPagamento' },
    { label: "valor",  cxlabel:true ,value: 'valor', number: true },
    { label: "Status",  cxlabel:false ,value: 'status', tick:true },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  pagamentos=[]
  ngOnInit(): void {
    console.clear()
    console.log(this.investimento)
    var receb = this.Recebedor
    this.pagamentos=this.investimento.pagamentos.filter(function(e){ return e.recebedor.indexOf(receb)>-1 })
  }

  ver   

  src=""
  observacao=""
  verComprovante(op1,op2, event,unidade){
    this.src=null
    this.observacao=null
    if(unidade['status'].indexOf('pago')>-1){
      this.src=unidade['imagemComprovante']
      console.log(this.src)
      op1.toggle(event)
    }else if(unidade['status'].indexOf('erro')>-1){
      this.observacao=unidade['observacao']
      console.log(this.observacao)
      op2.toggle(event)
    }

  }
}
