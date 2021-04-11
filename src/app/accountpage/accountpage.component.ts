import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accountpage',
  templateUrl: './accountpage.component.html',
  styleUrls: ['./accountpage.component.scss']
})
export class AccountpageComponent implements OnInit {
  Nick:string|null = "";
  EmailAddress:string = "";
  status:string = "";
  processing:boolean = false;
  mode:number = 0;

  Pass:string = "";
  input1: string = "";
  input2: string = "";

  constructor(
    private AccService: AccountService,
    private Router: Router,
    private TGEnc: TsugeGushiService
) { }

  ngOnInit(): void {
    let rawdt = sessionStorage.getItem("MChatToken");
    if (rawdt != null){    
      let dt = JSON.parse(this.TGEnc.TGDecoding(rawdt));
      this.AccService.GetAccountData(
        this.TGEnc.TGEncoding(JSON.stringify({
          Nick: dt["Room"]
        }))
      ).subscribe({
        error: error => {
          this.Router.navigate(['']);
        },
        next: data => {
          dt = JSON.parse(data["body"]);
          this.Nick = dt["Nick"];
          this.EmailAddress = dt["Email"];
        }
      });
    } else {
      this.Router.navigate(['login']);
    }
  }

  DeleteAccount():void {
    if (this.input1 != this.Nick) {
      this.input1 = "";
    } else if (!this.processing){
      this.processing = true;
      this.AccService.PostDeleteAccount(
        this.TGEnc.TGEncoding(JSON.stringify({
          Nick: this.Nick
        }))
      ).subscribe({
        error: error => {
          this.status = error["error"];
          this.processing = false;
        },
        next: data => {
          sessionStorage.removeItem("MChatToken");
          this.status = "Account has been deleted, redirecting now (Your data is still cached for 14 days before permanent deletion)"
          setTimeout(() => {
            location.reload();
          }, 10000);
        }
      });
    }
  }

  ChangeMode(modechange:number) {
    if ((this.mode != modechange) && (!this.processing)){
      if (this.mode == 3){
        let modaltarget = document.getElementById("DeleteModal");
        if (modaltarget != null){
          modaltarget.className = "modal";
        }
      }
  
      this.mode = modechange;
      this.input1 = "";
      this.input2 = "";
      this.Pass = "";
      this.status = "";
  
      
      if (modechange == 3){
        let modaltarget = document.getElementById("DeleteModal");
        if (modaltarget != null){
          modaltarget.className = "modal is-active";
        }
      }
    }
  }

  ChangePass():void {
    if (this.input1 != this.input2){
      this.input1 = "";
      this.input2 = "";
      this.Pass = "";
      this.status = "PASS DOESN'T MATCH";
      return;
    }

    if (!this.processing){
      this.status = "";
      this.processing = true;
      this.AccService.PostChangePass(
        this.TGEnc.TGEncoding(JSON.stringify({
          Nick: this.Nick,
          Pass: this.Pass,
          NewPass: this.input1
        }))
      ).subscribe({
        error: error => {
          this.status = error["error"];
          this.processing = false;
          this.Pass = "";
        },
        next: data => {
          this.mode = 0;
          this.status = "Password has been changed."
          this.processing = false;
        }
      });
    }
  }

  ChangeEmail():void {
    if (!this.processing){
      this.status = "";
      this.processing = true;
      this.AccService.PostChangeEmail(
        this.TGEnc.TGEncoding(JSON.stringify({
          Nick: this.Nick,
          Pass: this.Pass,
          NewEmail: this.input1
        }))
      ).subscribe({
        error: error => {
          this.status = error["error"];
          this.Pass = "";
          this.input1 = "";
          this.input2 = "";
          this.processing = false;
        },
        next: data => {
          this.EmailAddress = this.input1;
          this.mode = 0;
          this.processing = false;
        }
      });
    }
  }
}
