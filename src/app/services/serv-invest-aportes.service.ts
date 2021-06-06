import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServInvestAportesService {

  constructor(private http: HttpClient){}
  httpOptions(){
    return {headers: new HttpHeaders().set('Authorization',localStorage.getItem('token'))}
  }

  
  postInvestimentosAnexos(doc,  valor,idInvestimento): Observable<any[]>{
    const formData = new FormData();
    formData.append('valor',valor);
    formData.append('idInvestimento',idInvestimento);
    formData.append('comprovante',doc);
    return this.http.post(`${API_CONFIG}/aportes`,formData,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  apagarAporte(aporte): Observable<any[]>{
    return this.http.delete(`${API_CONFIG}/aportes/${aporte.id}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  getAportesBySecretaria(): Observable<any[]>{
    return this.http.get(`${API_CONFIG}/aportes/secretaria/${localStorage.getItem('token')}`,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
  postInvestimentosAprovacao(invest): Observable<any[]>{
    return this.http.post(`${API_CONFIG}/aportes/statusSecretaria/${localStorage.getItem('token')}`,invest,this.httpOptions())
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
