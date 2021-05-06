import { Component, OnInit } from '@angular/core';
import { RequestService  } from '../services/request.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { AccountService } from '../services/account.service';
import RequestCard from '../models/RequestCard';

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
  RequestData: RequestCard[] = [];

  constructor(
    private RService: RequestService,
    private TGEnc: TsugeGushiService,
    private AccService: AccountService
  ) { }

  ngOnInit(): void {
    let test = localStorage.getItem("MChatToken") 
    if (test != undefined){
      let TokenData = JSON.parse(this.TGEnc.TGDecoding(test));
      this.Nick = TokenData["Room"];
      this.Token = TokenData["Token"];
    }
    this.RepopulateData();
  }

  RepopulateData(): void{
    this.RService.GetRecentRequest(this.Nick).subscribe(
      (response: RequestCard[]) => {
        this.RequestData = response.map( e => {
          if (e.Link != undefined){
            e.Link = this.RService.ReverseLinkParser(e.Link);
          }
          return e;
        });
      }
    )
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

  AddRequest(index: number = -1): void{
    if (!this.Processing){
      if (!localStorage.getItem("MChatToken")){
        this.Nick = "";
        this.Token = "";
        this.isLoginModalActive = !this.isLoginModalActive;
        this.Pass = "";
        this.modalstatus = "";
        return;
      }

      let UID;
      if (index == -1){
        UID = this.RService.LinkParser(this.CheckLink);
      } else {
        UID = this.RequestData[index].Link;
        if (UID != undefined){
          UID = this.RService.LinkParser(UID);
        }
      }
      
      if (UID == "ERROR"){
        this.status = "INVALID LINK";
        return;
      }
  
      this.status = "PROCESSING REQUEST";
      this.Processing = true;

      this.RService.RequestPost(this.TGEnc.TGEncoding(JSON.stringify({
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
          this.RepopulateData();
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

  RemoveRequest(index: number): void{
    if (!this.Processing){
      if (!localStorage.getItem("MChatToken")){
        this.Nick = "";
        this.Token = "";
        this.isLoginModalActive = !this.isLoginModalActive;
        this.Pass = "";
        this.modalstatus = "";
        return;
      }

      let UID = this.RequestData[index].Link;
      if (UID != undefined){
        UID = this.RService.LinkParser(UID);
      }
      
      if (UID == "ERROR"){
        this.status = "INVALID LINK";
        return;
      }
  
      this.status = "PROCESSING REQUEST";
      this.Processing = true;

      this.RService.RequestPost(this.TGEnc.TGEncoding(JSON.stringify({
        Act: "Delete",
        Nick: this.Nick,
        Link: UID,
        Token: this.Token
      }))).subscribe(
        (response) => {
          this.status = "SENT";
          this.Processing = false;
          this.RepopulateData();
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
