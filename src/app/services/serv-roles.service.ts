import { Injectable } from '@angular/core';

import {API_CONFIG} from '../app.api'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';

@Injectable()
export class ServRolesService {
  constructor(private http: HttpClient){}
  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  
  getPerfis(): Observable<any[]>{
    console.log(this.httpOptions)
    return this.http.get(`${API_CONFIG}/perfis`) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
  }
}
