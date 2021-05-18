import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServClientesService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getClientes(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/clientes`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putClientes(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/clientes/${user.id}`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postClientes(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/clientes`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteClientes(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/clientes/${user.id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
