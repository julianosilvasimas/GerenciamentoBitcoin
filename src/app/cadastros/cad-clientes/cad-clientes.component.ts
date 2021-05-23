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
    { label: "",  cxlabel:false ,value: 'imgPerfil', width: "70px"  },
    { label: "CPF",  cxlabel:true ,value: 'cpf' },
    { label: "Nome",  cxlabel:true ,value: 'investidor' },
    { label: "Email",  cxlabel:true ,value: 'email' },
    { label: "Estado",  cxlabel:true ,value: 'estado' },
    { label: "Cidade",  cxlabel:true ,value: 'cidade' },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  ufs=[
      { label: "Rondônia RO	          ", value: "RO"},
      { label: "Acre AC	              ", value: "AC"},
      { label: "Amazonas AM	          ", value: "AM"},
      { label: "Roraima RR	          ", value: "RR"},
      { label: "Pará PA	              ", value: "PA"},
      { label: "Amapá AP	            ", value: "AP"},
      { label: "Tocantins TO	        ", value: "TO"},
      { label: "Maranhão MA	          ", value: "MA"},
      { label: "Piauí PI	            ", value: "PI"},
      { label: "Ceará CE	            ", value: "CE"},
      { label: "Rio Grande do Norte RN", value: "RN"},
      { label: "Paraíba PB	          ", value: "PB"},
      { label: "Pernambuco PE	        ", value: "PE"},
      { label: "Alagoas AL	          ", value: "AL"},
      { label: "Sergipe SE	          ", value: "SE"},
      { label: "Bahia BA	            ", value: "BA"},
      { label: "Minas Gerais MG	      ", value: "MG"},
      { label: "Espírito Santo ES	    ", value: "ES"},
      { label: "Rio de Janeiro RJ	    ", value: "RJ"},
      { label: "São Paulo SP	        ", value: "SP"},
      { label: "Paraná PR	            ", value: "PR"},
      { label: "Santa Catarina SC	    ", value: "SC"},
      { label: "Rio Grande do Sul RS  ", value: "RS"},
      { label: "Mato Grosso do Sul MS	", value: "MS"},
      { label: "Mato Grosso MT	      ", value: "MT"},
      { label: "Goiás GO	            ", value: "GO"},
      { label: "Distrito Federal DF	  ", value: "DF"}
  ]

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
  
  tiposDeConta=[
    {label:"Conta Corrente", value: 0},
    {label:"Conta Poupança", value: 1},
  ]

  carregado = false
  ano1=2020
  ano2=2020
  

  activeIndex=0

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
        { label: "Nome",  cxlabel:true ,value: 'investidor' },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }

  }


  ngOnInit(): void {
    this.recarregaTamanho()
    this.ano1 = (new Date().getFullYear()-18)
    this.ano2 = ((this.ano1)-60)

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
        }
      )
    }, 500);
  }

  editarUser=false
  newUsuario=false
  consultor

  verConsultor(user){
    this.consultor=user
    this.newUsuario=false
    this.editarUser=true
  }
  novoUsuario(){
    this.newUsuario=true
    var dt= new Date()
    dt.setFullYear(dt.getFullYear()-19)
    this.consultor={
      cpf:null,
      investidor: "",
      imgPerfil: null,
      email: null,
      nacionalidade: null,
      profissao: null,
      datNascimento: dt,
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

  
  displayBasic2 =false
  images=[]
  verImagens(user,i){
    this.images=[]
    if(i==1){
      this.images.push(user.fotoDoc)
    }
    if(i==2){
      this.images.push(user.imgPerfil)
    }
    this.displayBasic2=true
  }

  uploadedFiles: any[] = [];
  onUpload(event,i){
    if(event.files.length==0){
      this.messageService.add({severity: 'info', summary: 'Upload', detail: 'Selecione um Upload'});
    }else{
      this.editarUser=false
      for(let file of event.files) {
        if(i==2){
          this.serv.putFotoCliente(file,this.consultor.cpf).subscribe(
            resp=>{
              this.carregarUsers()
              this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
            },erro=>{
              this.carregarUsers()
              this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
            }
          )
        }else{
          this.serv.putDocumentoCliente(file,this.consultor.cpf).subscribe(
            resp=>{
              this.carregarUsers()
              this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
            },erro=>{
              this.carregarUsers()
              this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
            }
          )
        }
      }
    }
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
    this.consultor.cpf = this.consultor.cpf.replaceAll(".","").replaceAll("-","")
    if(this.consultor.investidor==null  || this.consultor.email==null || this.consultor.cpf==null){
      this.messageService.add({severity:'warn', summary: 'Faltam Itens', detail:'Preencha pelo menos o nome e o email', life: 5000});

    }else{
      this.consultor.datNascimento  = this.consultor.datNascimento == null ? null : this.consultor.datNascimento.toString().length>10 ? this.format(this.consultor.datNascimento) : this.consultor.datNascimento
      if(this.newUsuario){     
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
        this.consultor.datNascimento  = this.consultor.datNascimento == null ? null : this.consultor.datNascimento.toString().length>10 ? this.format(this.consultor.datNascimento) : this.consultor.datNascimento
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
  format(data:Date){
    var  dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = data.getMonth().toString(), //+1 pois no getMonth Janeiro começa com zero.
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
