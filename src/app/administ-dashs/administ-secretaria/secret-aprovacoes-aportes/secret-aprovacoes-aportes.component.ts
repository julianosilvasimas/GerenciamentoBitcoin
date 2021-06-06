import { Component, Input, OnInit } from '@angular/core';
import { ServInvestAportesService } from 'src/app/services/serv-invest-aportes.service';
import {get} from 'lodash';
import { MessageService, PrimeIcons } from 'primeng/api';
import { AdministSecretariaComponent } from '../administ-secretaria.component';

@Component({
  selector: 'app-secret-aprovacoes-aportes',
  templateUrl: './secret-aprovacoes-aportes.component.html',
  styleUrls: ['./secret-aprovacoes-aportes.component.scss']
})
export class SecretAprovacoesAportesComponent implements OnInit {

  constructor(
    private serv:ServInvestAportesService,
    private serv2:AdministSecretariaComponent,
    private messageService: MessageService,) { }


  @Input() contratos
  
  _ = get;
  cols=[
    { label: "Identificador",  cxlabel:true ,value: 'id' },
    { label: "Data",  cxlabel:true ,value: 'dataporte' },
    { label: "Valor",  cxlabel:true ,value: 'valoraporte', number: true },
    { label: "Secretaria",  cxlabel:true ,value: 'aprovadorSecretaria.nome' },
    { label: "Aprv. Secretaria",  cxlabel:false , aprov: true, value: 'statusSecretaria'  },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  ngOnInit(): void {
    console.log(this.contratos)
  }

  editarAporte=false
  carregado=false
  aporte={}

  verAporte(invest){
    this.aporte=invest
    this.preencherAprovacoes(invest)
    this.editarAporte=true
  }

  events1={}

  preencherAprovacoes(resp){
    this.events1 = [
      {status: 'Lançamento',            responsavel:''    , observacao:null,   data: resp['datLancamento'], icon: PrimeIcons.CHECK,       color: 'green'},
      {status: 'Secretaria',            responsavel:''                        , observacao:null, data: ''                   , icon: PrimeIcons.USER,        color: 'grey'},
      {status: 'Geração de Pagamentos', responsavel:''                        , observacao:null, data: ''                   , icon: PrimeIcons.MONEY_BILL,  color: 'grey'},
    ];
    
    
    var i=1 //Secretaria
    if(resp['statusSecretaria'] == 2){
      this.events1[i].icon = PrimeIcons.CLOCK
      this.events1[i].color = "orange"

    }else if(resp['statusSecretaria'] == 1){
      this.events1[i].icon = PrimeIcons.CHECK
      this.events1[i].color = "green"
      this.events1[i].responsavel = resp['aprovadorSecretaria'].nome
      this.events1[i].data        = resp['dataAprovacaoSecretaria']
    }else{
      this.events1[i].icon = PrimeIcons.TIMES
      this.events1[i].color = "red"
      this.events1[i].responsavel = resp['aprovadorSecretaria'].nome
      this.events1[i].data        = resp['dataAprovacaoSecretaria']
      this.events1[i].observacao  = resp['observacaoSecretaria']
    }

    

    
    this.carregado=true
  }

  width="50%"
  height=""

  tipoMenu=false

  recarregaTamanho(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    this.tipoMenu=false
    this.height=(y-150)+"px"
    if(x<1000){
      this.tipoMenu=true
      this.height=(y-200)+"px"
      this.cols=[
        { label: "Cliente",  cxlabel:true ,value: 'cliente.investidor' },
        { label: "Valor",  cxlabel:true ,value: 'vlrInvestimento', number: true },
        { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
      ]
      this.width="100%"
    }

  }
  aprovar(){
    if(this.aporte['dataporte']==null){
      this.messageService.add({severity:'warn', summary: 'Atenção', detail:'Você precisa ditar a data do aporte para cálculo dos pagamentos', life: 5000});

    }else{
      var obj = this.convertObj(this.aporte)
      obj.statusSecretaria=1
      this.serv.postInvestimentosAprovacao(obj).subscribe(
        resp=>{
          this.return(1)
        },erro=>{
          this.return(2)
        }
      )
    }
  }
  reprovar(){
    var obj = this.convertObj(this.aporte)
    console.log(obj)
    obj.statusSecretaria=3
    this.serv.postInvestimentosAprovacao(obj).subscribe(
      resp=>{
        this.return(1)
      },erro=>{
        this.return(2)
      }
    )
  }
  return(stat){
    if(stat==1){
      this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
    }else{
      this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
    }
    this.carregado=false
    this.editarAporte = false
    this.serv2.getDashSecretaria()
  }
  convertObj(obj){
    return {
	    id: obj.id,
	    dataAprovacaoSecretaria: obj['dataAprovacaoSecretaria'] instanceof Date && !isNaN(obj['dataAprovacaoSecretaria'].valueOf()) ? this.format(obj['dataAprovacaoSecretaria']) : obj['dataAprovacaoSecretaria'],
	    dataporte: obj['dataporte'] instanceof Date && !isNaN(obj['dataporte'].valueOf()) ? this.format(obj['dataporte']) : obj['dataporte'],
	    dataLancamento: obj['dataLancamento'] instanceof Date && !isNaN(obj['dataLancamento'].valueOf()) ? this.format(obj['dataLancamento']) : obj['dataLancamento'],
	    valoraporte: obj.valoraporte,
	    imgcomprovante: obj.imgcomprovante,
	    statusSecretaria: obj.statusSecretaria, // 1 = pago, 2 = pendente, 3 = erro
	    observacaoSecretaria: obj.observacaoSecretaria,
	    tpoContrato: obj.tpoContrato,
    }
  }
  format(data:Date){
    var  dia  = (data.getDate()).toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
}
