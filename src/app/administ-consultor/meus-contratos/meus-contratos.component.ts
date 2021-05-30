import { Component, Input, OnInit } from '@angular/core';
import { ServInvestimentosService } from 'src/app/services/serv-contratos.service';
import {get} from 'lodash';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';
import { MessageService } from 'primeng/api';
import { ServCepService } from 'src/app/utils/ceps/serv-cep.service';
import { ServClientesService } from 'src/app/services/serv-clientes.service';
import { ServContasService } from 'src/app/services/serv-contas.service';
import { ServBancosService } from 'src/app/services/serv-bancos.service';
import { ServContatosService } from 'src/app/services/serv-contatos.service';
import { AdministConsultorComponent } from '../administ-consultor.component';

@Component({
  selector: 'app-meus-contratos',
  templateUrl: './meus-contratos.component.html',
  styleUrls: ['./meus-contratos.component.scss']
})
export class MeusContratosComponent implements OnInit {

  constructor(
    private consultorModule:AdministConsultorComponent,
    private serv:ServInvestimentosService,
    private serv2:ServUsuariosService,
    private servBancos:ServBancosService,
    private servClient:ServClientesService, 
    private contasserv: ServContasService,
    private servContatos:ServContatosService,
    private cepserv: ServCepService,
    private messageService: MessageService) { }

  _ = get;
  @Input() investimentos

  comoSoube=[]
  estCivil=[]
  bens=[]
  ufs=[]
  tiposDeConta=[]
  bancos=[]
  tiposContratos=[]
  secretarias=[]

  ngOnInit(): void {
    this.recarregaTamanho()
    this.serv2.getSecretarias().subscribe(
      users=>{
        this.secretarias=users

        this.servBancos.getBancos().subscribe(resp=>{
          this.bancos=resp
        
          this.tiposContratos = this.serv.getTipoDeInvestimentos()
          this.comoSoube=this.servClient.getComoSoube()
          this.estCivil=this.servClient.getTiposEstadosCivil()
          this.bens=this.servClient.getTipoDeComunhaoDeBens()
          this.tiposDeConta=this.contasserv.getTiposDeConta()
          this.ufs=this.cepserv.getUFs()

          // this.novoContrato()
        })
      }
    );
  }
  
  //==========================================================================
  //MEUS CONTRATOS VIEW
  invest={}
  editarInvestimento = false

  verInvestimento(invest){
    this.invest = invest
    this.editarInvestimento=true
  }



  //==========================================================================
  newContract=false
  novoContratoObj={}
  novoContrato(){
    var dt= new Date()
    dt.setFullYear(dt.getFullYear()-19)
    this.novoContratoObj={
      consultorEmail: localStorage.getItem("email"),

      investidor: "",
      datNascimento: dt,
      cpf:null,
      rg: null,
      ufDoc: null,
      orgEmissor: null,
      nacionalidade: null,
      email: null,
      profissao: null,
      comoSoube:  this.comoSoube[0].value,
      estadoCivil: this.estCivil[0].value,
      regimeBens: null,

      datInvestimento: new Date(),
      vlrInvestimento: null,
      tpoContrato: this.tiposContratos[0].value,
      prazo: null,
      secretaria:this.secretarias[0],
      
      cep: null,
      estado: null,
      cidade: null,
      bairro: null,
      rua: null,
      nro: null,

      contatos: [],

      contasBancarias: [],

      imgPerfil: [],
      fotoDoc: [],
      fotoDeposito: [],
    }
    this.activeItem = this.steps[0];
    this.newContract=true
    // this.preehcher()
  }

  preehcher(){
    this.activeItem = this.steps[0];
    this.novoContratoObj['investidor']="Fulano de Tal"
    this.novoContratoObj['cpf']="123.654.789-19"
    this.novoContratoObj['rg']="12.365.456-9"
    this.novoContratoObj['ufDoc']="RJ"
    this.novoContratoObj['orgEmissor']="DETRAN"
    this.novoContratoObj['nacionalidade']="Brasileiro"
    this.novoContratoObj['email']="fulano da Silva@gmail.com"
    this.novoContratoObj['profissao']="Analista"
    this.novoContratoObj['vlrInvestimento']=150000
    this.novoContratoObj['prazo']=36
    this.novoContratoObj['cep']="13.450-041"
    this.procurarCEP( this.novoContratoObj['cep'])
    this.novoContratoObj['nro']="1722"
    this.novoContratoObj['contatos']=[{ tpoContato: 1, contato:'vitorheserrosa@gmail.com.br'}]
    this.novoContratoObj['contasBancarias']=[{ banco: this.bancos[1], agencia: "2222", titular: "Ciclano da Silva", conta: "112223344556", docTitular: "123654789" }]
  }


  anexos={
    imgPerfil: [],
    fotoDoc: [],
    fotoDeposito: []
  }
  salvar(){
    if(this.etapa0()==false){
      this.activeItem = this.steps[0];
    }else if(this.etapa5()==false){
        this.activeItem = this.steps[1];
    }else if(this.etapa1()==false){
      this.activeItem = this.steps[2];
    }else if(this.etapa2()==false){
      this.activeItem = this.steps[3];
    }else if(this.etapa3()==false){
      this.activeItem = this.steps[4];
    }else if(this.etapa4()==false){
      this.activeItem = this.steps[5];
    }else{
      this.novoContratoObj['datNascimento']=this.format(this.novoContratoObj['datNascimento'])
      this.novoContratoObj['datInvestimento']=this.format(this.novoContratoObj['datInvestimento'])
      this.novoContratoObj['cpf']=this.novoContratoObj['cpf'].replaceAll("\.","").replaceAll("-","")
      this.novoContratoObj['rg']=this.novoContratoObj['rg'].replaceAll("\.","").replaceAll("-","")
      this.newContract=false
      this.anexos['imgPerfil']=this.novoContratoObj['imgPerfil']
      this.anexos['fotoDoc']=this.novoContratoObj['fotoDoc']
      this.anexos['fotoDeposito']=this.novoContratoObj['fotoDeposito']
      this.salvarHTTP()
    }
  }
  salvarHTTP(){
    this.serv.postInvestimentosByConsult(this.novoContratoObj).subscribe(
      resp=>{
        this.messageService.add({severity:'success', summary: 'Investimento', detail:'Seu contrato foi salvo com sucesso', life: 5000});
        this.consultorModule.recarregarDash()

        this.serv.postInvestimentosAnexos(resp,this.anexos).subscribe(
          anexos=>{
            this.messageService.add({severity:'success', summary: 'Anexos', detail:'Os anexos foram salvos com sucesso', life: 5000});            
          },
          erro=>{
            this.messageService.add({severity:'error', summary: 'Anexos', detail:'Houve um erro ao salvar os Anexos', life: 5000});
          }
        )
      },
      erro=>{
        this.messageService.add({severity:'error', summary: 'Investimento', detail:'Houve um erro ao salvar seu contrato', life: 5000});
      }
    )
  }


  
  //==========================================================================
  //CHECAGENS PARA SALVAR
  format(data:Date){
    var  dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = data.getMonth().toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }

  etapa5(){
    var check = false
    if( 
      this.check("vlrInvestimento",0) &&
      this.check("prazo",0)  &&
      this.check("secretaria",0) 
    ){
      check=true
    }
    return check
  }

  etapa0(){
    var check = false
    if( 
      this.check("investidor",0) &&
      this.check("cpf",0) &&
      this.check("rg",0) &&
      this.check("ufDoc",0) &&
      this.check("orgEmissor",0) &&
      this.check("nacionalidade",0) &&
      this.check("email",0) &&
      this.check("profissao",0) &&
      this.check("comoSoube",0) &&
      this.check("estadoCivil",0)
    ){
      check=true
    }
    return check
  }
  etapa1(){
    var check = false
    if( 
      this.check("cep",0) &&
      this.check("estado",0) &&
      this.check("cidade",0) &&
      this.check("bairro",0) &&
      this.check("rua",0) &&
      this.check("nro",0) 
    ){
      check=true
    }
    return check
  }

  etapa2(){
    var check = false
    if( 
      this.check("contatos",1)
    ){
      check=true
    }
    return check
  }
  etapa3(){
    var check = false
    if( 
      this.check("contasBancarias",1)
    ){
      check=true
    }
    return check
  }

  etapa4(){
    var check = false
    if( 
      this.check("imgPerfil",1) &&
      this.check("fotoDoc",1)  &&
      this.check("fotoDeposito",1) 
    ){
      check=true
    }
    return check
  }



  check(campo,tipo){
    var checked = true

    //Tipos Label
    if(tipo==0){
      if(this.novoContratoObj[campo]==null || this.novoContratoObj[campo].length==0){
        this.messageService.add({severity:'warn', summary: 'Aviso', detail:'Você precisa preencher o campo '+campo, life: 5000});
        checked=false
      }
    
    //Tipos array
    }else if(tipo==1){
      if(this.novoContratoObj[campo].length==0){
        this.messageService.add({severity:'warn', summary: 'Aviso', detail:'Você precisa preencher o campo '+campo, life: 5000});
        checked=false
      }

    }
    return checked
  }


  //==========================================================================
  //UTILS
  activeItem;

  steps = [
    {
      id: 0 , label: 'Cliente', icon: "pi pi-user", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 5, label: 'Investimento', icon: "pi pi-money-bill", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 1 , label: 'Endereço', icon: "pi pi-map-marker", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 2 , label: 'Contato', icon: "pi pi-phone", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 3 , label: 'Contas', icon: "pi pi-wallet", command: (event) => { 
        this.activeItem= event.item 
      }
    },
    {
      id: 4 , label: 'Fotos', icon: "pi pi-camera", command: (event) => { 
        this.activeItem= event.item 
      }
    },
  ];

  onUpload(item, evnt){
    var file = evnt.files
    if(file.length>0){
      switch(item){
        case 1:
          this.novoContratoObj['imgPerfil']=[file[0]]
          break;
        case 2:
          this.novoContratoObj['fotoDoc']=[file[0]]
          break;
        case 3:
          this.novoContratoObj['fotoDeposito']=[file[0]]
          break;
  
      }
    }
  }
  
  width="60%"
  height=""
  cols=[
    { label: "Id",  cxlabel:true ,value: 'id' , width: "90px"},
    { label: "Data",  cxlabel:true ,value: 'datInvestimento' , width: "100px" },
    { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
    { label: "Tipo",  cxlabel:true ,value: 'tpoContrato' , width: "90px"},
    { label: "Secretaria",  cxlabel:true ,value: 'secretaria.nome' },
    { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
    { label: "Prazo",  cxlabel:true ,value: 'prazo', width: "90px" },
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria', width: "120px"  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  recarregaTamanho(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    this.height=(y-200)+"px"
    if(x<1000){
      this.cols=[
        { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
        { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }

  }
  
  cancelar(){
    this.editarNovaConta=false
    this.editarNovoContato=false
  }


  //==========================================================================
  //CONTATOS

  colsContatos=[
    { label: "Tipo",  cxlabel:true ,value: 'tpoContato', width: "30px" },
    { label: "Contato",  cxlabel:true ,value: 'contato'},
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  editarNovoContato=false

  tiposDeContato=[]
  
  novoContato(){
    this.tiposDeContato = this.servContatos.getTiposContatos()
    this.newObj={
      tpoContato: null,
      contato: null,
    }
    this.editarNovoContato=true
  }
  salvarContato(){
    this.novoContratoObj['contatos'].push(
      {
        tpoContato: this.newObj['tpoContato'],
        contato: this.newObj['contato']
      }
    )
    this.editarNovoContato=false
  }
  deleteContato(conta){
    this.novoContratoObj['contatos'].splice(conta,1)
  }

  procurarCEP(cep){
    this.cepserv.getCEP(cep).subscribe(
      resp=>{
        this.novoContratoObj['estado'] = resp['uf']
        this.novoContratoObj['bairro'] = resp['bairro']
        this.novoContratoObj['cidade'] = resp['localidade']
        this.novoContratoObj['rua'] = resp['logradouro']
      }
    )
  }
  
  
  //==========================================================================
  //CONTAS BANCÁRIAS
  editarNovaConta=false
  newObj={}
  colsContas=[
    { label: "Banco",  cxlabel:true ,value: 'banco.banco' },
    { label: "Agencia",  cxlabel:true ,value: 'agencia' },
    { label: "Titular",  cxlabel:true ,value: 'titular' },
    { label: "Conta",  cxlabel:true ,value: 'conta' },
    { label: "Doc.",  cxlabel:true ,value: 'docTitular' },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]
  novoConta(){
    this.newObj={
      titular: null,
      docTitular: null,
      banco: {},
      agencia:null,
      conta: null,
      contaConjunta: true,
      tpo: 0,
      cod: null,
      id: 0
    }
    this.editarNovaConta=true
  }
  salvarConta(){

    this.novoContratoObj['contasBancarias'].push(
      {
        titular: this.newObj['titular'],
        docTitular: this.newObj['docTitular'],
        banco: this.newObj['banco'],
        agencia: this.newObj['agencia'],
        conta: this.newObj['conta'],
        contaConjunta: this.newObj['contaConjunta'],
        tpo: this.newObj['tpo'],
        cod: this.newObj['cod']
      }
    )
    this.editarNovaConta=false
  }
  deleteContas(conta){
    this.novoContratoObj['contasBancarias'].splice(conta,1)
  }
}
