import {Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import * as jwt_decode from "jwt-decode";
import { ServUsuariosService } from './services/serv-usuarios.service';

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <ul class="layout-menu">
                <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];


    constructor(public app: AppMainComponent,
        private adminserv: ServUsuariosService) {
        
    }
    carregado=false
    ngOnInit() {
        this.model=[]
        this.adminserv.getMeuCargo().subscribe(
            cred=>{
                var cargo = cred.email
                console.log(cargo)
                if(cargo.indexOf('Gerente')>-1){
                    this.model=[
                        { label: 'Dashboards', icon: 'pi pi-chart-bar', routerLink:'/'},
                        { 
                            label: 'Administrar', icon: 'pi pi-user', 
                            items: [
                                {label: 'Usuário', icon: 'pi pi-user', routerLink:'/usuarios'},
                                {label: 'Clientes', icon: 'pi pi-money-bill', routerLink:'/clientes'},
                                {label: 'Contratos', icon: 'pi pi-money-bill', routerLink:'/contratos'},
                            ]
                        },          
                    ];
                }else if(cargo.indexOf('Consultor')>-1){
                    this.model=[
                        { label: 'Dashboards', icon: 'pi pi-chart-bar', routerLink:'/'},
                    ]

                }else if(cargo.indexOf('Secretaria')>-1){
                    this.model=[
                        { label: 'Dashboards', icon: 'pi pi-chart-bar', routerLink:'/'},
                        { 
                            label: 'Administrar', icon: 'pi pi-user', 
                            items: [
                                {label: 'Clientes', icon: 'pi pi-money-bill', routerLink:'/clientes'},
                            ]
                        },          
                    ]

                }
                this.carregado=true
            }
        )
    }
}
