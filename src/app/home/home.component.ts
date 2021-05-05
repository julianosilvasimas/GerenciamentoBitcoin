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

    chartData: any;

    events: any[];

    selectedCity: any;

    items: MenuItem[];

    fullcalendarOptions: any;

    nome:String;

    constructor(private eventService: EventService) {
        document.body.style.background  = '#ebebeb8f';
     }

    
    ngOnInit() {
        document.body.style.zoom = "100%";
        

    }

}
