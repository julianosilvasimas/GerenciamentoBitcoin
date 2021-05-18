import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServCepService } from 'src/app/services/serv-cep.service';
import { ServClientesService } from 'src/app/services/serv-clientes.service';
import { ServRolesService } from 'src/app/services/serv-roles.service';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';

@Component({
  selector: 'app-cad-clientes',
  templateUrl: './cad-clientes.component.html',
  styleUrls: ['./cad-clientes.component.scss']
})
export class CadClientesComponent implements OnInit {

  constructor(private servRoles:ServRolesService , 
    private serv:ServClientesService, 
    private messageService: MessageService,
    private cepserv: ServCepService,
    ) { }

  clientes=[]
  cols=[
    { label: "Nome",  cxlabel:true ,value: 'investidor' },
    { label: "Email",  cxlabel:true ,value: 'email' },
    { label: "Estado",  cxlabel:true ,value: 'estado' },
    { label: "Cidade",  cxlabel:true ,value: 'cidade' },
    { label: "R.G.",  cxlabel:true ,value: 'rg' },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]
  es = {
    firstDayOfWeek: 1,
    dayNames: [ "domingo","segunda","terça","quarta","quinta","sexta","sábado" ],
    dayNamesShort: [ "dom","seg","ter","qua","qui","sex","sab" ],
    dayNamesMin: [ "D","S","T","Q","Q","S","S" ],
    monthNames: [ "janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro" ],
    monthNamesShort: [ "jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez" ],
    today: 'Hoje',
    clear: 'Limpar'
  }

  comoSoube=[
    { label: "Amigo", value: "amigo"},
    { label: "Consultor", value: "consultor"},
    { label: "Facebook", value: "facebook"},
    { label: "Instagram", value: "instagram"},
    { label: "Twitter", value: "twitter"},
    { label: "Linkedin", value: "linkedin"},
    { label: "WhatsApp", value: "whatsapp"},
  ]
  estCivil=[
    { label: "Solteiro(a)", value: "solteiro"},
    { label: "Casado(a)", value: "casado"}
  ]
  bens=[
    { label: "Comunhão Parcial", value: "comunhao parcial"},
    { label: "Comunhão Universal", value: "comunhao universal"},
    { label: "Separação Total", value: "separacao total"},
    { label: "Separação Obrigatória", value: "separacao obrigatoria"},
    { label: "Participação final nos aquestos", value: "Participação final nos aquestos"},
  ]

  carregado = false
  ano1=2020
  ano2=2020
  
  items=[
    {label: 'Edições',          value: 1, icon: 'pi pi-fw pi-pencil',
      command: (event: any) => {
          this.activeIndex = 0;
      }
    },
    {label: 'Contatos',        value: 2, icon: 'pi pi-fw pi-phone',
      command: (event: any) => {
          this.activeIndex = 1;
      }
    },
    {label: 'Contas Bancárias', value: 3, icon: 'pi pi-fw pi-money-bill',
      command: (event: any) => {
          this.activeIndex = 2;
      }
    },
  ]
  activeIndex=0
  activeItem=this.items[this.activeIndex]

  ngOnInit() {
    this.ano1 = (new Date().getFullYear()-18)
    this.ano2 = ((this.ano1)-90)

    this.carregarUsers()
  }

  carregarUsers(){
    this.carregado=false
    setTimeout(() => {
      this.serv.getClientes().subscribe(
        resp=>{
          console.log(resp)
          this.clientes=resp
          this.carregado=true
          this.newUsuario=false
          
          // this.verConsultor(resp[0])
          // this.activeIndex=1
          // this.activeItem=this.items[this.activeIndex]
        }
      )
    }, 500);
  }

  editarUser=false
  newUsuario=false
  consultor

  verConsultor(user){
    this.newUsuario=false
    this.consultor=user
    this.editarUser=true
  }
  novoUsuario(){
    this.newUsuario=true
    this.consultor={
      id:0,
      investidor: "",
      email: null,
      nacionalidade: null,
      profissao: null,
      datNascimento: null,
      rg: null,
      orgEmissor: null,
      ufDoc: null,
      rua: null,
      nro: null,
      bairro: null,
      cidade: null,
      estado: null,
      pais: null,
      cep: null,
      estadoCivil: null,
      regimeBens: null,
      comoSoube: null,
      fotoDoc: null
    }
    this.editarUser=true
  }


  procurarCEP(cep){
    this.cepserv.getCEP(cep).subscribe(
      resp=>{
        console.log(resp)
        this.consultor.estado = resp['uf']
        this.consultor.bairro = resp['bairro']
        this.consultor.cidade = resp['localidade']
        this.consultor.rua = resp['logradouro']
      }
    )
  }

  salvarUsuario(){
    console.log(this.consultor)
    this.consultor.contasBancarias=[]
    this.consultor.contatos=[]
    if(this.consultor.investidor==null  || this.consultor.email==null){
      this.messageService.add({severity:'warn', summary: 'Faltam Itens', detail:'Preencha pelo menos o nome e o email', life: 5000});

    }else{
      if(this.newUsuario){     
        this.consultor.datNascimento = this.consultor.datNascimento==null? "" : this.consultor.datNascimento 
        this.serv.postClientes(this.consultor).subscribe(
          resp=>{
            this.editarUser=false
            this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
            this.carregarUsers()
          },erro=>{
            this.editarUser=false
            this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
          }
        )
      }else{
        this.consultor.datNascimento  = this.consultor.datNascimento == null ? null : this.consultor.datNascimento.toString().length>10 ? this.format2(this.consultor.datNascimento) : this.consultor.datNascimento
        this.consultor.regimeBens = this.consultor.perfis !=null && this.consultor.estadoCivil.indexOf('casado')==-1 ? null : this.consultor.regimeBens
      
        this.serv.putClientes(this.consultor).subscribe(
          resp=>{
            this.editarUser=false
            this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
            this.carregarUsers()
          },erro=>{
            this.editarUser=false
            this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
          }
        )
      }
    }
  }
  format2(data:Date){
    var  dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  Cancelar(){
    this.editarUser=false
    this.consultor={}

  }


  deletarUsuario(){
    this.serv.deleteClientes(this.consultor).subscribe(
      resp=>{
        this.editarUser=false
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Deletado com sucesso', life: 5000});
        this.carregarUsers()
      },erro=>{
        this.editarUser=false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao deletar', life: 5000});
      }
    )
  }
}
