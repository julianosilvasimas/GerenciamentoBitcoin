import { Component, OnInit } from '@angular/core';
import { ServDashboardsService } from 'src/app/services/serv-dashboards.service';

@Component({
  selector: 'app-administ-financeiro',
  templateUrl: './administ-financeiro.component.html',
  styleUrls: ['./administ-financeiro.component.scss']
})
export class AdministFinanceiroComponent implements OnInit {

  constructor(private serv:ServDashboardsService) { }

  listaPagamentosPendentes=[]
  carregado=false

  ngOnInit(): void {
    console.clear()
    this.serv.getDashFinanceiro().subscribe(
      resp=>{
        this.listaPagamentosPendentes=resp
        this.calcularPagamentos(resp)
      }
    )
  }

  valorPagamentosMes=0
  pagamentosMes=[]
  valorPagamentosHoje=0
  pagamentosHoje=[]
  valorPagamentosAtrasados=0
  pagamentosAtrasados=[]
  calcularPagamentos(resp){
    this.carregado=false
    this.valorPagamentosMes=0
    this.pagamentosMes=[]
    this.valorPagamentosHoje=0
    this.pagamentosHoje=[]
    this.valorPagamentosAtrasados=0
    this.pagamentosAtrasados=[]


    var mes = this.format(new Date()).substring(3,10)
    var hoje = this.format(new Date())
    
    for(let pagamentos of resp){
      if(pagamentos.dataPagamento.indexOf(mes)>-1){
        this.valorPagamentosMes+=pagamentos.valor
        this.pagamentosMes.push(pagamentos)
      }
      if(pagamentos.dataPagamento.indexOf(hoje)>-1){
        this.valorPagamentosHoje+=pagamentos.valor
        this.pagamentosHoje.push(pagamentos)
      }
      if(this.formatContrario(pagamentos.dataPagamento)<new Date()){
        this.valorPagamentosAtrasados+=pagamentos.valor
        this.pagamentosAtrasados.push(pagamentos)
      }
    }
    this.carregado=true
  }
  format(data:Date){
    var  dia  = (data.getDate()).toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  formatContrario(data){
    var diaF = data.substring(0,2)
    var mesF = data.substring(3,5)
    var anoF = data.substring(6,10)
    return new Date(anoF,mesF,diaF);
  }

  converter(e){
    var value = 0
    var decimals = 0
    var sufix = ' '
    if(e<1000){
      value = e
    }else if(e<1000000){
      value = e/1000
      decimals = 2
      sufix+="k"
    }else if(e<1000000000){
      value = e/1000000
      decimals = 2
      sufix+="M"
    }else{
      value = e/1000000000
      decimals = 2
      sufix+="G"
    }
    return ' R$ '+value.toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals})+sufix
  }
}
