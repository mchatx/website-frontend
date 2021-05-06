import { Component, OnInit } from '@angular/core';
import { RequestService  } from '../services/request.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-requestboard',
  templateUrl: './requestboard.component.html',
  styleUrls: ['./requestboard.component.scss']
})
export class RequestboardComponent implements OnInit {
  status:string = "TEST";
  modalstatus:string = "";
  CheckLink:string = "";
  Processing:boolean = false;
  Nick: string = "";
  Token: string = "";
  Pass: string = "";
  isLoginModalActive: boolean = false;

  constructor(
    private RService: RequestService,
    private TGEnc: TsugeGushiService,
    private AccService: AccountService
  ) { }

  ngOnInit(): void {
  }

  Login():void {
    if (!this.Processing) {
      this.Processing = true;
      this.AccService.GetTokenPublic(this.Nick, this.Pass).subscribe({
        error: error => {
          setTimeout(() => {
          }, 2000);
          this.modalstatus = "WRONG PASSWORD/ROOM NAME";
          this.Nick = "";
          this.Pass = "";
          localStorage.removeItem("MChatToken");
          this.Processing = false;
        },
        next: data => {
          this.modalstatus = "LOGIN SUCCESS"
          if (data.body[0]["Role"] == "TL") {
            localStorage.setItem("MChatToken", this.TGEnc.TGEncoding(JSON.stringify({
              Room: this.Nick,
              Token: data.body[0]["Token"],
              Role: "TL"
            })));
          } else {
            localStorage.setItem("MChatToken", this.TGEnc.TGEncoding(JSON.stringify({
              Room: this.Nick,
              Token: data.body[0]["Token"]
            })));
          }
          location.reload();
        }
      });
    }
  }

  CloseLoginModal(): void{
    this.isLoginModalActive = !this.isLoginModalActive;
  }

  AddRequest(): void{
    if (!this.Processing){

      let test = localStorage.getItem("MChatToken") 
      if (!test){
        this.Nick = "";
        this.Token = "";
        this.isLoginModalActive = !this.isLoginModalActive;
        this.Pass = "";
        this.modalstatus = "";
        return;
      } else {
        let TokenData = JSON.parse(this.TGEnc.TGDecoding(test));
        this.Nick = TokenData["Room"];
        this.Token = TokenData["Token"];
      }

      let UID = this.RService.LinkParser(this.CheckLink);
      if (UID == "ERROR"){
        this.status = "INVALID LINK";
        return;
      }
  
      this.status = "PROCESSING REQUEST";
      this.Processing = true;

      this.RService.AddRequest(this.TGEnc.TGEncoding(JSON.stringify({
        Act: "Add",
        Nick: this.Nick,
        Link: UID,
        Token: this.Token,
        insecure: true
      }))).subscribe(
        (response) => {
          this.status = "SENT";
          this.Processing = false;
          this.CheckLink = "";
        },
        (error) => {
          this.status = error.error;
          this.Processing = false;

          if (error.error == "ERROR : INVALID TOKEN"){
            this.isLoginModalActive = !this.isLoginModalActive;
            this.Pass = "";
            this.modalstatus = "";
          }
        }
      )
    }
  }
}
