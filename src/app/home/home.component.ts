import { Component, OnInit} from '@angular/core';
import {EventService} from '../demo/service/eventservice';
import * as jwt_decode from "jwt-decode";
import { MenuItem } from 'primeng/api';

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

    constructor(private eventService: EventService) {
        document.body.style.background  = '#ebebeb8f';
     }

    
    ngOnInit() {
        document.body.style.zoom = "100%";
        if(localStorage.getItem('cargo').indexOf('Gerente')>-1){
            this.items = [
                { id: 1, label: 'Home',       icon: 'pi pi-fw pi-home', command: (event) => { 
                    this.activeItem= event.item 
                  }
                },
                { id: 2, label: 'Consultor',  icon: 'pi pi-fw pi-calendar', command: (event) => { 
                    this.activeItem= event.item 
                  }
                },
                { id: 3, label: 'Secretaria', icon: 'pi pi-fw pi-calendar', command: (event) => { 
                    this.activeItem= event.item 
                  }
                },
            ];
            this.activeItem = this.items[2];
        }else if(localStorage.getItem('cargo').indexOf('Consultor')>-1){
            this.items=[]
            this.activeItem={id:2}
        }else if(localStorage.getItem('cargo').indexOf('Secretaria')>-1){
            this.items=[]
            this.activeItem={id:3}
        }
        

    }

}
