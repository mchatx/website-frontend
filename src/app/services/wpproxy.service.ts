import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WPproxyService {

  constructor(private httpclient: HttpClient) { }

  ListenToRoom(Btoken: string): EventSource{
    return (new EventSource(environment.DBConn + '/FetchRaw/?BToken=' + Btoken));
  }

  getRoom(): Observable<any>  {
    return (this.httpclient.get(environment.DBConn + '/Room/'));
  }

  getArchive(btoken: string):Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post(environment.DBConn + '/FetchRaw/', { 
      BToken: btoken
    }, { headers, observe: 'response', responseType: 'text'}));
  }
}
