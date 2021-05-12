import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpclient: HttpClient) { }

  GetArchiveData(
    bToken: string,
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/ArchiveCheck/', {
    //return (this.httpclient.post('http://localhost:33333/ArchiveCheck/', {
      BToken : bToken,
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  CommentPost(
    bToken: string,
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Comment/', {
    //return (this.httpclient.post('http://localhost:33333/Comment/', {
      BToken : bToken,
    }, { headers, observe: 'response', responseType: 'text' }));
  }
}
