import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServDashboardsService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getDash(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/consultor/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  getDashSecretaria(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/secretaria/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  
  getMaioresClientes(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/dashboards/clientes/${id}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
