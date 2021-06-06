import { Component, Input, OnInit } from '@angular/core';
import {get} from 'lodash';
import { MessageService } from 'primeng/api';
import { ServInvestPagamentosService } from 'src/app/services/serv-invest-pagamentos.service';
import { AdministFinanceiroComponent } from '../administ-financeiro.component';

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

  
  constructor(
    private serv :ServInvestPagamentosService,
    private serv2:AdministFinanceiroComponent,
    private messageService: MessageService,) { }

  _ = get;
  cols=[
    { label: "Id",  cxlabel:true ,value: 'id',width: "100px" },
    { label: "Invest.",  cxlabel:true ,value: 'contrato.id',width: "110px" },
    { label: "Data",  cxlabel:true ,value: 'dataPagamento', width: "120px"  },
    { label: "Recebedor",  cxlabel:true ,value: 'recebedor' },
    { label: "Nome",  cxlabel:true ,value: 'nomeRecebedor' },
    { label: "Banco",  cxlabel:true ,value: 'conta.banco.banco' },
    { label: "Valor",  cxlabel:true ,value: 'valor', number: true },
    { label: "Pagamento",  cxlabel:false , aprov: true, value: 'status' , width: "130px" },
    { label: "Prazo",  cxlabel:false , aprov: false, prazo: true, value: 'dataPagamento' , width: "130px" },
    { label: "",      cxlabel:false ,value: 'botao', width: "90px" },
  ]

  width="50%"
  height=""
  recarregaTamanho(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    this.height=(y-50)+"px"
    if(x<1000){
      this.height=(y-250)+"px"
      this.cols=[
        { label: "Recebedor",  cxlabel:true ,value: 'recebedor' },
        { label: "Valor",  cxlabel:true ,value: 'valor', number: true },
        { label: "Pagamento",  cxlabel:false , aprov: true, value: 'status' , width: "90px" },
        { label: "Prazo",  cxlabel:false , aprov: false, prazo: true, value: 'dataPagamento' , width: "90px" },
      ]
      this.width="100%"
    }
  }

  ngOnInit(): void {
    this.recarregaTamanho()
    console.log(this.listaPagamentosPendentes)
  }

  noPrazo(data){
    var i = 1
    var dataNova = this.formatContrario(data)
    if(data.indexOf(this.format(new Date()))>-1){
      i=2
    }else if(dataNova<this.formatContrario(this.format(new Date()))){
      i=3
    }else{
      i=1
    }
    return i
  }
  format(data:Date){
    var  dia  = (data.getDate()).toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  formatContrario(data){
    var diaF = data.substring(0,2)
    var mesF = data.substring(3,5)
    var anoF = data.substring(6,10)
    return new Date(anoF,mesF,diaF);
  }

  pagando=false
  imgcomprovante=[]
  pagamento
  realizarPagamento(pagamento){
    this.img=null
    this.imgcomprovante=[]
    this.pagamento=pagamento
    this.pagando=true
  }
  converter(e){
    var value = 0
    var decimals = 0
    var sufix = ' '
    return ' R$ '+e.toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals})+sufix
  }
  img
  onUpload(evnt){
    var file = evnt.files
    if(file.length>0){
      this.img=file[0]
    }
  }

  aprovar(){
    if(this.checarCampos(1)){
      this.pagando=false
      this.serv.aprovacao(this.pagamento.id,"pago",this.pagamento.observacao,this.img).subscribe(
        resp=>{
          this.return(1)
        },erro=>{
          this.return(2)
        }
      )
    }
  }
  reprovar(){
    if(this.checarCampos(2)){
      this.pagando=false
      this.serv.aprovacao2(this.pagamento.id,"erro",this.pagamento.observacao).subscribe(
        resp=>{
          this.return(1)
        },erro=>{
          this.return(2)
        }
      )
    }
  }
  checarCampos(id){
    var chack =false

    if(id==1){
      if(this.img==null){
        this.messageService.add({severity:'warn', summary: 'Anexo', detail:'Favor anexar o comprovante de transferência', life: 5000});
      }else{
        chack=true
      }
    }else{
      if(this.pagamento.observacao==null || this.pagamento.observacao.length==0){
        this.messageService.add({severity:'warn', summary: 'Observação', detail:'Favor digitar alguma observação caso queira reprovar o pagamento', life: 5000});
      }else{
        chack=true
      }
    }
    return chack
  }
  return(stat){
    if(stat==1){
      this.messageService.add({severity:'success', summary: 'Sucesso!', detail:'Salvo com sucesso', life: 5000});
    }else{
      this.messageService.add({severity:'error', summary: 'Erro!', detail:'Erro ao salvar', life: 5000});
    }
    this.serv2.carregado=false
    this.serv2.carregarInvestimentos()
  }
}
