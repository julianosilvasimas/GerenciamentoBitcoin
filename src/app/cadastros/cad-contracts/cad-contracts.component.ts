import { Component, OnInit } from '@angular/core';
import { ServInvestimentosService } from 'src/app/services/serv-contratos.service';
import {get} from 'lodash';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';
import { MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-cad-contracts',
  templateUrl: './cad-contracts.component.html',
  styleUrls: ['./cad-contracts.component.scss']
})
export class CadContractsComponent implements OnInit {

  constructor(private serv:ServInvestimentosService,private serv2:ServUsuariosService,
    private messageService: MessageService,) { }

  tipos=[
    { label: "Investimento Inicial",  cxlabel:true ,value: 'inicial' },
    { label: "Carta Fiança",          cxlabel:true ,value: 'fianca' },
    { label: "Reinvestimento",        cxlabel:true ,value: 'reinvestimento' },
  ]

  _ = get;
  cols=[
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' },
    { label: "Consultor",  cxlabel:true ,value: 'consultor.nome' },
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo' },
    { label: "Aprv. Financ.",  cxlabel:false    , aprov: true, value: 'statusFinanceiro'     },
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria'  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]
  investimentos=[]

  
  width="50%"
  height=""

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
  events1 = [];

  events2 = [
      "2020", "2021", "2022", "2023"
  ];
  consultores=[]
  secretarias=[]
  
  ngOnInit(): void {
    this.recarregaTamanho()
    this.serv2.getUsers().subscribe(
      users=>{
        // console.log(users)
        this.consultores=users.filter(function(e) { return e.cargo.indexOf("Consultor")>-1 || e.cargo.indexOf("Gerente")>-1 })
        this.secretarias=users.filter(function(e) { return e.cargo.indexOf("Secretaria")>-1 || e.cargo.indexOf("Gerente")>-1  })
        this.recarregaInvestimentos()
      }
    )
  }
  recarregaInvestimentos(){
    this.serv.getInvestimentos().subscribe(
      resp=>{
        this.investimentos=resp
      }
    )
  }

  editarInvestimento=false
  carregado=false
  investimento
  
  selectedConsultor: string;
  selectedSecretario: string;

  verInvestimento(invest){
    this.editarInvestimento = true
    this.carregado=false
    this.events1 = [
        {status: 'Financeiro',            responsavel:'', observacao:null, data: '', icon: PrimeIcons.DOLLAR,       color: 'grey'},
        {status: 'Geração de Pagamentos', responsavel:'', observacao:null, data: '', icon: PrimeIcons.MONEY_BILL,  color: 'grey'},
        {status: 'Secretaria',            responsavel:'', observacao:null, data: '', icon: PrimeIcons.USER,        color: 'grey'},
    ];
    this.serv.getInvestimentosId(invest.id).subscribe(
      resp=>{
        this.investimento = resp
        if(resp['statusFinanceiro'] == 2){
          this.events1[0].icon = PrimeIcons.CLOCK
          this.events1[0].color = "orange"

        }else if(resp['statusFinanceiro'] == 1){
          this.events1[0].icon = PrimeIcons.CHECK
          this.events1[0].color = "green"
          this.events1[0].responsavel = resp['aprovadorFinanceiro']
          this.events1[0].data        = resp['dataAprovacaoFinanceiro']
        }else{
          this.events1[0].icon = PrimeIcons.TIMES
          this.events1[0].color = "red"
          this.events1[0].responsavel = resp['aprovadorFinanceiro']
          this.events1[0].data        = resp['dataAprovacaoFinanceiro']
          this.events1[0].observacao        = resp['observacaoFinanceiro']
        }

        if(resp['statusSecretaria'] == 2){
          this.events1[2].icon = PrimeIcons.CLOCK
          this.events1[2].color = "orange"

        }else if(resp['statusSecretaria'] == 1){
          this.events1[2].icon = PrimeIcons.CHECK
          this.events1[2].color = "green"
          this.events1[2].responsavel = resp['aprovadorSecretaria']
          this.events1[2].data        = resp['dataAprovacaoSecretaria']
        }else{
          this.events1[2].icon = PrimeIcons.TIMES
          this.events1[2].color = "red"
          this.events1[2].responsavel = resp['aprovadorSecretaria']
          this.events1[2].data        = resp['dataAprovacaoSecretaria']
          this.events1[2].observacao        = resp['observacaoSecretaria']
        }

        //AtualizarStatusPagamentos
        if(resp['pagamentos'].length==0){
          this.events1[1].icon = PrimeIcons.CLOCK
          this.events1[1].color = "orange"
        }else{
          this.events1[1].icon = PrimeIcons.CHECK
          this.events1[1].color = "green"
        }
        this.carregado=true

      }
    )
  }

  salvar(){

    this.investimento.contatos =null
    this.investimento.contasBancarias =null
    this.investimento.pagamentos =null
    this.investimento.secretaria = { id: this.investimento.secretaria.id}
    this.investimento.cliente = { cpf: this.investimento.cliente.cpf}
    this.investimento.consultor = { id: this.investimento.consultor.id}
    this.serv.putInvestimentos(this.investimento).subscribe(
      resp=>{
        this.editarInvestimento = false
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
        setTimeout(() => {
          this.recarregaInvestimentos()
        }, 500);
      },erro=>{
        this.editarInvestimento = false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
      }
    )
  }
  Cancelar(){
    this.editarInvestimento = false
    setTimeout(() => {
      this.recarregaInvestimentos()
    }, 500);
  }
}
