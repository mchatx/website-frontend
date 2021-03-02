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

    return (this.httpclient.post('http://157.230.241.238/Room/', { 
      Nick: nick, 
      Pass: pass, 
      Note: note, 
      Contact: contact
    }, { headers, observe: 'response', responseType: 'text'}));
  }

}
