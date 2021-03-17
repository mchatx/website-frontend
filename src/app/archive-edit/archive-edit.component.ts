import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../services/archive.service';
import ArchiveData from '../models/ArchiveFullData';
import Entries from '../models/Entries';

@Component({
  selector: 'app-archive-edit',
  templateUrl: './archive-edit.component.html',
  styleUrls: ['./archive-edit.component.scss']
})
export class ArchiveEditComponent implements OnInit {
  SearchNick: string = "";
  SearchPass: string = "";
  
  Room: string = "";
  status: string = "";
  Token: string = "";
  LoginMode: boolean = false;

  mode: string = "";
  /*
    [empty] : Main menu
    Export : Export menu
    Edit : Edit menu
    Delete : Delete menu
    Add : Add new archive menu
    Update : upload prexisting archive
  */

  Archivedt: ArchiveData[] = [];
  Entriesdt: Entries[] = [];
  SelectedIndex: number = -1;

  constructor(
    private AService: ArchiveService
  ) { }

  ngOnInit(): void {
  }

  LoginRoom() {
    this.AService.GetToken(this.SearchNick, this.SearchPass).subscribe({
      error: error => {
        this.status = "WRONG PASSWORD/ROOM NAME";
        this.SearchPass = "";
      },
      next: data => {
        this.Token = data.body[0]["Token"];
        this.Room = this.SearchNick;
        this.LoginMode = true;
        this.SearchPass = "";
        this.status = "";
        this.LoadArchive();
      }
    });
  }

  Setmode(modestring :string) {
    this.mode = modestring;
  }

  SetSelected(index: number) {
    this.SelectedIndex = index;
  }

  LoadArchive() {
    this.Archivedt = [];
    this.AService.GetAllArchive(this.Room, this.Token).subscribe(
      (response) => {
        var dt = JSON.parse(response.body);
        this.SelectedIndex = dt.length;
        for (let i = 0; i < dt.length; i++){
          this.Archivedt.push({
            Room: dt[i].Room,
            Link: dt[i].Link,
            Nick: dt[i].Nick,
            Hidden: dt[i].Hidden,
            Pass: dt[i].Pass,
            Tags: dt[i].Tags,
            StreamLink: dt[i].StreamLink,
            ExtShare: dt[i].ExtShare
          });
        }
        /*
        this.Archivedt.push({
          Room: "TEST ROOM",
          Link: "TEST LINK",
          Nick: "TEST NICK",
          Hidden: true,
          Pass: false,
          Tags: "TEST TAGS",
          StreamLink: "TEST STREAM LINK",
          ExtShare: true
        });
        */
    });
  }

}
