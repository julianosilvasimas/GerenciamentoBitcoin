import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServInvestimentosService {

  constructor(private http: HttpClient){}
  httpOptions(){
    return {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}
  }

  getTipoDeInvestimentos(){
    return [
      { label: "Investimento Inicial",  cxlabel:true ,value: 'inicial' },
      { label: "Carta Fiança",          cxlabel:true ,value: 'fianca' },
      { label: "Reinvestimento",        cxlabel:true ,value: 'reinvestimento' },
    ]
  }
  getPrazosDeInvestimentos(){
    return [
      { label: "24 Meses", value: 24 },
      { label: "36 Meses", value: 36 },
    ]
  }
  
  getInvestimentos(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getInvestimentosByConsultor(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/consultor/${localStorage.getItem('token')}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getInvestimentosPagamentosByConsultor(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/consultor/pagamentos/${localStorage.getItem('token')}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getInvestimentosBySecretaria(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/secretaria/${localStorage.getItem('token')}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }


  getInvestimentosId(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/${id}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putInvestimentos(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/investimentos/${user.id}`,user,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentos(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/investimentos`,user,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentosByConsult(invest): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/investimentos/novoInvestimento/${localStorage.getItem('token')}`,invest,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentosAprovacao(invest): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/investimentos/statusSecretaria/${localStorage.getItem('token')}`,invest,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentosAnexos(invest,doc, idx): Observable<any[]>{
    const formData = new FormData();
    formData.append('id',invest.id);
    formData.append('cpf',invest.cliente.cpf);
    formData.append('indx',idx);
    formData.append('doc',doc);
    return this.http.post(`${API_CONFIG}/investimentos/novoInvestimento/anexos`,formData,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteInvestimentos(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/investimentos/${user.id}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
