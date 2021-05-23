import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServDashboardsService } from '../services/serv-dashboards.service';
import { ServUsuariosService } from '../services/serv-usuarios.service';

@Component({
  selector: 'app-administ-consultor',
  templateUrl: './administ-consultor.component.html',
  styleUrls: ['./administ-consultor.component.scss']
})
export class AdministConsultorComponent implements OnInit {

  constructor(private serv:ServDashboardsService, private adminserv: ServUsuariosService,private messageService: MessageService) {}

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
    // console.log(localStorage.getItem("email"))

    this.serv.getDash(localStorage.getItem("email")).subscribe(
      resp=>{
        this.contratosAtivos=resp[0]==null?0:resp[0]
        this.valorTotalDeContratos=resp[1]==null?0:resp[1]
        this.clientes=resp[2]==null?0:resp[2]
        this.serv.getMaioresClientes(localStorage.getItem("email")).subscribe(
          resp=>{
            console.log(resp)
            this.maioresClientes = resp[0].sort(function(a,b){ return a[1] < b[1] ? 1 : -1 })
            this.maioresConsultores = resp[1].sort(function(a,b){ return a[1] < b[1] ? 1 : -1 })

            this.maioresClientes =     this.maioresClientes.length>0 ?    this.maioresClientes.splice(0,10) :    this.maioresClientes
            this.maioresConsultores =  this.maioresConsultores.length>0 ? this.maioresConsultores.splice(0,10) : this.maioresConsultores



            this.carregado1=true
          }
        )
      }
    )
  }

}
