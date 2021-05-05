import {Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import * as jwt_decode from "jwt-decode";

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

    model: any[]=[];


    constructor(public app: AppMainComponent) {
        
    }
    
    i=0

    ngOnInit() {
        
        this.model=[];
        
        this.model.push( {label: 'Dashboards', icon: 'pi pi-chart-bar', routerLink:'/'});
        this.model.push( { label: 'Carteira de Clientes', icon: 'pi pi-money-bill', routerLink:'/carteira'},);
        this.model.push( { label: 'Usuários', icon: 'pi pi-user', routerLink:'/users'},);
    }
}
