import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServContasService {

  constructor(private http: HttpClient){}
  httpOptions(){
    return {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}
  }

  getTiposDeConta(){
    return [
      {label:"Conta Corrente", value: 0},
      {label:"Conta Poupança", value: 1},
    ]
  }

  
  getcontasbancarias(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/contasbancarias/contrato/${id}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putcontasbancarias(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/contasbancarias/${user.id}`,user,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postcontasbancarias(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/contasbancarias`,user,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deletecontasbancarias(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/contasbancarias/${user.id}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
