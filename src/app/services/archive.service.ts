import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaggedTemplateExpr } from '@angular/compiler';

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

  //------------------------------------------- ARCHIVE EDIT HANDLER -------------------------------------------

  GetToken(room:string, pass: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Login/', { 
      Room: room, 
      Pass: pass
    }, { headers, observe: 'response'}));
  }

  AddArchive(
        room:string, 
        token: string, 
        nick: string,
        hidden: boolean,
        extshare: boolean,
        tags: string,
        pass: boolean,
        passstr: string,
        streamlink: string,
        entries: any
      ): Observable<any> {
    
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'Add',
      Room: room, 
      Token: token,
      Nick: nick,
      Hidden: hidden,
      ExtShare: extshare,
      Pass: pass,
      PassStr: passstr,
      Tags: tags,
      StreamLink: streamlink,
      Entries: entries
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  UpdateArchive(
        room:string,
        token: string,
        link: string,
        entries: any
      ): Observable<any> {
    const headers = {'Content-Type': 'application/json'};
  
    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'Update',
      Room: room, 
      Token: token,
      Link: link,
      Entries: entries
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  EditArchive(
      room:string, 
      token: string, 
      nick: string,
      hidden: boolean,
      extshare: boolean,
      tags: string,
      pass: boolean,
      passstr: string,
      streamlink: string
    ): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'Edit',
      Room: room, 
      Token: token,
      Nick: nick,
      Hidden: hidden,
      ExtShare: extshare,
      Pass: pass,
      PassStr: passstr,
      Tags: tags,
      StreamLink: streamlink,
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  DeleteArchive(
      room: string,
      token: string,
      link:string
    ): Observable<any> {
    
      const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'Delete',
      Room: room, 
      Token: token,
      Link: link
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  GetAllArchive(
      room: string,
      token: string
    ): Observable<any> {
  
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'GetArchive',
      Room: room, 
      Token: token
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  GetOneArchive(
      room: string,
      token: string,
      link:string
    ): Observable<any> {
    
      const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://localhost:33333/Archive/', { 
      Act: 'GetOne',
      Room: room, 
      Token: token,
      Link: link
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  //=========================================== ARCHIVE EDIT HANDLER ===========================================

}
