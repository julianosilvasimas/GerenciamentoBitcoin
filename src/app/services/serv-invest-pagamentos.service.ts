import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServInvestPagamentosService {

  constructor(private http: HttpClient){}
  httpOptions(){
    return {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}
  }


  aprovacao(id,aprovacao,justificativa,comprovante): Observable<any[]>{
    const formData = new FormData();
    formData.append('id',id);
    formData.append('aprovacao',aprovacao);
    formData.append('justificativa',justificativa);
    formData.append('comprovante',comprovante);
    return this.http.post(`${API_CONFIG}/pagamentos/realizarPagamento/${localStorage.getItem('token')}`,formData,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  aprovacao2(id,aprovacao,justificativa): Observable<any[]>{
    const formData = new FormData();
    formData.append('id',id);
    formData.append('aprovacao',aprovacao);
    formData.append('justificativa',justificativa);
    return this.http.post(`${API_CONFIG}/pagamentos/realizarPagamento2/${localStorage.getItem('token')}`,formData,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }


}
