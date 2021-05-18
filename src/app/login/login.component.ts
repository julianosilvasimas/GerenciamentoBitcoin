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
  alterarsenha(){
    
    if(this.novasenha === this.novasenhaconfirm){
      var id
      this.authService.usuario2(sessionStorage.getItem('email'),this.token)
      .subscribe(res=>{
        console.log(res)
        this.authService.senhaUpdate2(res['iduser'] , this.novasenha,this.token)
        .subscribe(
          response => {
            this.log.salvarlog("Alterar Senha","Editar");
            this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Senha alterada corretamente!!!', life: 5000});
            this.senhapad = false;
            this.usuario.senha = this.novasenha
            setTimeout(() => {
              this.logar()
            }, 1000);
          },
          error =>  { 
            this.messageService.add({severity:'error', summary: "Senha não alterada!", detail:error.message, life: 5000});
            console.log(error)
          }
        );
    });

      this.senhapad = false;
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
    this.authService.fazerLogin(this.usuario)
    .subscribe(
      resp => {
          // console.clear()
          var keys = resp.data.get('Authorization');
          this.token = keys 
          localStorage.setItem('token', keys);

          var us = this.getDecodedAccessToken(this.token)
        
          this.adminserv.getUserByEmail(us.sub.replaceAll("\"","")).subscribe(resp2=>{
              console.log(resp2)

              this.authService.getToken(localStorage.getItem('token'));
              localStorage.setItem('email', resp2['email']);
              localStorage.setItem('cargo', resp2['cargo']);
              localStorage.setItem('nome', resp2['nome']);
              localStorage.setItem('foto', resp2['foto']==null? 'assets/layout/images/noImage.png' : resp2['foto']);

              this.authService.userDados()
              
              setTimeout(() => {
                // Faz o check se é primeiro acesso
                if(this.usuario.senha === 'bitcoingerenciator'){
                  this.messageService.add({severity:'warn', summary: "Login não efetuado!", detail:'Redefina sua senha!', life: 5000});
                  this.senhapad = true;
                }else{
                  this.authService.checkAutenticado(resp.status);
                  document.body.style.background  = '#ebebeb8f';
                  this.router.navigate(['/']);  //precisa melhorar a permissões no menu
                  
                }
                this.carregando= false
              }, 1500);
            }
          )
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
