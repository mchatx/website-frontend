import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpclient: HttpClient) { }

  LinkParser(linkstr: string): string {
    if (linkstr.length < 3){
      return("ERROR");
    }

    if (linkstr.indexOf("https://www.youtube.com/watch?v=") != -1){
        linkstr = linkstr.replace("https://www.youtube.com/watch?v=", "YT_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
    } else if (linkstr.indexOf("https://youtu.be/") != -1){
        linkstr = linkstr.replace("https://youtu.be/", "YT_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
      } else if (linkstr.indexOf("https://www.twitch.tv/videos/") != -1){
        linkstr = linkstr.replace("https://www.twitch.tv/videos/", "TW_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
    } else if (linkstr.indexOf("https://live2.nicovideo.jp/watch/") != -1){
        linkstr = linkstr.replace("https://live2.nicovideo.jp/watch/", "NL_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
    } else if (linkstr.indexOf("https://www.nicovideo.jp/watch/") != -1){
        linkstr = linkstr.replace("https://www.nicovideo.jp/watch/", "NC_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
    } else if (linkstr.indexOf("https://www.bilibili.com/video/") != -1){
        linkstr = linkstr.replace("https://www.bilibili.com/video/", "BL_");
        if (linkstr.indexOf("?") != -1){
          linkstr = linkstr.substring(0, linkstr.indexOf("?"));
        }
        return(linkstr);
    } else if ((linkstr.indexOf("twitcasting.tv/") != -1) || (linkstr.indexOf("/movie/") != -1)){
        let UIDName = linkstr.substring(0, linkstr.indexOf("/movie/"));
        UIDName = UIDName.substring(UIDName.lastIndexOf("/") + 1);
        return "TC_" + UIDName + "/" + linkstr.substring(linkstr.indexOf("/movie/") + 7);
    } else {
        return ("ERROR");
    }
  }

  AddRequest(
    bToken: string,
  ): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return (this.httpclient.post('https://repo.mchatx.org/Request/', {
      BToken : bToken,
    }, { headers, observe: 'response', responseType: 'text' }));
  }
}