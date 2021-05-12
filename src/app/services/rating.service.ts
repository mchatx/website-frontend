import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private httpclient: HttpClient) { }

  RatingPost(
    bToken: string,
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Rating/', {
    //return (this.httpclient.post('http://localhost:33333/Rating/', {
      BToken : bToken,
    }, { headers, observe: 'response', responseType: 'text' }));
  }
}
