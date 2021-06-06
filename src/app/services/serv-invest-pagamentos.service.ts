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


  getPagamentos(): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/pagamentos/${localStorage.getItem('token')}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }


}
