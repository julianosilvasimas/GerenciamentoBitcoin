import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
   } from '@angular/common/http';
import { Observable} from 'rxjs';


export class ErrorHandler {
  static handleError(error: Response | any){
    let errorMessage: string
    if (error instanceof Response){
      const body = error.json() || ''
      const err = body.toString || JSON.stringify(body)
      errorMessage = `${error.url}: ${error.status} - ${error.statusText || ''} ${err}`
    }else{
      errorMessage = error.message ? error.message : error.toString()
    }
    console.log(errorMessage)
    return Observable.throw(errorMessage)
  }
}