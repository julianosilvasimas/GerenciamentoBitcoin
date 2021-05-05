import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Usuario } from './login.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LogservService } from './logserv.service';

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
    private log:LogservService
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
            this.logar()
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

  logar(){
    sessionStorage.clear()
    var rout = this.router
    var serv = this.authService
    setTimeout(function(){  
      serv.checkAutenticado(200);
      rout.navigate(['/']);  
    },1000); 

  }
  logarDepois(){
    this.carregando= true
    sessionStorage.clear()
    this.authService.fazerLogin(this.usuario)
    .subscribe(
      resp => {
          this.carregando= false
          var keys = resp.data.get('Authorization');
          this.token = keys 
          localStorage.setItem('token', keys);
          this.authService.getToken(localStorage.getItem('token'));

          this.authService.userDados()
          
          
          // Faz o check se é primeiro acesso
          if(this.usuario.senha === '123'){
            this.messageService.add({severity:'error', summary: "Login não efetuado!", detail:'A senha é a padrão para primeiro acesso!!!', life: 5000});
            this.senhapad = true;
          }else{
            this.log.salvarlog("Login","Redirect");
            this.authService.checkAutenticado(resp.status);
            document.body.style.background  = '#ebebeb8f';
            this.router.navigate(['/']);  //precisa melhorar a permissões no menu
            
          }
      },
      error=>{
        this.carregando= false
        if(error.status === 0){
          this.messageService.add({severity:'error', summary: "Login não efetuado!", detail: "Servidor Inoperante!" , life: 5000});
        }else{
          this.messageService.add({severity:'error', summary: "Login não efetuado!", detail: error.error.message , life: 5000});
        }
      }
    )
  }

}
