import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { LogservService } from 'src/app/login/logserv.service';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private adminserv: UserServiceService, private messageService: MessageService,private log:LogservService) {}


  usuarios: any[]; 
  usuariosCompleto: any[]; 
  gerencias:any[]; 
  supervisoes:any[]; 
  unidades:any[]; 

  UsuarioSelect: any;
  EditUsuario: boolean = false;
  
  PermissoesSelect: any;
  UsuarioEditarPermissoes: any;
  EditPermissoes: boolean = false;

  sourcePermissoes: any[];
  targetPermissoes: any[];

  ngOnInit() {
    this.log.salvarlog("Ferramentas","Usuários");

    this.atualizarlista();
  }
  selecionar(usuario){
    // console.log(usuario)
    this.UsuarioSelect= usuario==null ? this.novoUsuario() : usuario;
    this.EditUsuario = true
  }
  novoUsuario(){
    return {
      id: 0,
      nome: null,
      email: null,
      login: null,
      perfis: [],
      acesso: 2
    }

  }


  //====================================================================================

  resetarSenha(){
    this.adminserv.resetSenha(this.UsuarioSelect).subscribe(
      response => {
        this.messageService.add({sticky: true, severity:'success', summary: 'Dados Salvos!', 
        detail:'Senha foi resetada!'});
        this.atualizarlista();

      },
      error =>  { 
        this.messageService.add({severity:'error', summary: "Dados não Enviados!", detail: error.message, life: 3500});
        this.atualizarlista();
      }
    );
    this.EditUsuario = false
    this.UsuarioSelect=null
  }

  //====================================================================================

  updateUser(usuario: any){
    // console.log(usuario)
    usuario.ativo = usuario.ativo === true ? 1 : 0;
    this.adminserv.updateUsers(usuario).subscribe(
      response => {
        if(response === null){
          this.messageService.add({sticky: true, severity:'success', summary: 'Dados Salvos!', 
          detail:'Usuário '+usuario.nome+ ' foi alterado com sucesso!'});
          this.atualizarlista();
        }
      },
      error =>  { 
        this.messageService.add({severity:'error', summary: "Dados não Enviados!", detail: error.message, life: 3500});
        this.atualizarlista();
      }
    );
    this.EditUsuario = false
    this.UsuarioSelect=null
  }

  //====================================================================================

  atribuirPermissoes(usuario: any){
    this.EditPermissoes = true;
    this.PermissoesSelect = usuario.perfis;

        this.adminserv.listpermissoes().subscribe(
          response => {
            this.newarray(usuario.perfis,response);           
          }
        );
  }

  editarPermissoes(){
    // var newpermissoes =[]
    // console.log(this.UsuarioSelect)
    for(var i =0;i<this.UsuarioSelect.perfis.length;i++){
      delete this.UsuarioSelect.perfis[i].authority
    }
    // console.log(this.UsuarioSelect)
    
    this.adminserv.updateUser(this.UsuarioSelect).subscribe(
      response => {
        if(response === null){
          this.messageService.add({sticky: true, severity:'success', summary: 'Dados Salvos!', 
          detail:'Usuário '+ ' foi alterado com sucesso!'});
        }
      },
      error =>  { 
        this.messageService.add({severity:'error', summary: "Dados não Enviados!", detail: error.message, life: 500});
      }
    );   
    this.PermissoesSelect=false
    this.EditUsuario=false
    this.EditPermissoes=false
    this.atualizarlista();
  }

  newarray(minhasperm: any[], todasperm:any[]){
    this.sourcePermissoes = todasperm
    // this.sourcePermissoes.filter(function(e){
    //   return minhasperm.indexOf(e)>=0;
    // })
    
    for(var i = 0; i<minhasperm.length;i++){
      for(var j = 0; j<todasperm.length;j++){
        if(minhasperm[i].id === todasperm[j].id){
          this.sourcePermissoes.splice(j,1)
          break;
        }
      }
    }  
  }
  //====================================================================================
  VALOR1
  Filter(){
    this.VALOR1 = this.VALOR1==undefined ? null : this.VALOR1=="" ? null : this.VALOR1;
    var agend = this.usuarios;''
    if(this.VALOR1!==null){
      // console.log(this.VALOR1)
      agend = agend.filter(item => item.nome.toUpperCase().includes(this.VALOR1.toUpperCase()))
    }else{
      this.atualizarlista();
    }

    this.usuarios = agend

  }
  
  atualizarlista(){
    setTimeout(() => {  
      this.usuarios=[]
      this.adminserv.listusers().subscribe(
        response =>{
          console.log(response)
          this.usuarios = response
        }
      )
    }, 500);
  }

  Mensagem(dado, perfil){
    this.messageService.add({sticky: true, severity:'info', summary: perfil, detail:dado, life: 500});
  }
  
  mostrarInfoPerfil(perfil){
    this.messageService.add({sticky: true, severity:'info', summary: perfil.perfil, detail:perfil.descricao, life: 5});
  }



  usSelec
  atribuirpermdash=false
  atribuirpermdashs(usuario){
    this.usSelec=usuario
    this.atribuirpermdash=true
  }
}