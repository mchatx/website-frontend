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

    //return (this.httpclient.post('https://repo.mchatx.org/Login/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Login/', {
      Room: room, 
      Pass: pass
    }, { headers, observe: 'response'}));
  }

  GetTokenPublic(room:string, pass: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Login/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Login/', {
      Room: room, 
      Pass: pass,
      Public: true
    }, { headers, observe: 'response'}));
  }

  PostSignUp(Data: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'SignUp', 
      Token: Data
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  PostVerivy(token: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'Verivy', 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  PostResetPass(token: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'ResetPass', 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  GetAccountData(token:string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'Get', 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  PostDeleteAccount(token:string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'Delete', 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  PostChangePass(token:string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Account/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Account/', {
      Act: 'ChangePass', 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  // RETURN OK WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  CheckToken(room:string, token: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    //return (this.httpclient.post('https://repo.mchatx.org/Login/', { 
    return (this.httpclient.post('http://127.1.0.1:33333/Login/', {
      Room: room, 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

}
