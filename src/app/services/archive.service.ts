import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private httpclient: HttpClient) { }

  getArchive(): Observable<any>  {
    return (this.httpclient.get('http://157.230.241.238/Archive/'));
  }

  getArchiveRoom(room:string): Observable<any>  {
    return (this.httpclient.get('http://157.230.241.238/Archive/?room=' + room));
  }

  getArchiveLink(link:string): Observable<any>  {
    return (this.httpclient.get('http://157.230.241.238/Archive/?link=' + link));
  }

  getArchiveTags(tags:string): Observable<any>  {
    return (this.httpclient.get('http://157.230.241.238/Archive/?tags=' + tags));
  }

}
