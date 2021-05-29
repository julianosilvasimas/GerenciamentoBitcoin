import { Injectable, EventEmitter, SystemJsNgModuleLoader  } from '@angular/core';
import { Usuario } from '../login/login.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONFIG } from '../app.api';
import { map, catchError, findIndex } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";
import { ErrorHandler } from '../app.error-handler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private token: string="";
  private usuarioAutenticado: boolean = false;
  private permissao: string;
  private auth: string[] = [];

  mostrarMenuEmitter = new EventEmitter<boolean>();
  dados: any = [];

  constructor(
    private router: Router,
    private http:HttpClient
    ) { }

  private extractData(res: Response) {
    let body = res;
    return body;
  }


  //Requisições Http
  fazerLogin(usuario: Usuario): Observable<any>{
    let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        var stat

        return this.http.post<any>(`${API_CONFIG}/login`,
            {email: usuario.email, senha: usuario.senha},
            { observe: 'response'})
            .pipe(
                map((response) => ({data: response.headers, 
                                    status: response.status,
                                    statusTexto: response.statusText,
                                  }),
                                  catchError(ErrorHandler.handleError)
                                  ) 
            );
  }
  senhaUpdate(id: number, senha: string): Observable<any>{
      const headers = new HttpHeaders().set("Content-Type", "application/json")
      let bodyObj = {
                      "id": id,
                      "senha": senha
                    }
     
      return this.http.put(`${API_CONFIG}/usuarios/attsenha`,JSON.stringify(bodyObj) ,{headers: headers}) 
                      .pipe(map(this.extractData),
                      catchError(ErrorHandler.handleError))
  }
  
  senhaUpdate2(id: number, email: string ,senha: string,keys): Observable<any>{
      const headers = new HttpHeaders().set("Content-Type", "application/json").set('Authorization',keys)
      let bodyObj = {
                      "id": id,
                      "email": email,
                      "senha": senha
                    }
        console.log(headers)
      return this.http.put(`${API_CONFIG}/usuarios/attsenha`,JSON.stringify(bodyObj) ,{headers: headers}) 
                      .pipe(map(this.extractData),
                      catchError(ErrorHandler.handleError))
  }

  // Obtendo e decodificando o Token e permissoes
  getToken(token) {
    return this.token = token
  }

  getDecodedAccessToken(token): any {
    try{
      return jwt_decode(this.token);
    }
    catch(Error){
      return null;
    }
  }

  //Métodos de checagem
  checkAutenticado(status){
    if (status == 200) {
  
      this.usuarioAutenticado = true;
  
      this.mostrarMenuEmitter.emit(true);
      //console.log(this.mostrarMenuEmitter)
  
      
  
    }else {
      this.usuarioAutenticado = false;
  
      this.mostrarMenuEmitter.emit(false);
      //console.log(this.mostrarMenuEmitter)
    }
      
    return this.usuarioAutenticado;
  } 
  
  usuarioEstaAutenticado(){
    return this.usuarioAutenticado;
  }
  
  httpOptions = {headers: new HttpHeaders().set('Authorization',this.token)}

  usuario(email): Observable<any[]>{
    return  this.http.get(`${API_CONFIG}/usuarios/email/${email}`,this.httpOptions) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
 }
  usuario2(email,keys): Observable<any[]>{
    return  this.http.get(`${API_CONFIG}/usuarios/email/${email}`,{headers: new HttpHeaders().set('Authorization',keys)}) 
    .pipe(map((res : any[]) => res, catchError(ErrorHandler.handleError)))
 }


 userDados(token){
  var us = this.getDecodedAccessToken(token);


  // debugger;
  console.log(us)

  sessionStorage.setItem('token',this.token)
  sessionStorage.setItem('email',us.email)
  sessionStorage.setItem('nome',us.nome)
  // sessionStorage.setItem('permissao',us.acesso)
  // this.dados.push({ key: 'email' , valor: tokenDecode.sub, lista: [] });
  // this.dados.push({ key: 'datalogin' , valor: tokenDecode.iat, lista: [] });
  // this.dados.push({ key: 'dataexpire' , valor: tokenDecode.exp, lista: [] });
  

  var dateIni = new Date(0)
  var dateExp = new Date(0)

  // dateIni.setUTCSeconds(parseInt(this.dados[2].valor))
  // dateExp.setUTCSeconds(parseInt(this.dados[3].valor))
  

  // Verificando permissões
  


  return this.dados
  }

  permissoes(){
    var permissao1 = this.auth[0]
    sessionStorage.setItem("permissao1", permissao1)
    //console.log(permissao1)
    return permissao1
  }

  

}





