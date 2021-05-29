import { Component, OnInit } from '@angular/core';
import { ServInvestimentosService } from '../services/serv-contratos.service';

@Component({
  selector: 'app-administ-secretaria',
  templateUrl: './administ-secretaria.component.html',
  styleUrls: ['./administ-secretaria.component.scss']
})
export class AdministSecretariaComponent implements OnInit {

  constructor(private serv:ServInvestimentosService) { }

  ngOnInit(): void {
    console.clear()
    this.serv.getInvestimentosBySecretaria().subscribe(
      resp=>{
        console.log(resp)
      }
    )
  }

}
