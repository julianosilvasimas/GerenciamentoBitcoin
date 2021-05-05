import{Injectable} from '@angular/core'


import {API_CONFIG} from '../app.api'


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from 'src/app/app.error-handler';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class LogservService {

  constructor(private http: HttpClient){}

  httpOptions = {headers: new HttpHeaders().set('Authorization',sessionStorage.getItem('token'))}

  getDecodedAccessToken(): any {
    try{
        return JSON.parse(jwt_decode(sessionStorage.getItem('token')).iss);
    }
        catch(Error){
        return null;
    }
  } 
  salvarlog(modulo, tipo){
    this.getIp(modulo, tipo)
  }
  getIp(modulo, tipo){
    var modulo2 = modulo
    var tipo2 = tipo
    this.http.get("http://api.ipify.org/?format=json").subscribe(
      res=>{
        this.montarObj(res,modulo2,tipo2)
      },erro=>{
        this.montarObj(null,modulo2,tipo2)
      }


    )
  }
  montarObj(ip, modulo, tipo){
    var email = this.getDecodedAccessToken().email
    var hora = this.dataAtualFormatada(new Date())
    var obj = {
      email: email,
      modulo: modulo,
      tipo: tipo,
      local: ip.ip,
      horario: hora
    }
    this.http.post(`${API_CONFIG}/LOGUser`,obj,this.httpOptions).pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError))).subscribe()
  }
  

  dataAtualFormatada(data:Date){
    var dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear(),
        hora  = (data.getHours()).toString(),
        horaF = (hora.length == 1) ? '0'+hora : hora, //+1 pois no getMonth Janeiro começa com zero.
        min  = (data.getMinutes()).toString(),
        minF = (min.length == 1) ? '0'+min : min //+1 pois no getMonth Janeiro começa com zero.
    return anoF+"-"+mesF+"-"+diaF+" "+horaF+":"+minF;
  }
}
