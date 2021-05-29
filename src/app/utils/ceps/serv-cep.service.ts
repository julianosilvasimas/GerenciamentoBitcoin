import { Injectable } from '@angular/core';

import {API_CONFIG} from '../../app.api'

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
  
  getUFs(){
    return [
      { label: "Rondônia RO	          ", value: "RO"},
      { label: "Acre AC	              ", value: "AC"},
      { label: "Amazonas AM	          ", value: "AM"},
      { label: "Roraima RR	          ", value: "RR"},
      { label: "Pará PA	              ", value: "PA"},
      { label: "Amapá AP	            ", value: "AP"},
      { label: "Tocantins TO	        ", value: "TO"},
      { label: "Maranhão MA	          ", value: "MA"},
      { label: "Piauí PI	            ", value: "PI"},
      { label: "Ceará CE	            ", value: "CE"},
      { label: "Rio Grande do Norte RN", value: "RN"},
      { label: "Paraíba PB	          ", value: "PB"},
      { label: "Pernambuco PE	        ", value: "PE"},
      { label: "Alagoas AL	          ", value: "AL"},
      { label: "Sergipe SE	          ", value: "SE"},
      { label: "Bahia BA	            ", value: "BA"},
      { label: "Minas Gerais MG	      ", value: "MG"},
      { label: "Espírito Santo ES	    ", value: "ES"},
      { label: "Rio de Janeiro RJ	    ", value: "RJ"},
      { label: "São Paulo SP	        ", value: "SP"},
      { label: "Paraná PR	            ", value: "PR"},
      { label: "Santa Catarina SC	    ", value: "SC"},
      { label: "Rio Grande do Sul RS  ", value: "RS"},
      { label: "Mato Grosso do Sul MS	", value: "MS"},
      { label: "Mato Grosso MT	      ", value: "MT"},
      { label: "Goiás GO	            ", value: "GO"},
      { label: "Distrito Federal DF	  ", value: "DF"}
    ]
  }
}
