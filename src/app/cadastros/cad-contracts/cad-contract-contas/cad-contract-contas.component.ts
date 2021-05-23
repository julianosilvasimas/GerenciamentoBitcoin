import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {get} from 'lodash';
import { ServBancosService } from 'src/app/services/serv-bancos.service';
import { ServContasService } from 'src/app/services/serv-contas.service';

@Component({
  selector: 'app-cad-contract-contas',
  templateUrl: './cad-contract-contas.component.html',
  styleUrls: ['./cad-contract-contas.component.scss']
})
export class CadContractContasComponent implements OnInit {

  constructor(private serv: ServContasService, private serv2:ServBancosService,
    private messageService: MessageService,) { }
  @Input() cliente

  _ = get;
  bancos=[]
  contasBancarias=[]
  carregado=false

  colsContas=[
    { label: "Banco",  cxlabel:true ,value: 'banco.banco' },
    { label: "Agencia",  cxlabel:true ,value: 'agencia' },
    { label: "Titular",  cxlabel:true ,value: 'titular' },
    { label: "Conta",  cxlabel:true ,value: 'conta' },
    { label: "Doc.",  cxlabel:true ,value: 'docTitular' },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  ngOnInit(): void {
    this.serv2.getBancos().subscribe(resp=>{
      this.bancos=resp
      // console.log(resp)
      this.contasBancarias = this.cliente.contasBancarias
      this.carregado=true
    })
  }
  recarregarContas(){
    this.contasBancarias=[]
    this.carregado=false
    setTimeout(() => {
      this.serv.getcontasbancarias(this.cliente.id).subscribe(
        resp=>{
          this.contasBancarias=resp
          this.carregado=true
        }
      )
    }, 500);
  }

  tiposDeConta=[
    {label:"Conta Corrente", value: 0},
    {label:"Conta Poupança", value: 1},
  ]

  editarNovaConta=false
  newObj={}
  novo(){
    this.newObj={
      titular: null,
      docTitular: null,
      banco: {},
      agencia:null,
      conta: null,
      contaConjunta: true,
      tpo: 0,
      cod: null,
      id: 0,
      contrato: { id: this.cliente['id'] }
    }
    this.editarNovaConta=true
  }
  salvarNovaConta(){
    this.serv.postcontasbancarias(this.newObj).subscribe(
      resp=>{
        this.editarNovaConta=false
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
        this.recarregarContas()
      },erro=>{
        this.editarNovaConta=false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
      }
    )
    console.log(this.newObj)
  }
  Cancelar(){
    this.editarNovaConta=false
  }
  delete(conta){
    this.serv.deletecontasbancarias(conta).subscribe(
      resp=>{
        this.editarNovaConta=false
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Deletado com sucesso', life: 5000});
        this.recarregarContas()
      },erro=>{
        this.editarNovaConta=false
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao deletar', life: 5000});
      }
    )

  }

}
