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

  getEscritorios(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios/escritorios`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  
  getUsers(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getUser(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios/${id}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  insertUser(user): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/usuarios`,user,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  putUser(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/usuarios/${user.id}`,user,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  deleteUser(user): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/usuarios/${user.id}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getUserByEmail(email): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/usuarios/email/${email}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getUserByEmailToken(email,token): Observable<any[]>{
    var httpOptions = {headers: new HttpHeaders().set('Authorization',token)}
    return this.http.get(`${API_CONFIG}/usuarios/email/${email}`,httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }



  attSenha(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/usuarios/attsenha/${user.id}`,user,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  resetSenha(user): Observable<any[]>{
    return this.http.put(`${API_CONFIG}/usuarios/resetSenha/${user}`,user,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  atualizarFoto(id,foto): Observable<any[]>{
    const formData = new FormData();
    formData.append('file',foto);
    return this.http.post(`${API_CONFIG}/usuarios/picture/${id}`,formData,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
