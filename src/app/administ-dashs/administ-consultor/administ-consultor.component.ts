import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServInvestimentosService } from 'src/app/services/serv-investimentos.service';
import { ServDashboardsService } from '../../services/serv-dashboards.service';
import { ServUsuariosService } from '../../services/serv-usuarios.service';

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

  value1: string;

  recarregarDash(){
    this.serv.getDash().subscribe(
      resp=>{
        this.contratosAtivos=resp[0]==null?0:resp[0]
        this.valorTotalDeContratos=resp[1]==null?0:resp[1]
        this.clientes=resp[2]==null?0:resp[2]
        this.serv.getMaioresClientes().subscribe(
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
        this.investimentos=resp
        console.log(resp)
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
    for(var i=0;i<arrInvestimentos.length;i++){
      this.pagamClient+=arrInvestimentos[i].pagamentosClientExec
      this.pagamClientMax+=arrInvestimentos[i].pagamentosClient
      this.pagamConsult+=arrInvestimentos[i].pagamentosFuncExec
      this.pagamConsultMax+=arrInvestimentos[i].pagamentosFunc
    }
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
