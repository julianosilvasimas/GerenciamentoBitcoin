import {Component, AfterViewInit, OnDestroy, ViewChild, Renderer2, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import * as jwt_decode from "jwt-decode";
import { AppComponent } from './app.component';
import { UserServiceService } from './administrador/usuarios/user-service.service';
import { AuthService } from './login/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {

    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;

    documentClickListener: () => void;

    menuClick: boolean;

    topMenuButtonClick: boolean;

    configActive: boolean;

    configClick: boolean;

    nome
    admin
    urlimage

    getDecodedAccessToken(): any {
        try{
            return JSON.parse(jwt_decode(sessionStorage.getItem('token')).iss);
        }
            catch(Error){
            return null;
        }
    } 
    permissao

    constructor(
        public renderer: Renderer2, 
        private primengConfig: PrimeNGConfig, 
        public app: AppComponent,
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService,
        private adminserv: UserServiceService
    ) {
        var us = this.getDecodedAccessToken()
        this.nome = "Fulano da Silva"
        
        this.urlimage ="./assets/layout/images/avatar_2.png";
        var adm =false
    }
    //==================================FATURAS PENDENTES=================================
    faturasPendentes:boolean = false
    faturasPendentesShow(){
        this.faturasPendentes = false
        this.faturasPendentes = true
    }


    qtdNotific:any= 0;
    nomeParaFaturas
    refParaFaturas

    ngOnInit() {

        
        this.primengConfig.ripple = true;
    }
    RefAtual(data:Date){
      var dia  = data.getDate().toString(),
          diaF = (dia.length == 1) ? '0'+dia : dia,
          mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
          mesF = (mes.length == 1) ? '0'+mes : mes,
          anoF = data.getFullYear(),
          hora  = (data.getHours()).toString(), //+1 pois no getMonth Janeiro começa com zero.
          min  = (data.getMinutes()).toString();
      return anoF+"-"+mesF+"-01";
    }

    ngAfterViewInit() {
        // hides the overlay menu and top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }

                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            this.configClick = false;
            this.menuClick = false;
            this.topMenuButtonClick = false;
        });
    }

    toggleMenu(event: Event) {
        this.menuClick = true;
        if (this.isDesktop()) {
            this.menuInactiveDesktop = !this.menuInactiveDesktop;
            if (this.menuInactiveDesktop) {
                this.menuActiveMobile = false;
            }
        } else {
            this.menuActiveMobile = !this.menuActiveMobile;
            if (this.menuActiveMobile) {
                this.menuInactiveDesktop = false;
            }
        }

        if (this.topMenuActive) {
            this.hideTopMenu();
        }

        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;

        if (this.topMenuActive) {
            this.hideTopMenu();
        } else {
            this.topMenuActive = true;
        }

        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 500);
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
    fechar(){
        sessionStorage.clear()
        this.router.navigate(['/login']);  //precisa melhorar a permissões no menu
    }
    senhapad=false
    novasenha
    novasenhaconfirm
    showsenhapad(){
        this.senhapad=true
    }
    alterarsenha(){
      
      if(this.novasenha === this.novasenhaconfirm){
        var id
        this.authService.usuario(sessionStorage.getItem('email'))
        .subscribe(res=>{//console.log(res)
        this.authService.senhaUpdate(res['iduser'] , this.novasenha)
        .subscribe(
          response => {
            if(response === null){
              this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Senha alterada corretamente!!!', life: 5000});
              this.senhapad = false;
            }
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
    //=========================================================================================
    showDialogMaximized(dialog){
      setTimeout(() => {
        dialog.maximize();
      }, 10);
    }
}
