import { Component, Input, OnInit } from '@angular/core';
import {get} from 'lodash';
import { MessageService } from 'primeng/api';
import { ServInvestAportesService } from 'src/app/services/serv-invest-aportes.service';

@Component({
  selector: 'app-cad-aportes',
  templateUrl: './cad-aportes.component.html',
  styleUrls: ['./cad-aportes.component.scss']
})
export class CadAportesComponent implements OnInit {

  constructor(
    private serv:ServInvestAportesService,
    private messageService: MessageService,) { }

  _ = get;
  @Input() investimentos
  cols=[
    { label: "Identificador",  cxlabel:true ,value: 'id' },
    { label: "Data",  cxlabel:true ,value: 'dataporte' },
    { label: "Valor",  cxlabel:true ,value: 'valoraporte', number: true },
    { label: "Secretaria",  cxlabel:true ,value: 'aprovadorSecretaria.nome' },
    { label: "Observação",  cxlabel:true ,value: 'observacaoSecretaria' },
    { label: "Aprv. Secretaria",  cxlabel:false , tick: true, value: 'statusSecretaria'  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
    { label: "",      cxlabel:false ,value: 'botao2', width: "90px" },
  ]

  novoAporte=false
  aporteExistente=false

  aportes=[]
  ngOnInit(): void {
    console.clear()
    this.aportes=this.investimentos.aportes
    console.log(this.aportes)
  }

  newObj={}
  imgObj=[]
  FunctionNovoAporte(aporte,id){
    if(id==1){
      this.newObj = {
        id: null,
        dataLancamento: null,
        dataporte: new Date(),
        imgcomprovante: [],
        dataAprovacaoSecretaria: null,
        statusSecretaria: 2,
        observacaoSecretaria: null,
        valoraporte: 10000,
      }
    }else{
      this.newObj=aporte
    }
    this.novoAporte=true
  }
  onUpload(evnt){
    var file = evnt.files
    if(file.length>0){
      this.imgObj=[file[0]]
    }
  }
  aporte
  verAporte(ev){
    this.aporte=ev
    this.aporteExistente=true
  }
  salvar(){
    if(this.imgObj.length==0){
      this.messageService.add({severity:'warn', summary: 'Lance o Recibo', detail:'favor anexar o recibo', life: 5000});
    }else{
      this.novoAporte=false
      this.serv.postInvestimentosAnexos(this.imgObj[0],this.newObj['valoraporte'],this.investimentos.id).subscribe(
        resp=>{
          this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso, reinicie a tela para poder visualizar', life: 50000});
        },erro=>{
          this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
        }
      )
    }
  }
  apagarAporte(aporte){
    this.novoAporte=false
    this.serv.apagarAporte(aporte).subscribe(
      resp=>{
        this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso, reinicie a tela para poder visualizar', life: 50000});
      },erro=>{
        this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
      }
    )
  }
}
