import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServContasService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getcontasbancarias(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/contasbancarias/cliente/${id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }

  putcontasbancarias(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/contasbancarias/${user.id}`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postcontasbancarias(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/contasbancarias`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deletecontasbancarias(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/contasbancarias/${user.id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
