import { Component, Input, OnInit } from '@angular/core';
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
  @Input() investimentos

  
  width="50%"
  height=""
  cols=[
    { label: "Id",  cxlabel:true ,value: 'id' },
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' },
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' },
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo' },
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria'  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  recarregaTamanho(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    this.height=(y-100)+"px"
    if(x<1000){
      this.cols=[
        { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
        { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }

  }
  ngOnInit(): void {
    this.recarregaTamanho()
  }

  novoContrato(){
    
  }
}
