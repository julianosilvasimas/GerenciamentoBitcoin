import { Component, Input, OnInit } from '@angular/core';
import {get} from 'lodash';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';
import { ServInvestimentosService } from 'src/app/services/serv-contratos.service';
import { MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-meus-contratos-view',
  templateUrl: './meus-contratos-view.component.html',
  styleUrls: ['./meus-contratos-view.component.scss']
})
export class MeusContratosViewComponent implements OnInit {
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

  consultores=[]
  secretarias=[]

  @Input() invest
  ngOnInit(): void {
    this.serv2.getUsersDTO().subscribe(
      users=>{
        this.consultores=users.filter(function(e) { return e.cargo.indexOf("Consultor")>-1 || e.cargo.indexOf("Gerente")>-1 })
        this.secretarias=users.filter(function(e) { return e.cargo.indexOf("Secretaria")>-1 || e.cargo.indexOf("Gerente")>-1  })
        console.log(this.invest)
        this.tipos = this.serv.getTipoDeInvestimentos()
        this.verInvestimento(this.invest)
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

      },erro=>{
        this.editarInvestimento = false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
      }
    )
  }
  Cancelar(){
    this.editarInvestimento = false
    setTimeout(() => {
    }, 500);
  }



  novoContratoObj={
    fotoDoc:[],
    fotoDeposito:[],
    imgPerfil:[],
  }

  onUpload(item, evnt){
    var file = evnt.files
    if(file.length>0){
      switch(item){
        case 1:
          this.salvarInvest(file[0],1)
          break;
        case 2:
          this.salvarInvest(file[0],2)
          break;
        case 3:
          this.salvarInvest(file[0],3)
          break;
  
      }
    }
  }
  salvarInvest(file, id){
    this.serv.postInvestimentosAnexos(this.investimento,file, id).subscribe(
      anexos=>{
        this.messageService.add({severity:'success', summary: 'Anexos', detail:'Sua imagem foi Salva com sucesso', life: 5000});           
      },
      erro=>{
        this.messageService.add({severity:'error', summary: 'Anexos', detail:'Houve um erro ao salvar a imagem', life: 5000});
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
      id: 0 , label: 'Aprovação', icon: "pi pi-user", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 2 , label: 'Anexos', icon: "pi pi-paperclip", command: (event) => { 
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