import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServInvestimentosService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getInvestimentos(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getInvestimentosByConsultor(email): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/consultor/${email}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  getInvestimentosId(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/investimentos/${id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putInvestimentos(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/investimentos/${user.id}`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentos(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/investimentos`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteInvestimentos(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/investimentos/${user.id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
