import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServClientesService {

  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}

  getTipoDeComunhaoDeBens(){
    return[
      { label: "Comunhão Parcial", value: "comunhao parcial"},
      { label: "Comunhão Universal", value: "comunhao universal"},
      { label: "Separação Total", value: "separacao total"},
      { label: "Separação Obrigatória", value: "separacao obrigatoria"},
      { label: "Participação final nos aquestos", value: "Participação final nos aquestos"},
    ]
  }
  getTiposEstadosCivil(){
    return[
      { label: "Solteiro(a)", value: "solteiro"},
      { label: "Casado(a)", value: "casado"}
    ]
  }
  getComoSoube(){
    return[
      { label: "Amigo", value: "amigo"},
      { label: "Consultor", value: "consultor"},
      { label: "Facebook", value: "facebook"},
      { label: "Instagram", value: "instagram"},
      { label: "Twitter", value: "twitter"},
      { label: "Linkedin", value: "linkedin"},
      { label: "WhatsApp", value: "whatsapp"},
    ]
  }

  
  preenchAutomatico(id): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/clientes/preenchimentoAutomatico/${id.replaceAll("\.","").replaceAll("-","")}/${localStorage.getItem('token')}`,this.httpOptions)
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  
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
