import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as jwt_decode from "jwt-decode";
import { ServUsuariosService } from 'src/app/services/serv-usuarios.service';
import { AppMainComponent } from 'src/app/app.main.component';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  UsuarioSelect: any;
  constructor(private adminserv: ServUsuariosService, private main: AppMainComponent,private messageService: MessageService) {}

  nome
  urlimage
  carregado = false
  localStorage=localStorage

  getDecodedAccessToken(): any {
    try{
        return jwt_decode(sessionStorage.getItem('token'));
    }
        catch(Error){
        return null;
    }
} 
  ngOnInit() {
    this.fileCarregado=true
    this.nome = localStorage.getItem('nome')
    this.urlimage = localStorage.getItem('foto')
    console.log(localStorage.getItem("email"))
    this.adminserv.getUserByEmail(localStorage.getItem("email")).subscribe(
      us=>{
        console.log(us)
        this.UsuarioSelect = {
          id:    us['id'],
          nome:  us['nome'],
          email: us['email'],
          login: us['login'],
          cargo: us['cargo'],
          ativo: us['ativo']
        }
        this.carregado=true
        console.log(this.UsuarioSelect)
      }
    )
  }

  alterarNomeOuEmail(){
    this.main.fileCarregado=false
    console.log(this.UsuarioSelect)
    this.adminserv.putUser(this.UsuarioSelect).subscribe(
      response => {
        if(response === null){
          this.messageService.add({sticky: true, severity:'success', summary: 'Dados Salvos!', detail:'Dados de usuário atualizados com sucesso!'});
        }
      },
      error =>  { 
        this.messageService.add({severity:'error', summary: "Dados não Enviados!", detail: error.message, life: 500});
      }
    );
  }


  resetarSenha(){
    console.log(this.UsuarioSelect)
    this.adminserv.attSenha(this.UsuarioSelect).subscribe(
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
  }


  files=[]
  fileCarregado=false
  uploadImage(image){
    this.fileCarregado=false
    this.main.fileCarregado=false
    var file: File = image.files[0]
    this.adminserv.atualizarFoto(this.UsuarioSelect.id,file).subscribe(
      resp=>{
        this.messageService.add({sticky: true, severity:'success', summary: 'Imagem Alterada', 
        detail:'Você precisa relogar para conseguir ver'});
        this.fileCarregado=true
        this.main.fileCarregado=true
      },erro=>{
        this.messageService.add({sticky: true, severity:'error', summary: 'Erro ao Alterar', 
        detail:'Erro ao alterar a imagem'});
        this.main.fileCarregado=true
      }
    );
  }


}
