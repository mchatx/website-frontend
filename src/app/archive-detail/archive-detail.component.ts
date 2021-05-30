import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { CommentService } from '../services/comment.service';
import { AccountService } from '../services/account.service';
import { RatingService } from '../services/rating.service';
import Archive from '../models/Archive';
import Comment from '../models/Comment';
import { faLock, faUnlock, faUser, faEdit, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.scss']
})
export class ArchiveDetailComponent implements OnInit {

  status: string = "";
  ARLink: string | null = "";
  Nick: string = "";
  Pass: string = "";
  Token: string = "";
  CurrentArchive: Archive | null = null;
  ARID: string = "";
  isLoginModalActive: boolean = false;
  modalstatus: string = "";
  Processing: boolean = false;

  @ViewChild('loadstate1') loadbutton1!: ElementRef;
  @ViewChild('loadstate2') loadbutton2!: ElementRef;
  @ViewChild('loadstate3') loadbutton3!: ElementRef;
  constructor(
    private Sanitizer: DomSanitizer,
    private TGEnc: TsugeGushiService,
    private CMService: CommentService,
    private AccService: AccountService,
    private RateService: RatingService,
    private RouteParam: ActivatedRoute,
    private Router: Router
  ) { }

  ngOnInit(): void {
    let test = localStorage.getItem("MChatToken")
    if (test != undefined) {
      let TokenData = JSON.parse(this.TGEnc.TGDecoding(test));
      this.Nick = TokenData["Room"];
      this.Token = TokenData["Token"];
    }

    this.ARLink = this.RouteParam.snapshot.paramMap.get('ArLink');
    if (this.ARLink != null) {
      var dt;

      if (this.Nick != "") {
        dt = {
          Link: this.ARLink.replace("%20", " "),
          Nick: this.Nick
        }
      } else {
        dt = {
          Link: this.ARLink,
        }
      }

      this.CMService.GetArchiveData(this.TGEnc.TGEncoding(JSON.stringify(dt))).subscribe(
        (response) => {
          if (response.status != 200) {
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
            Star: dt["Star"],
            Note: dt["Note"]
          }

          if (!this.CurrentArchive.Star) {
            this.CurrentArchive.Star = 0;
          }
          this.RepopulateComment();

          if (this.Nick != "") {
            this.CheckRating();
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

  RoomNameClick(RoomName: string | undefined) {
    if (RoomName != undefined) {
      this.Router.navigate(['room', RoomName]);
    }
  }

  //------------------------------------------------------- LOGIN HANDLER -------------------------------------------------------
  Login(): void {
    this.modalstatus = "";
    this.loadbutton3.nativeElement.classList.add('is-loading');
    setTimeout(() => {
      this.loadbutton3.nativeElement.classList.remove('is-loading');
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
  newcomment: string = "";
  editcomment: string = "";
  CommentsList: Comment[] = [];
  SelectedComment: number = -1;
  isDeleteModalActive: boolean = false;
  isEditModalActive: boolean = false;

  AddComment(): void {
    this.status = "";
    this.loadbutton1.nativeElement.classList.add("is-loading");
    setTimeout(() => {
      this.loadbutton1.nativeElement.classList.remove("is-loading");
      if ((!this.Processing) || (this.newcomment.length != 0)) {
        if (!localStorage.getItem("MChatToken")) {
          this.Nick = "";
          this.Token = "";
          this.isLoginModalActive = !this.isLoginModalActive;
          this.Pass = "";
          this.modalstatus = "";
          return;
        }

        this.Processing = true;

        this.CMService.CommentPost(this.TGEnc.TGEncoding(JSON.stringify({
          Act: "Add",
          Nick: this.Nick,
          Token: this.Token,
          content: this.newcomment,
          TStamp: Math.floor(Date.now() / 1000).toString(),
          ARID: this.ARID
        }))).subscribe(
          (response) => {
            this.Processing = false;
            this.newcomment = "";
            this.RepopulateComment();
          },
          (error) => {
            this.status = error.error;
            this.Processing = false;

            if (error.error == "ERROR : INVALID TOKEN") {
              this.isLoginModalActive = !this.isLoginModalActive;
              this.Pass = "";
              this.modalstatus = "";
            }
          }
        )
      }
    }, 1000); // delay for loading

  }

  RemoveComment(): void {
    if ((!this.Processing) || ((this.SelectedComment != -1) && (this.SelectedComment < this.CommentsList.length))) {
      this.Processing = true;

      this.CMService.CommentPost(this.TGEnc.TGEncoding(JSON.stringify({
        Act: "Delete",
        Nick: this.Nick,
        Token: this.Token,
        TStamp: this.CommentsList[this.SelectedComment].TStamp,
        ARID: this.ARID
      }))).subscribe(
        (response) => {
          this.Processing = false;
          this.CloseDeleteModal();
          this.RepopulateComment();
        },
        (error) => {
          this.status = error.error;
          this.Processing = false;

          if (error.error == "ERROR : INVALID TOKEN") {
            this.isLoginModalActive = !this.isLoginModalActive;
            this.Pass = "";
            this.modalstatus = "";
            this.CloseDeleteModal();
            this.RepopulateComment();
          }
        }
      )
    }
  }

  OpenDeleteModal(index: number): void {
    if (!localStorage.getItem("MChatToken")) {
      this.Nick = "";
      this.Token = "";
      this.isDeleteModalActive = false;
      this.isLoginModalActive = true;
      this.Pass = "";
      this.modalstatus = "";
      return;
    }
    else {
      this.isDeleteModalActive = !this.isDeleteModalActive;
      this.SelectedComment = index;
    }
  }

  CloseDeleteModal(): void {
    this.isDeleteModalActive = !this.isDeleteModalActive;
    this.SelectedComment = -1;
  }

  EditComment(): void {
    this.status = "";
    this.loadbutton2.nativeElement.classList.add("is-loading");
    setTimeout(() => {
      this.loadbutton2.nativeElement.classList.remove("is-loading");
      if ((!this.Processing) || ((this.SelectedComment != -1) && (this.SelectedComment < this.CommentsList.length))) {
        this.Processing = true;

        this.CMService.CommentPost(this.TGEnc.TGEncoding(JSON.stringify({
          Act: "Edit",
          Nick: this.Nick,
          Token: this.Token,
          TStamp: this.CommentsList[this.SelectedComment].TStamp,
          content: this.editcomment + " (edited)",
          ARID: this.ARID
        }))).subscribe(
          (response) => {
            this.Processing = false;
            this.CloseEditModal();
            this.RepopulateComment();
          },
          (error) => {
            this.status = error.error;
            this.Processing = false;

            if (error.error == "ERROR : INVALID TOKEN") {
              this.isLoginModalActive = !this.isLoginModalActive;
              this.Pass = "";
              this.modalstatus = "";
              this.CloseEditModal();
              this.RepopulateComment();
            }
          }
        )
      }
    }, 1000); // delay for loading

  }

  OpenEditModal(index: number): void {
    if (!localStorage.getItem("MChatToken")) {
      this.Nick = "";
      this.Token = "";
      this.isEditModalActive = false;
      this.isLoginModalActive = true;
      this.Pass = "";
      this.modalstatus = "";
      return;
    }
    else
      this.isEditModalActive = !this.isEditModalActive;

    let test = this.CommentsList[index].Content;
    if (test != undefined) {
      this.editcomment = test;
    }

    this.SelectedComment = index;
  }

  CloseEditModal(): void {
    this.isEditModalActive = !this.isEditModalActive;
    this.SelectedComment = -1;
  }

  RepopulateComment(): void {
    this.CommentsList = [];
    this.CMService.CommentPost(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "Request",
      ARID: this.ARID
    }))).subscribe(
      (response) => {
        this.CommentsList = JSON.parse(response.body);
      },
      (error) => {
        this.status = error.error;
      }
    );
  }
  //======================================================= COMMENT HANDLER =======================================================



  //-------------------------------------------------------- RATING HANDLER --------------------------------------------------------
  RatingBtn: string = "☆"
  //☆ or ★ (Rated)

  CheckRating() {
    if ((this.Nick != "") && (this.ARID != "")) {
      this.RateService.RatingPost(this.TGEnc.TGEncoding(JSON.stringify({
        Act: "Check",
        Nick: this.Nick,
        ARID: this.ARID
      }))).subscribe(
        (response) => {
          if (response.body == "True") {
            this.RatingBtn = "★ (Rated)"
          } else {
            this.RatingBtn = "☆"
          }
        },
        (error) => {
          this.RatingBtn = "☆"
        }
      )
    }
  }

  RatingBtnClick() {
    if (!localStorage.getItem("MChatToken")) {
      this.Nick = "";
      this.Token = "";
      this.isLoginModalActive = !this.isLoginModalActive;
      this.Pass = "";
      this.modalstatus = "";
      return;
    }
    if ((this.Nick != "") && (this.ARID != "") && (!this.Processing)) {

      if (this.RatingBtn == "☆") {
        this.Processing = true;
        this.RateService.RatingPost(this.TGEnc.TGEncoding(JSON.stringify({
          Act: "Add",
          Nick: this.Nick,
          Token: this.Token,
          ARID: this.ARID
        }))).subscribe(
          (response) => {
            this.Processing = false;
            if (response.body == "Ok") {
              this.RatingBtn = "★ (Rated)"
              var test = this.CurrentArchive?.Star;
              if ((test != null) && (this.CurrentArchive != null)) {
                test += 1;
                this.CurrentArchive.Star = test;
              }
            } else {
              this.RatingBtn = "★ (Rated)"
            }
          },
          (error) => {
            this.Processing = false;
            if (error.error == "ERROR : INVALID TOKEN") {
              this.isLoginModalActive = !this.isLoginModalActive;
              this.Pass = "";
              this.modalstatus = "";
            }
          }
        )
      } else {
        this.Processing = true;
        this.RateService.RatingPost(this.TGEnc.TGEncoding(JSON.stringify({
          Act: "Delete",
          Nick: this.Nick,
          Token: this.Token,
          ARID: this.ARID
        }))).subscribe(
          (response) => {
            this.Processing = false;
            if (response.body == "OK") {
              this.RatingBtn = "☆"
              var test = this.CurrentArchive?.Star;
              if ((test != null) && (this.CurrentArchive != null)) {
                test -= 1;
                this.CurrentArchive.Star = test;
              }
            }
          },
          (error) => {
            this.Processing = false;
            if (error.error == "ERROR : INVALID TOKEN") {
              this.isLoginModalActive = !this.isLoginModalActive;
              this.Pass = "";
              this.modalstatus = "";
            }
          }
        )
      }
    }
  }
  //======================================================== RATING HANDLER ========================================================



  faUser = faUser;
  faLock = faLock;
  faUnlock = faUnlock;
  faEdit = faEdit;
  faTrash = faTrash;
  faReply = faReply;
}
