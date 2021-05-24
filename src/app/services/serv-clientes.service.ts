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
    return this.http.get(`${API_CONFIG}/clientes`,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  putFotoCliente(foto,id): Observable<any[]>{
    const formData = new FormData();
    formData.append('file',foto);
    return this.http.post(`${API_CONFIG}/clientes/picture/perfil/${id}`,formData,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  putDocumentoCliente(foto,id): Observable<any[]>{
    const formData = new FormData();
    formData.append('file',foto);
    return this.http.post(`${API_CONFIG}/clientes/picture/${id}`,formData,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putClientes(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/clientes/${user.cpf}`,user,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postClientes(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/clientes`,user,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteClientes(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/clientes/${user.cpf}`,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
