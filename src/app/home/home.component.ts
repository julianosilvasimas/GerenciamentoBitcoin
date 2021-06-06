import { Component, OnInit} from '@angular/core';
import {EventService} from '../demo/service/eventservice';
import * as jwt_decode from "jwt-decode";
import { MenuItem } from 'primeng/api';
import { ServUsuariosService } from '../services/serv-usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    permissao

    // cities: SelectItem[];

    // cars: Car[];

    cols: any[];

    // selectedCar: Car;
    localStorage=localStorage

    chartData: any;

    events: any[];

    selectedCity: any;

    items: any[]=[];
    activeItem={id:0}

    fullcalendarOptions: any;

    nome:String;

    constructor(private eventService: EventService,
      private adminserv: ServUsuariosService) {
        document.body.style.background  = '#ebebeb8f';
     }

    cargo=false
    ngOnInit() {
      console.clear()
      document.body.style.zoom = "100%";
      this.adminserv.getMeuCargo().subscribe(
        cred=>{
            var resp = cred.email

          var modules = [
            { id: 1, label: 'Home',       icon: 'pi pi-fw pi-home', command: (event) => { 
                this.activeItem= event.item 
              }
            },
            { id: 2, label: 'Consultor',  icon: 'pi pi-fw pi-user', command: (event) => { 
                this.activeItem= event.item 
              }
            },
            { id: 3, label: 'Secretaria', icon: 'pi pi-fw pi-pencil', command: (event) => { 
                this.activeItem= event.item 
              }
            },
            { id: 4, label: 'Financeiro', icon: 'pi pi-fw pi-dollar', command: (event) => { 
                this.activeItem= event.item 
              }
            },
          ] 



          if(resp.indexOf('Gerente')>-1){
            this.cargo=true
            this.items = modules;
            this.activeItem = this.items[0];

              
          }else if(resp.indexOf('Consultor')>-1){
            this.items=[modules[1]]
            this.activeItem={id:2}

          }else if(resp.indexOf('Secretaria')>-1){
            this.items=[modules[2]]
            this.activeItem={id:3}

          }else if(resp.indexOf('Financeiro')>-1){
            this.items=[modules[3]]
            this.activeItem={id:4}
          }


          //ApagarDepois
            // this.activeItem={id:4}


        }
      )
    }
}
