import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ServRolesService } from 'src/app/services/serv-roles.service';
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';

@Component({
  selector: 'app-cad-users',
  templateUrl: './cad-users.component.html',
  styleUrls: ['./cad-users.component.scss']
})
export class CadUsersComponent implements OnInit {

  constructor(private servRoles:ServRolesService , private serv:ServUsuariosService, private messageService: MessageService,) { }

  consultores=[]
  arrCargos=[
    {label:"Gerente", value: "Gerente"},
    {label:"Consultor", value: "Consultor"},
    {label:"Financeiro", value: "Financeiro"},
  ]
  cols=[
    { label: "",      cxlabel:false ,value: 'foto' , width: "70px" },
    { label: "Nome",  cxlabel:true ,value: 'nome' },
    { label: "Login", cxlabel:true ,value: 'login'},
    { label: "Cargo", cxlabel:true ,value: 'cargo'},
    { label: "Email", cxlabel:true ,value: 'email'},
    { label: "Ativo", cxlabel:false ,value: 'ativo', width: "80px" },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  perfis
  carregado = false
  ngOnInit() {
    this.servRoles.getPerfis().subscribe(
      perfis=>{
        this.perfis=perfis
        this.carregarUsers()
        console.log(perfis)
        
      }
    )
  }

  carregarUsers(){
    this.carregado=false
    setTimeout(() => {
      this.serv.getUsers().subscribe(
        resp=>{
          this.consultores=resp
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


  verConsultor(user){
    this.newUsuario=false
    this.consultor=user
    this.preencherList(this.consultor)
    this.list2 = user.perfis
    this.editarUser=true
  }
  novoUsuario(){
    this.newUsuario=true
    var user={
      nome: "",
      email: "",
      login: "",
      ativo: true,
      senha: "",
      cargo: "",
      perfis: [],
      foto: null
    }
    this.consultor=user
    this.preencherList(this.consultor)
    this.list2 = user.perfis
    this.editarUser=true
  }
  preencherList(user){
    this.list1=[]
    this.list2=[]
    for(var  i=0;i<this.perfis.length;i++){
      var perfil = this.perfis[i]
      if(user.perfis.filter(function(e){ return e.id == perfil.id })==0){
        this.list1.push(perfil)
      }
    }
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
    this.consultor.perfis = this.list2
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
}
