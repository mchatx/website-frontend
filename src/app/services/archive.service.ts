import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private httpclient: HttpClient) { }

  //------------------------------------------- ARCHIVE GET PAGE HANDLER -------------------------------------------
  FetchArchive(
    btoken: string,
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/FetchRaw/', {
    //return (this.httpclient.post('http://127.1.0.1:33333/FetchRaw/', {
      BToken: btoken
    }, { headers, observe: 'response', responseType: 'text' }));
  }
  //=========================================== ARCHIVE GET PAGE HANDLER ===========================================



  //------------------------------------------- ARCHIVE EDIT HANDLER -------------------------------------------
  AddArchive(
    room: string,
    token: string,
    nick: string | undefined,
    link: string,
    hidden: boolean,
    extshare: boolean,
    tags: string | undefined,
    pass: boolean,
    passstr: string,
    streamlink: string | undefined,
    entries: any
  ): Observable<any> {

    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'Add',
      Room: room,
      Token: token,
      Nick: nick,
      Link: link,
      Hidden: hidden,
      ExtShare: extshare,
      Pass: pass,
      PassStr: passstr,
      Tags: tags,
      StreamLink: streamlink,
      Entries: entries
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  UpdateArchive(
    room: string,
    token: string,
    link: string | undefined,
    entries: any
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'Update',
      Room: room,
      Token: token,
      Link: link,
      Entries: entries
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  EditArchive(
    room: string,
    token: string,
    link: string | undefined,
    nick: string | undefined,
    hidden: boolean,
    extshare: boolean,
    tags: string | undefined,
    pass: boolean,
    passstr: string,
    streamlink: string | undefined
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    if (!link){
      link = "";
    }
    if (!nick){
      nick = "";
    }
    if (!tags){
      tags = "";
    }
    if (!streamlink){
      streamlink = "";
    }

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'Edit',
      Room: room,
      Token: token,
      Link: link,
      Nick: nick,
      Hidden: hidden,
      ExtShare: extshare,
      Pass: pass,
      PassStr: passstr,
      Tags: tags,
      StreamLink: streamlink,
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  DeleteArchive(
    room: string,
    token: string,
    link: string | undefined
  ): Observable<any> {

    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'Delete',
      Room: room,
      Token: token,
      Link: link
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  GetAllArchive(
    room: string,
    token: string
  ): Observable<any> {

    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'GetArchive',
      Room: room,
      Token: token
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  GetOneArchive(
    room: string,
    token: string,
    link: string | undefined
  ): Observable<any> {

    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Archive/', {
      /* return (this.httpclient.post('http://127.1.0.1:33333/Archive/', { */
      Act: 'GetOne',
      Room: room,
      Token: token,
      Link: link
    }, { headers, observe: 'response', responseType: 'text' }));
  }

  //=========================================== ARCHIVE EDIT HANDLER ===========================================

}
