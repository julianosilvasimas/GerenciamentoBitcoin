import { Injectable } from '@angular/core';

import {API_CONFIG} from '../../app.api'


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';


@Injectable()
export class UserServiceService {

  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

    constructor(private http: HttpClient){}
  
    selecionarusuario(user): Observable<any>{
      return  this.http.get(`${API_CONFIG}/usuarios/${user.usuarioId}`,this.httpOptions) 
      .pipe(map((res : any) => res, catchError(ErrorHandler.handleError)))
   }
  
   //LISTAS
    listusers(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/usuarios`,this.httpOptions) 
       .pipe(map((res:any[]) => res, catchError(ErrorHandler.handleError)))
    }
    listusers2(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/usuarios/page2`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    listgerencias(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/gerencias`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    listsupervisoes(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/supervisoes`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    listunidades(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/unidades`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    listpermissoes(): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/usuarios/perfis`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }


    resetSenha(user): Observable<any[]>{
       return  this.http.put(`${API_CONFIG}/usuarios/senha/${user.id}`,"",this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    updateUsers(user): Observable<any[]>{
       return  this.http.get(`${API_CONFIG}/perfis`,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
    acharimagem(user): any{
       return `${API_CONFIG}/FotosPerfis/foto/end/${user}`
    }
    updateUser(user): Observable<any[]>{
       return  this.http.put(`${API_CONFIG}/usuarios`,user,this.httpOptions) 
       .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
    }
  

    updateUser2(user): Observable<any[]>{
      return  this.http.put(`${API_CONFIG}/usuarios/user/${user.id}`,user,this.httpOptions) 
      .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
   }
   fotoAtualizar(uploadedFiles : any, usuario : string): Observable<any[]>{
     const formData = new FormData();
     formData.append('foto',uploadedFiles);
     formData.append('Usuario',usuario);
     console.log(formData);
     
 
      return  this.http.post(`${API_CONFIG}/usuarios/atualizarFoto`,formData,this.httpOptions) 
      .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
   }
  }