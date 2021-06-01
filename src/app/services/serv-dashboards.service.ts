import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServDashboardsService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}

  
  getDash(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/consultor/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  getDashSecretaria(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/secretaria/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  
  getMaioresClientes(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/clientes/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
