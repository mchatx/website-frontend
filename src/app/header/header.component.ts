import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TsugeGushiService } from '../services/tsuge-gushi.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private TGCrypt: TsugeGushiService
  ) {}

  LoggedIn: boolean = false;
  AccountName: string = "";

  ngOnInit(): void {
    let test:string | null = sessionStorage.getItem("MChatToken");
    if (test != undefined){
      let TokenData = JSON.parse(this.TGCrypt.TGDecryption(test));
      this.AccountName = TokenData["Room"];
      this.LoggedIn = true;
    }
  }

  LogoutButtonPush():void {
    sessionStorage.removeItem("MChatToken");
    this.LoggedIn = false;
    this.AccountName = "";
    location.reload();
  }

  @ViewChild('navBurger') navBurger!: ElementRef;
  @ViewChild('navMenu') navMenu!: ElementRef;

  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  faDiscord = faDiscord;
  faDownload = faDownload;

}
