import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServBancosService } from 'src/app/services/serv-bancos.service';
import { ServRolesService } from 'src/app/services/serv-roles.service';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';


@Component({
  selector: 'app-cad-users',
  templateUrl: './cad-users.component.html',
  styleUrls: ['./cad-users.component.scss']
})
export class CadUsersComponent implements OnInit {

  constructor(private servRoles:ServBancosService , private serv:ServUsuariosService, private messageService: MessageService,) { 
  }

  consultores=[]
  arrCargos=[
    {label:"Gerente", value: "Gerente"},
    {label:"Consultor", value: "Consultor"},
    {label:"Secretaria", value: "Secretaria"},
    {label:"Financeiro Aprovação", value: "Financeiro Aprovação"},
    {label:"Financeiro Pagamento", value: "Financeiro Pagamento"},
  ]

  
  tiposDeConta=[
    {label:"Conta Corrente", value: "conta_corrente"},
    {label:"Conta Poupança", value: "conta_poupanca"}
  ]

  cols=[
    { label: "",              cxlabel:false ,value: 'foto' , width: "70px" },
    { label: "Nome",          cxlabel:true ,value: 'nome' },
    { label: "Cargo",         cxlabel:true ,value: 'cargo'},
    { label: "Email",         cxlabel:true ,value: 'email'},
    { label: "Ativo",         cxlabel:false ,value: 'ativo', width: "80px" },
    { label: "Resetar Senha", cxlabel:false ,value: 'reset', width: "90px" },
    { label: "",              cxlabel:false ,value: 'botao', width: "90px" },
  ]


  carregado = false
  width="50%"
  height=""
  
  bancos=[]
  ngOnInit() {
    this.carregado=false
    this.carregarUsers()
  }

  //========================================================
  //TESTES
  
  //========================================================
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
        { label: "",      cxlabel:false ,value: 'foto' , width: "70px" },
        { label: "Nome",  cxlabel:true ,value: 'nome' },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }

  }


  carregarUsers(){
    this.serv.getUsers().subscribe(
      resp=>{
        this.consultores=resp
        this.getBancos()
      }
    )
  }

  getBancos(){
    setTimeout(() => {
      this.servRoles.getBancos().subscribe(
        resp=>{
          this.bancos=resp
          this.carregado=true
        }
      )
    }, 500);
  }

  editarUser=false
  newUsuario=false
  consultor
  list1:any[]=[]
  list2:any[]=[]


  novoUsuario(){
    this.coletarEscritorios()
    this.newUsuario=true
    var user={
      id: null,
      nome: "",
      email: "",
      ativo: true,
      senha: "",
      cargo: "",
      foto: null,

      cpf: null,
      banco: null,
      agencia: null,
      conta: null,
      tpo: null,
      contaConjunta: false,

      ferias: false,
      escritorioLocal: null,
    }
    this.consultor=user
    this.editarUser=true
  }

  editUsuario(user){
    var newuser={
      id: user.id,
      nome: user.nome,
      email: user.email,
      ativo: user.ativo,
      senha: user.senha,
      cargo: user.cargo,
      foto: user.foto,

      cpf: user.cpf,
      banco: user.banco,
      agencia: user.agencia,
      conta: user.conta,
      tpo: user.tpo,
      contaConjunta: user.contaConjunta,

      ferias: user.ferias,
      escritorioLocal: user.escritorioLocal,
    }
    console.log(newuser)
    return newuser
  }


  verConsultor(user){
    this.coletarEscritorios()
    this.serv.getUser(user.id).subscribe(
      resp=>{
        console.log(resp)
        this.consultor=resp
        this.newUsuario=false
        this.editarUser=true
      }
    )
  }

  resetSenha(user){
    console.log(user)
    this.serv.resetSenha(user.id).subscribe(
      resp=>{
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Senha resetada com sucesso', life: 5000});
      },erro=>{
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao resetar a senha', life: 5000});
      }
    )
  }


  ativarUsuario(consultor){
    this.serv.putUser(consultor).subscribe(
      resp=>{
        this.editarUser=false
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Usuário '+(consultor.ativo ? 'ativado' : 'desativado') + ' com sucesso', life: 5000});
        this.carregarUsers()
      },erro=>{
        this.editarUser=false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao executar a ação', life: 5000});
      }
    )
  }
  salvarUsuario(){
    this.verificarSeEscritorioExiste(this.consultor.escritorioLocal)
    this.consultor.nome = this.consultor.nome.toUpperCase()
    if(this.newUsuario){
      this.serv.insertUser(this.consultor).subscribe(
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
      this.serv.putUser(this.consultor).subscribe(
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
    this.newUsuario=false
  }
  Cancelar(){
    this.list1=[]
    this.list2=[]
    this.editarUser=false
    this.consultor={}

  }


  deletarUsuario(){
    this.serv.deleteUser(this.consultor).subscribe(
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


  escritorios=[]
  coletarEscritorios(){
    this.serv.getEscritorios().subscribe(
      escrit=>{
        this.escritorios=[]
        for(var i=0;i<escrit.length;i++){
          this.escritorios.push(
            { label: escrit[i] , value: escrit[i] }
          )
        }
      }
    )
  }
  verificarSeEscritorioExiste(escritorio){
    if(escritorio!=null){
      var escrit=null
      for(var i=0;i<this.escritorios.length;i++){
        var obj =this.escritorios[i].label.toLowerCase()
  
        if(obj.indexOf(escritorio.toLowerCase())>-1){
          escrit=this.escritorios[i].value
          break;
        }
      }
    }
    return escrit==null ? escritorio!=null ? escritorio.toUpperCase() : null : escrit.toUpperCase()
  }


  uploadedFiles=[]
  onUpload(event){
    if(event.files.length==0){
      this.messageService.add({severity: 'info', summary: 'Upload', detail: 'Selecione um Upload'});
    }else{
      this.editarUser=false
      for(let file of event.files) {
        this.serv.atualizarFoto(this.consultor.id,file).subscribe(
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
