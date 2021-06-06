import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from './login.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as jwt_decode from "jwt-decode";
import { LogservService } from './logserv.service';
import { ServUsuariosService } from '../services/serv-usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: Usuario = new Usuario();
  public permissao: string;
  public novasenha: string;
  public novasenhaconfirm: string;
  public senhapad: boolean =false;
  carregando = false

  viewpass=true

  constructor(
    
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private log:LogservService,
    private adminserv: ServUsuariosService
  ) {
    document.body.style.backgroundImage  = ' url("../../assets/layout/images/background.png") ';
   }

  ngOnInit() {

  }
  token
  user
  alterarsenha(){
    
    if(this.novasenha === this.novasenhaconfirm){
      var id
        this.authService.senhaUpdate2(this.user['id'] ,this.user['email'] , this.novasenha,this.token)
        .subscribe(
          response => {
            this.log.salvarlog("Alterar Senha","Editar");
            this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Senha alterada corretamente!!!', life: 5000});
            this.senhapad = false;
            this.usuario.senha = this.novasenha
            setTimeout(() => {
              this.logar()
            }, 500);
          },
          error =>  { 
            this.messageService.add({severity:'error', summary: "Senha não alterada!", detail:error.message, life: 5000});
            // console.log(error)
          }
        );

    }else{
      this.messageService.add({severity:'error', summary: "Senha não alterada!", detail:'As senhas digitadas não conferem!!!', life: 5000});
    } 
  }
  getDecodedAccessToken(token): any {
      try{
          return jwt_decode(token);
      }
          catch(Error){
          return null;
      }
  } 

  logar(){
    this.carregando= true
    sessionStorage.clear()
    console.log(" Login ativado")
    this.authService.fazerLogin(this.usuario)
    .subscribe(
      resp => {
          var keys = resp.data.get('Authorization');
          this.token = keys 
          localStorage.setItem("token",this.token)
          var us = this.getDecodedAccessToken(this.token)
          
          setTimeout(() => {
            this.adminserv.getUserByEmailToken(us.sub.replaceAll("\"",""),this.token).subscribe(resp2=>{

                this.user=resp2

                this.authService.getToken(localStorage.getItem('token'));
                localStorage.setItem('email', resp2['email']);
                localStorage.setItem('cargo', resp2['cargo']);
                localStorage.setItem('nome', resp2['nome']);
                localStorage.setItem('foto', resp2['foto']==null? 'assets/layout/images/noImage.png' : resp2['foto']);

                this.authService.userDados(localStorage.getItem('token'))
                
                  // Faz o check se é primeiro acesso
                  if(this.usuario.senha === 'bitcoingerenciator'){
                    this.messageService.add({severity:'warn', summary: "Login não efetuado!", detail:'Redefina sua senha!', life: 5000});
                    this.senhapad = true;
                  }else{
                    setTimeout(() => {
                      console.log("Autenticado")
                      this.authService.checkAutenticado(resp.status);
                      document.body.style.background  = '#ebebeb8f';
                      this.router.navigate(['/']);  //precisa melhorar a permissões no menu
                    }, 1000);
                    
                  }
                  this.carregando= false
              }
          )
        }, 500);
      },
      error=>{
        if(error.status === 0){
          this.messageService.add({severity:'error', summary: "Login não efetuado!", detail: "Servidor Inoperante!" , life: 5000});
        }else{
          this.messageService.add({severity:'error', summary: "Login não efetuado!", detail: error.error.message , life: 5000});
        }
        this.carregando= false
      }
    )
  }

}
