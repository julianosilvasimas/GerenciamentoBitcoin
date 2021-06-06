import { Component, OnInit } from '@angular/core';
import { ServInvestAportesService } from 'src/app/services/serv-invest-aportes.service';
import { ServInvestimentosService } from '../../services/serv-investimentos.service';
import { ServDashboardsService } from '../../services/serv-dashboards.service';

@Component({
  selector: 'app-administ-secretaria',
  templateUrl: './administ-secretaria.component.html',
  styleUrls: ['./administ-secretaria.component.scss']
})
export class AdministSecretariaComponent implements OnInit {

  constructor(
    private serv:ServInvestimentosService,
    private servaport:ServInvestAportesService,
    private servdash:ServDashboardsService
    ) { }
  carregado=false
  contratosPendentes=[]
  aportesPendentes=[]

  ngOnInit(): void {
    console.clear()
    this.getDashSecretaria()

  }

  totalContratos=0
  totalContratosAprovados=0
  totalContratosPendentes=0
  totalContratosErro=0

  getDashSecretaria(){
    this.carregado=false
    console.clear()
    this.servaport.getAportesBySecretaria().subscribe(
      aportesPendentes=>{
        this.serv.getInvestimentosBySecretaria().subscribe(
          contratosPendentes=>{
            this.contratosPendentes=contratosPendentes
            this.aportesPendentes=aportesPendentes
            
            this.totalContratos=0
            this.totalContratosAprovados=0
            this.totalContratosPendentes=0
            this.totalContratosErro=0
            this.servdash.getDashSecretaria().subscribe(
              resp=>{
                for(let obj of resp){
                  var o = obj[0]
                  var qtd = obj[1]

                  this.totalContratos+=qtd
                  switch(o){
                    case 1:
                      this.totalContratosAprovados+=qtd
                      break;
                    case 2:
                      this.totalContratosPendentes+=qtd
                      break;
                    case 3:
                      this.totalContratosErro+=qtd
                      break;
                  }
                }
                this.carregado=true
                // setTimeout(() => {
                //   this.getDashSecretaria()
                // },180000);
              }
            )
          }
        )
      }
    )
  }
}
