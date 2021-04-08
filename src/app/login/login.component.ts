import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// ICONS
import { faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ModeSignin: boolean = true;
  status:string = "";
  SearchNick:string = "";
  SearchPass:string = "";
  ConfirmPass:string = "";
  EmailAddress:string = "";
  
  // ICONS
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;

  constructor(
    private RouteParam: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  LoginTry(): void{

  }

  ChangeMode(newmode: boolean): void{
    this.ModeSignin = newmode;
    this.status = "";
    this.SearchNick = "";
    this.ConfirmPass = "";
    this.EmailAddress = "";
  }
}
