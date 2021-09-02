import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchiveService } from '../services/archive.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import Archive from '../models/Archive';
import { ShowSearch } from '../models/ShowSearch';
import { faChevronDown, faSearch, faRedoAlt, faStar, faLock, faAngleRight, faAngleDoubleRight, faAngleLeft, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  isdropActive: boolean = false;
  isSearchActive: boolean = true;

  ArchiveList: Archive[] = [];
  SearchRoom: string = "";
  SearchLink: string = "";
  SearchTags: string = "";

  TotalPage: number = 0;
  CurrentPage: number = 1;
  PageArray: number[] = [1, 2, 3, 4, 5];
  SearchQuery: any;

  Search: string[] = ['Room', 'Link', 'Tags'];
  SelectedIndex: number = 0;

  constructor(
    private AService: ArchiveService,
    private Sanitizer: DomSanitizer,
    private TGEnc: TsugeGushiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.SearchQuery = {}
    this.FirstFetch();
  }

  SearchByRoom(): void {
    this.SearchQuery = {
      Room: this.SearchRoom
    };
    this.FirstFetch();
  }

  SearchByLink(): void {
    this.SearchQuery = {
      Link: this.SearchLink
    };
    this.FirstFetch();
  }

  SearchByTags(): void {
    this.SearchQuery = {
      Tags: this.SearchTags.replace(", ", "_").replace(" ", "_")
    };
    this.FirstFetch();
  }

  FirstFetch() {
    this.SearchQuery["Act"] = "ArchiveList";
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify(this.SearchQuery))).subscribe(
      (response) => {
        this.CurrentPage = 1;
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map((e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined) {
            e.Tags = e.Tags.toString().split(",");
            for (let i = 0; i < e.Tags.length; i++) {
              e.Tags[i] = e.Tags[i].trim();
            }
          }
          return e;
        });
      }
    )

    this.SearchQuery["Act"] = "ArchiveCount";
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify(this.SearchQuery))).subscribe(
      (response) => {
        this.TotalPage = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).Total;
        this.RefreshPageArray();
      }
    );
  };
  
  RefreshPageArray(){
    window.scroll(0,0);
    this.PageArray.splice(0, this.PageArray.length);
    for(let i = this.CurrentPage - 2; i <= this.CurrentPage + 2; i++){
      if (i < 1){
        continue;
      } else if (i > this.TotalPage){
        break;
      } else {
        this.PageArray.push(i);
      }
    }
  }

  ChangePage(){
    this.SearchQuery["Act"] = "ArchiveList";

    if (this.CurrentPage > this.TotalPage){
      this.CurrentPage = this.TotalPage;
    } else if (this.CurrentPage < 1){
      this.CurrentPage = 1;
    }

    this.SearchQuery["Page"] = this.CurrentPage;
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify(this.SearchQuery))).subscribe(
      (response) => {
        this.RefreshPageArray();
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map((e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined) {
            e.Tags = e.Tags.toString().split(",");
            for (let i = 0; i < e.Tags.length; i++) {
              e.Tags[i] = e.Tags[i].trim();
            }
          }
          return e;
        });
      }
    );
  }

  sanitize(url: string | undefined) {
    if (url != undefined) {
      return this.Sanitizer.bypassSecurityTrustUrl("m-chad://Archive/" + url.replace(" ", "%20"));
    } else {
      return ("Error");
    }
  }

  toggleDrop() {
    this.isdropActive = !this.isdropActive;
  }

  ShowSearch(indexitem: number) {
    this.SelectedIndex = indexitem;
    this.isSearchActive = !this.isSearchActive;
  }

  ClearSearch() {
    this.SearchQuery = {};
    this.FirstFetch();
  }

  RoomNameClick(RoomName: string | undefined) {
    if (RoomName != undefined) {
      this.router.navigate(['room', RoomName]);
    }
  }

  TagClick(Tag: string | undefined) {
    if (Tag != undefined) {
      this.SelectedIndex = 2;
      this.SearchTags = Tag;
      this.SearchByTags();
    }
  }

  faRedoAlt = faRedoAlt;
  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faStar = faStar;
  faLock = faLock;
  faAngleRight = faAngleRight;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleLeft = faAngleLeft;
  faAngleDoubleLeft = faAngleDoubleLeft;
}
