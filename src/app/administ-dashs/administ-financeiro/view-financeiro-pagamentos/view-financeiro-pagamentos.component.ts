import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-financeiro-pagamentos',
  templateUrl: './view-financeiro-pagamentos.component.html',
  styleUrls: ['./view-financeiro-pagamentos.component.scss']
})
export class ViewFinanceiroPagamentosComponent implements OnInit {

  @Input() listaPagamentosPendentes
  @Input() pagamentosMes
  @Input() pagamentosHoje
  @Input() pagamentosAtrasados
  constructor() { }

  ngOnInit(): void {
  }

}
