import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';

// ICONS
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  status:string = "";
  Nick:string = "";
  Pass:string = "";
  Processing:boolean = false;
  
  // ICONS
  faUser = faUser;
  faLock = faLock;

  constructor(
    private AccService: AccountService,
    private TGEnc: TsugeGushiService,
    private Router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("MChatToken") != undefined){    
      this.Router.navigate(['']);
    }
  }

  LoginTry(): void{
    if (!this.Processing) {
      this.Processing = true;
      this.AccService.GetTokenPublic(this.Nick, this.Pass).subscribe({
        error: error => {
          setTimeout(() => {
          }, 2000);
          this.status = "WRONG PASSWORD/ROOM NAME";
          this.Nick = "";
          this.Pass = "";
          sessionStorage.removeItem("MChatToken");
          this.Processing = false;
        },
        next: data => {
          if (data.body[0]["Role"] == "TL"){
            sessionStorage.setItem("MChatToken", this.TGEnc.TGEncoding(JSON.stringify({
              Room: this.Nick,
              Token: data.body[0]["Token"],
              Role: "TL"
            })));
            location.reload();
          } else {
            sessionStorage.setItem("MChatToken", this.TGEnc.TGEncoding(JSON.stringify({
              Room: this.Nick,
              Token: data.body[0]["Token"]
            })));
            location.reload();
          }
        }
      });    
    }
  }
}
