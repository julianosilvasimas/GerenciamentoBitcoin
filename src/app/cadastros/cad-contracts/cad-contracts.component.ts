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

  tipos=[]

  _ = get;
  cols=[
    { label: "Identificador",  cxlabel:true ,value: 'id' },
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' },
    { label: "Consultor",  cxlabel:true ,value: 'consultor.nome' },
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo' },
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

    this.height=(y-150)+"px"
    if(x<1000){
      this.height=(y-200)+"px"
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
    console.clear
    this.recarregaTamanho()
    this.tipos = this.serv.getTipoDeInvestimentos()
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
        // this.verInvestimento(resp[2])
      }
    )
  }

  editarInvestimento=false
  carregado=false
  investimento
  
  selectedConsultor: string;
  selectedSecretario: string;

  verInvestimento(invest){
    this.activeItem=this.steps[0]
    this.editarInvestimento = true
    this.carregado=false
    this.serv.getInvestimentosId(invest.id).subscribe(
      resp=>{
        this.investimento = resp
        this.events1 = [
          {status: 'Lançamento',            responsavel: invest.consultor.nome    , observacao:null, data: resp['datLancamento'], icon: PrimeIcons.CHECK,       color: 'green'},
          {status: 'Secretaria',            responsavel:''                        , observacao:null, data: ''                   , icon: PrimeIcons.USER,        color: 'grey'},
          {status: 'Geração de Pagamentos', responsavel:''                        , observacao:null, data: ''                   , icon: PrimeIcons.MONEY_BILL,  color: 'grey'},
        ];
        
        
        var i=1 //Secretaria
        if(resp['statusSecretaria'] == 2){
          this.events1[i].icon = PrimeIcons.CLOCK
          this.events1[i].color = "orange"

        }else if(resp['statusSecretaria'] == 1){
          this.events1[i].icon = PrimeIcons.CHECK
          this.events1[i].color = "green"
          this.events1[i].responsavel = resp['aprovadorSecretaria']
          this.events1[i].data        = resp['dataAprovacaoSecretaria']
        }else{
          this.events1[i].icon = PrimeIcons.TIMES
          this.events1[i].color = "red"
          this.events1[i].responsavel = resp['aprovadorSecretaria']
          this.events1[i].data        = resp['dataAprovacaoSecretaria']
          this.events1[i].observacao  = resp['observacaoSecretaria']
        }

        
        var p=2 //AtualizarStatusPagamentos
        if(resp['pagamentos'].length==0){
          this.events1[p].icon = PrimeIcons.CLOCK
          this.events1[p].color = "orange"
        }else{
          this.events1[p].icon = PrimeIcons.CHECK
          this.events1[p].color = "green"
        }

        
        this.carregado=true

      }
    )
  }

  salvar(){
    this.editarInvestimento = false
    this.investimento.contatos =null
    this.investimento.contasBancarias =null
    this.investimento.pagamentos =null
    this.investimento.secretaria = { id: this.investimento.secretaria.id}
    this.investimento.cliente = { cpf: this.investimento.cliente.cpf}
    this.investimento.consultor = { id: this.investimento.consultor.id}
    this.serv.putInvestimentos(this.investimento).subscribe(
      resp=>{
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



  activeItem
  steps = [
    {
      id: 1, label: 'Investimento', icon: "pi pi-money-bill", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 0 , label: 'Aprovação', icon: "pi pi-user", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 3 , label: 'Contato', icon: "pi pi-phone", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 4 , label: 'Contas', icon: "pi pi-wallet", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 5 , label: 'Pag. Cliente', icon: "pi pi-money-bill", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 6 , label: 'Pag. Consultor', icon: "pi pi-money-bill", command: (event) => { 
        this.activeItem= event.item 
      }
    },
  ];
}
