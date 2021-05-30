import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServInvestimentosService } from '../services/serv-contratos.service';
import { ServDashboardsService } from '../services/serv-dashboards.service';
import { ServUsuariosService } from '../services/serv-usuarios.service';

@Component({
  selector: 'app-administ-consultor',
  templateUrl: './administ-consultor.component.html',
  styleUrls: ['./administ-consultor.component.scss']
})
export class AdministConsultorComponent implements OnInit {

  constructor(private serv:ServDashboardsService, private serv2:ServInvestimentosService,private messageService: MessageService) {}

  UsuarioSelect: any;
  nome
  urlimage
  localStorage=localStorage

  contratosAtivos=0
  valorTotalDeContratos=0
  clientes=0

  maioresClientes=[]
  maioresConsultores=[]

  carregado1 = false

  ngOnInit() {
    this.carregado1=false
    console.clear()
    this.recarregarDash()

  }

  recarregarDash(){
    this.serv.getDash(localStorage.getItem("email")).subscribe(
      resp=>{
        this.contratosAtivos=resp[0]==null?0:resp[0]
        this.valorTotalDeContratos=resp[1]==null?0:resp[1]
        this.clientes=resp[2]==null?0:resp[2]
        this.serv.getMaioresClientes(localStorage.getItem("email")).subscribe(
          resp=>{
            this.maioresClientes = resp[0].sort(function(a,b){ return a[1] < b[1] ? 1 : -1 })
            this.maioresConsultores = resp[1].sort(function(a,b){ return a[1] < b[1] ? 1 : -1 })

            this.maioresClientes =     this.maioresClientes.length>0 ?    this.maioresClientes.splice(0,10) :    this.maioresClientes
            this.maioresConsultores =  this.maioresConsultores.length>0 ? this.maioresConsultores.splice(0,10) : this.maioresConsultores
            this.carregarInvestimentos()
          },erro=>{
            this.carregado1=true
          }
        )
      },erro=>{
        this.carregado1=true
      }
    )
    setTimeout(() => {
      this.recarregarDash()
    }, 300000);
  }

  investimentos=[]

  carregarInvestimentos(){
    console.clear()
    
    this.serv2.getInvestimentosByConsultor().subscribe(
      resp=>{
        console.log(resp)
        this.investimentos=resp
        this.calcularPagamentos(resp)
        this.carregado1=true
      },erro=>{
        this.carregado1=true
      }
    )
  }
  pagamConsult=0
  pagamConsultPorcent=0
  pagamConsultMax=0

  pagamClient=0
  pagamClientPorcent=0
  pagamClientMax=0

  pagamentosConsultor=[]
  pagamentosCliente=[]

  calcularPagamentos(arrInvestimentos){
    this.pagamConsult=0
    this.pagamConsultPorcent=0
    this.pagamConsultMax=0

    this.pagamClient=0
    this.pagamClientPorcent=0
    this.pagamClientMax=0

    this.pagamentosConsultor=[]
    this.pagamentosCliente=[]
    
    console.log(arrInvestimentos)
    
    for(let inv of arrInvestimentos){
      for(let pagam of inv.pagamentos){
        // console.log(pagam)
        switch(pagam.recebedor){
          case "Consultor":
            this.pagamConsultMax+= pagam.valor
            if(pagam.status.indexOf("Pendente")>-1){
              this.pagamentosConsultor.push(pagam)

            }else if(pagam.status.indexOf("Erro")>-1){
              this.pagamentosConsultor.push(pagam)

            }else if(pagam.status.indexOf("Pago")>-1){
              this.pagamConsult+= pagam.valor
            }
            break;

          case "Cliente":
            this.pagamClientMax+= pagam.valor
            if(pagam.status.indexOf("Pendente")>-1){
              this.pagamentosCliente.push(pagam)

            }else if(pagam.status.indexOf("Erro")>-1){
              this.pagamentosCliente.push(pagam)

            }else if(pagam.status.indexOf("Pago")>-1){
              this.pagamClient+= pagam.valor
            }
            break;
        }
      }
    }

    this.pagamentosConsultor = this.pagamentosConsultor.sort(function(a,b){  return new Date(a.dataPagamento.substring(6,10),a.dataPagamento.substring(6,5),1)<new Date(b.dataPagamento.substring(6,10),b.dataPagamento.substring(3,5),1) ? -1 : 1 })
    if(this.pagamentosConsultor.length>5){
      this.pagamentosConsultor = this.pagamentosConsultor.splice(0,5)
    }
    console.log(this.pagamentosConsultor)

    this.pagamConsultPorcent = ((this.pagamConsult/ this.pagamConsultMax)*100)
    this.pagamClientPorcent =   ((this.pagamClient/ this.pagamClientMax)*100)
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
