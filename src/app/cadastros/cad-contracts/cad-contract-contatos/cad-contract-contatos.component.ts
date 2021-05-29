import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {get} from 'lodash';
import { ServContatosService } from 'src/app/services/serv-contatos.service';

@Component({
  selector: 'app-cad-contract-contatos',
  templateUrl: './cad-contract-contatos.component.html',
  styleUrls: ['./cad-contract-contatos.component.scss']
})
export class CadContractContatosComponent implements OnInit {

  @Input() cliente
  constructor(private serv: ServContatosService, 
    private messageService: MessageService,) { }

  cols=[
    { label: "Tipo Contato",  cxlabel:true ,value: 'tpoContato' },
    { label: "Contato",  cxlabel:true ,value: 'contato' },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]
  contatos=[]
  carregado=false

  _ = get;

  tiposDeContato=[]
  ngOnInit(): void {
    this.tiposDeContato = this.serv.getTiposContatos()
    this.recarregarContas()
    this.carregado=true
  }
  recarregarContas(){
    this.contatos=[]
    this.carregado=false
    setTimeout(() => {
      this.serv.getcontatos(this.cliente.id).subscribe(
        resp=>{
          this.contatos=resp
          this.carregado=true
        }
      )
    }, 500);
  }

  editarNovaConta=false
  newObj={}
  novo(){
    this.newObj={
      id: 0,
      tpoContato: null,
      contato: null,
      contrato: { id: this.cliente['id'] }
    }
    this.editarNovaConta=true
  }
  salvarNovaConta(){
    this.serv.postcontatos(this.newObj).subscribe(
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
    this.serv.deletecontatos(conta).subscribe(
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