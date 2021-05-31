import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WPproxyService {

  constructor() { }

  ListenToRoom(Btoken: string): EventSource{
    return (new EventSource(environment.DBConn + '/FetchRaw/?BToken=' + Btoken));
  }

}
