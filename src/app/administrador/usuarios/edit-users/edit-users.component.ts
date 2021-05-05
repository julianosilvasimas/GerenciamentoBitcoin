import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { MessageService } from 'primeng/api';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  UsuarioSelect: any;
  constructor(private adminserv: UserServiceService, private messageService: MessageService) {}

  urlimage

  getDecodedAccessToken(): any {
    try{
        return JSON.parse(jwt_decode(sessionStorage.getItem('token')).iss);
    }
        catch(Error){
        return null;
    }
  }
  ngOnInit() {
    var us = this.getDecodedAccessToken()
    this.urlimage = this.adminserv.acharimagem(us.id);
    // console.log(us)
    this.UsuarioSelect = {
      id: us.id,
      nome: us.nome,
      email: us.email,
      login: us.login,
      acesso: us.acesso,
      perfis: []
    }
  }

  editarPermissoes(){
    this.adminserv.updateUser2(this.UsuarioSelect).subscribe(
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
  }
  resetarSenha(){
    console.log(this.UsuarioSelect)
    this.adminserv.resetSenha(this.UsuarioSelect).subscribe(
      response => {
        if(response === null){
          this.messageService.add({sticky: true, severity:'success', summary: 'Dados Salvos!', 
          detail:'Senha '+this.UsuarioSelect.nome+ ' foi resetada!'});
        }
      },
      error =>  { 
        this.messageService.add({severity:'error', summary: "Dados não Enviados!", detail: error.message, life: 500});
      }
    );
    this.UsuarioSelect=null
  }


  files=[]
  uploadImage(image){

    var file: File = image.files[0]
    this.adminserv.fotoAtualizar(file,this.UsuarioSelect.id).subscribe(
      resp=>{
        this.messageService.add({sticky: true, severity:'success', summary: 'Imagem Alterada', 
        detail:'Você precisa relogar para conseguir ver'});
      }
    );
  }


}
