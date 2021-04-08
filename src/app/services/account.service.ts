import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpclient: HttpClient) { }

  PushRoomApplication(nick:string, pass:string, note:string, contact:string):Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('https://repo.mchatx.org/Room/', { 
      Nick: nick, 
      Pass: pass, 
      Note: note, 
      Contact: contact
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  // RETURN TOKEN WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  GetToken(room:string, pass: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('https://repo.mchatx.org/Login/', { 
    //return (this.httpclient.post('http://127.1.0.1:33333/Login/', {
      Room: room, 
      Pass: pass
    }, { headers, observe: 'response'}));
  }

  // RETURN OK WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  CheckToken(room:string, token: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('https://repo.mchatx.org/Login/', { 
    //return (this.httpclient.post('http://127.1.0.1:33333/Login/', {
      Room: room, 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

}
