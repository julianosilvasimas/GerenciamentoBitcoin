import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro-usuarios',
  templateUrl: './cadastro-usuarios.component.html',
  styleUrls: ['./cadastro-usuarios.component.scss']
})
export class CadastroUsuariosComponent implements OnInit {

  constructor() { }

  contratos=[
    {
      id:1, 
      descricao: "Contrato 1", 
      cliente: "Wesley Safadão",
      valor: 10000
    },
    {
      id:2, 
      descricao: "Contrato 2", 
      cliente: "Anitta",
      valor: 10000
    }
  ]

  products=[]

  ngOnInit(): void {
    this.products = [
      {
        id:1,
        descricao: "Contrato 1",
        pagamentoCorrente: true,
        valor: 10000,
        parcelasPagas: 1,
        totalParcelas: 24,
      },
      {
        id:2,
        descricao: "Contrato 1",
        pagamentoCorrente: true,
        valor: 10000,
        parcelasPagas: 2,
        totalParcelas: 24,
      },
      {
        id:3,
        descricao: "Contrato 1",
        pagamentoCorrente: false,
        dataVenc: "2020",
        valor: 10000,
        parcelasPagas: 3,
        totalParcelas: 24,
      },
      {
        id:4,
        descricao: "Contrato 1",
        pagamentoCorrente: false,
        valor: 10000,
        parcelasPagas: 4,
        totalParcelas: 24,
      },
    ]
  }

}
