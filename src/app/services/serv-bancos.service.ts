import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServBancosService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getBancos(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/bancos`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putBancos(bancos): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/bancos/${bancos.id}`,bancos) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postBancos(bancos): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/bancos`,bancos) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteBancos(bancos): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/bancos/${bancos.id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
