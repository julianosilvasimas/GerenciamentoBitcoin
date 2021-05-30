import { Component, Input, OnInit } from '@angular/core';
import {get} from 'lodash';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ServInvestimentosService } from 'src/app/services/serv-contratos.service';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';
import { AdministSecretariaComponent } from '../administ-secretaria.component';

@Component({
  selector: 'app-secret-aprovacoes-contratos',
  templateUrl: './secret-aprovacoes-contratos.component.html',
  styleUrls: ['./secret-aprovacoes-contratos.component.scss']
})
export class SecretAprovacoesContratosComponent implements OnInit {

  _ = get;
  cols=[
    { label: "Id",  cxlabel:true ,value: 'id', width: "90px" },
    { label: "Consultor",  cxlabel:true ,value: 'consultor.nome' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' , width: "90px"},
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' , width: "110px"},
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo' , width: "90px"},
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria' , width: "120px" },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  @Input() contratos
  carregado=false

  constructor(
    private serv:ServInvestimentosService,
    private serv2:AdministSecretariaComponent,
    private messageService: MessageService,
  ) { }


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
      this.height=(y-250)+"px"
      this.cols=[
        { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
        { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }
  }
  tipos=[]

  ngOnInit(): void {
    this.tipos = this.serv.getTipoDeInvestimentos()
    this.recarregaTamanho()
    // console.clear()

  }
  events1 = [];

  editarInvestimento=false
  investimento

  consultores
  secretarias
  
  selectedConsultor: string;
  selectedSecretario: string;
  verInvestimento(invest){
    this.consultores=[invest['consultor']]
    this.secretarias=[invest['secretaria']]

    this.activeItem=this.steps[0]
    this.editarInvestimento = true
    this.carregado=false
    this.serv.getInvestimentosId(invest.id).subscribe(
      resp=>{
        this.investimento = resp
        this.investimento.rendimento = this.investimento.rendimento!=null ? this.investimento.rendimento*100 : 0
        console.log(resp)
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
          this.events1[i].responsavel = resp['aprovadorSecretaria'].nome 
          this.events1[i].data        = resp['dataAprovacaoSecretaria']
        }else{
          this.events1[i].icon = PrimeIcons.TIMES
          this.events1[i].color = "red"
          this.events1[i].responsavel = resp['aprovadorSecretaria'].nome 
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

  activeItem
  steps = [
    {
      id: 1, label: 'Investimento', icon: "pi pi-money-bill", command: (event) => { 
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



  // FERRAMENTAS PARA APROVAR OU REPROVAR OS PEDIDOS DE INVESTIMENTO
  
  aprovar(){
    var obj = this.convertObj(this.investimento)
    obj.statusSecretaria=1
    this.serv.postInvestimentosAprovacao(obj).subscribe(
      resp=>{
        this.return(1)
      },erro=>{
        this.return(2)
      }
    )
  }
  reprovar(){
    var obj = this.convertObj(this.investimento)
    obj.statusSecretaria=3
    this.serv.postInvestimentosAprovacao(obj).subscribe(
      resp=>{
        this.return(1)
      },erro=>{
        this.return(2)
      }
    )
  }
  return(stat){
    if(stat==1){
      this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
    }else{
      this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
    }
    this.carregado=false
    this.editarInvestimento = false
    this.serv2.carregado=false
    this.serv2.getDashSecretaria()
  }
  convertObj(obj){
    return {
	    id: obj.id,
	    datInvestimento: obj.datInvestimento,
	    vlrInvestimento: obj.vlrInvestimento,
	    prazo: obj.prazo,
	    statusSecretaria: obj.statusSecretaria, // 1 = pago, 2 = pendente, 3 = erro
	    observacaoSecretaria: obj.observacaoSecretaria,
	    tpoContrato: obj.tpoContrato,
	    rendimento: obj.rendimento/100,
    }
  }
}
