import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import ScheduleData  from '../models/Schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpclient: HttpClient) { }

  getSchedule(room:string = ""): Observable<any>  {
    if (room == ""){
      return (this.httpclient.get('http://157.230.241.238/Schedule'));      
    } else {
      return (this.httpclient.get('http://157.230.241.238/Schedule?room=' + room));
    }
  }
  //------------------------------------------- SCHEDULE EDIT HANDLER -------------------------------------------

  // RETURN TOKEN WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  GetToken(room:string, pass: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://157.230.241.238/Login/', { 
      Room: room, 
      Pass: pass
    }, { headers, observe: 'response'}));
  }

  /*  CAN BE USED BY PUTTING THIS ON

      this.ScheduleService.GetToken("Testing", "Test").subscribe({
      error: error => {
        this.result = "FAIL";
      },
      next: data => {
        this.result = data.body[0]["Token"];
      }
    });
  */
  
  // RETURN STRING "OK" WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  AddSchedule(room:string, token: string, link: string, note: string, tag: string, time: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://157.230.241.238/Schedule/', { 
      Act: 'Add',
      Room: room, 
      Token: token,
      Link: link,
      Note: note,
      Tag: tag,
      Time: time  // THIS ONE SHOULD BE IN miliseconds SINCE UTC FORMAT
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  // RETURN STRING "OK" WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  // YOU CAN GET SCHEDULE ID FROM getSchedule WITH ROOM ARGUMENT
    EditSchedule(room:string, token: string, link: string, note: string, tag: string, idObject: string): Observable<any> {
      const headers = {'Content-Type': 'application/json'};
  
      return (this.httpclient.post('http://157.230.241.238/Schedule/', { 
        Act: 'Edit',
        Room: room, 
        Token: token,
        Link: link,
        Note: note,
        Tag: tag,
        id: idObject
      }, { headers, observe: 'response', responseType: 'text'}));
    }

  // RETURN STRING "OK" WHEN SUCCESS OR HTTP STATUS 400 FOR ERROR
  DeleteSchedule(room:string, token: string, idObject: string): Observable<any> {
    const headers = {'Content-Type': 'application/json'};

    return (this.httpclient.post('http://157.230.241.238/Schedule/', { 
      Act: 'Edit',
      Room: room, 
      Token: token,
      id: idObject
    }, { headers, observe: 'response', responseType: 'text'}));
  }

  //=========================================== SCHEDULE EDIT HANDLER ===========================================
}
