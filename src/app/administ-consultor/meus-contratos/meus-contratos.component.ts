import { Component, OnInit } from '@angular/core';
import { ServInvestimentosService } from 'src/app/services/serv-contratos.service';
import {get} from 'lodash';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';

@Component({
  selector: 'app-meus-contratos',
  templateUrl: './meus-contratos.component.html',
  styleUrls: ['./meus-contratos.component.scss']
})
export class MeusContratosComponent implements OnInit {

  constructor(private serv:ServInvestimentosService,private serv2:ServUsuariosService) { }

  _ = get;
  cols=[
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' },
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' },
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo' },
    { label: "Aprv. Financ.",  cxlabel:false    , aprov: true, value: 'statusFinanceiro'     },
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria'  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]
  investimentos=[]
  ngOnInit(): void {
    this.serv.getInvestimentosByConsultor(localStorage.getItem('email')).subscribe(
      resp=>{
        this.investimentos=resp
      }
    )
  }

}
