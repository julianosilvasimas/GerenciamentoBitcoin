import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServUsuariosService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getUsers(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getUserByEmail(email): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios/email/${email}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  insertUser(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/usuarios`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  putUser(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/usuarios/pu2/${user.id}`,user) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteUser(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/usuarios/${user.id}`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
