import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServContatosService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getcontatos(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/contatos/investimento/${id}`,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putcontatos(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/contatos/${user.id}`,user,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postcontatos(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/contatos`,user,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deletecontatos(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/contatos/${user.id}`,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
