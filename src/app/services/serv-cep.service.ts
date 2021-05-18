import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServCepService {
  constructor(private http: HttpClient){}
  getCEP(cep): Observable<any[]>{
    cep = cep.replaceAll("\.","").replaceAll("-","")
    return this.http.get(`//viacep.com.br/ws/${cep}/json`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
