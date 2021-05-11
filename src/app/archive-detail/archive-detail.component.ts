import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { CommentService } from '../services/comment.service';
import { AccountService } from '../services/account.service';
import Archive from '../models/Archive';
import { faLock, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.scss']
})
export class ArchiveDetailComponent implements OnInit {

  status: string = "";
  ARLink: string|null = "";
  Nick: string = "";
  Pass: string = "";
  Token: string = "";
  CurrentArchive: Archive|null = null;
  ARID: string = "";
  isLoginModalActive: boolean = false;
  modalstatus: string = "";
  Processing: boolean = false;

  @ViewChild('loadstate1') loadbutton1!: ElementRef;

  constructor(    
    private Sanitizer: DomSanitizer,
    private TGEnc: TsugeGushiService,
    private CMService: CommentService,
    private AccService: AccountService,
    private RouteParam: ActivatedRoute,
    private Router: Router
    ) 
    { }

  ngOnInit(): void {
    let test = localStorage.getItem("MChatToken")
    if (test != undefined) {
      let TokenData = JSON.parse(this.TGEnc.TGDecoding(test));
      this.Nick = TokenData["Room"];
      this.Token = TokenData["Token"];
    }

    this.ARLink = this.RouteParam.snapshot.paramMap.get('ArLink');
    if (this.ARLink != null){
      var dt;

      if (this.Nick != ""){
        dt = {
          Link : this.ARLink.replace("%20", " "),
          Nick : this.Nick
        }
      } else {
        dt = {
          Link : this.ARLink,
        }
      }

      this.CMService.FirstTest(this.TGEnc.TGEncoding(JSON.stringify(dt))).subscribe(
        (response) => {
          if (response.status != 200){
            setTimeout(() => {
              this.Router.navigate(['archive']);
            }, 5000);
            this.status = "UNABLE TO ACCESS ARCHIVE.";
            return;
          }
          
          let dt = JSON.parse(response.body);
          this.ARID = dt["_id"];
          this.CurrentArchive = {
            Room: dt["Room"],
            Nick: dt["Nick"],
            Pass: dt["Pass"],
            Link: dt["Link"],
            StreamLink: dt["StreamLink"],
            Tags: dt["Tags"],
            Star: dt["Star"]
          }
          
          if (!this.CurrentArchive.Star){
            this.CurrentArchive.Star = 0;
          }
        },
        (error) => {
          setTimeout(() => {
            this.Router.navigate(['archive']);
          }, 5000);
          this.status = "UNABLE TO ACCESS ARCHIVE, REDIRECTING BACK.";
          return;
        }
      );      
    } else {
      this.Router.navigate(['archive']);
    }
  }

  sanitize(url: string | undefined) {
    if (url != undefined) {
      return this.Sanitizer.bypassSecurityTrustUrl("m-chad://Archive/" + url.replace(" ", "%20"));
    } else {
      return ("Error");
    }
  }

  //------------------------------------------------------- LOGIN HANDLER -------------------------------------------------------
  Login(): void {
    this.modalstatus = "";
    this.loadbutton1.nativeElement.classList.add('is-loading');
    setTimeout(() => {
      this.loadbutton1.nativeElement.classList.remove('is-loading');
      if (!this.Processing) {
        this.Processing = true;
        this.AccService.GetTokenPublic(this.Nick, this.Pass).subscribe({
          error: error => {
            setTimeout(() => {
            }, 2000);
            this.modalstatus = "WRONG PASSWORD/USERNAME";
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
    }, 1000); // delay for button loading

  }

  CloseLoginModal(): void {
    this.isLoginModalActive = !this.isLoginModalActive;
  }
  //======================================================= LOGIN HANDLER =======================================================

  //------------------------------------------------------- COMMENT HANDLER -------------------------------------------------------
  AddComment():void {

  }

  RemoveComment():void {

  }

  EditComment():void {

  }
  //======================================================= COMMENT HANDLER =======================================================

  //-------------------------------------------------------- RATING HANDLER --------------------------------------------------------
  //======================================================== RATING HANDLER ========================================================

  faUser = faUser;
  faLock = faLock;
  faUnlock = faUnlock;
}
