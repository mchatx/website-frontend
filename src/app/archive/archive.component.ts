import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchiveService } from '../services/archive.service';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import Archive from '../models/Archive';
import { ShowSearch } from '../models/ShowSearch';
import { faChevronDown, faSearch, faRedoAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

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

  Search: string[] = ['Room', 'Link', 'Tags'];
  SelectedIndex: number = 0;

  constructor(
    private AService: ArchiveService,
    private Sanitizer: DomSanitizer,
    private TGEnc: TsugeGushiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "ArchiveList",
    }))).subscribe(
      (response) => {
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map( (e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined){
            e.Tags = e.Tags.toString().split(",");
            for(let i = 0; i < e.Tags.length; i++){
              e.Tags[i] = e.Tags[i].trim();
            }
          }
          return e;
        });
      }
    )
  }

  SearchByRoom(): void {
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "ArchiveList",
      Room: this.SearchRoom
    }))).subscribe(
      (response) => {
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map( (e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined){
            e.Tags = e.Tags.toString().split(",");
            for(let i = 0; i < e.Tags.length; i++){
              e.Tags[i] = e.Tags[i].trim();
            }
          }
          return e;
        });
      }
    )
  }

  SearchByLink(): void {
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "ArchiveList",
      Link: this.SearchLink
    }))).subscribe(
      (response) => {
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map( (e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined){
            e.Tags = e.Tags.toString().split(",");
            for(let i = 0; i < e.Tags.length; i++){
              e.Tags[i] = e.Tags[i].trim();
            }
          }
          return e;
        });
      }
    )
  }

  SearchByTags(): void {
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "ArchiveList",
      Tags: this.SearchTags.replace(", ", "_").replace(" ", "_")
    }))).subscribe(
      (response) => {
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map( (e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined){
            e.Tags = e.Tags.toString().split(",");
            for(let i = 0; i < e.Tags.length; i++){
              e.Tags[i] = e.Tags[i].trim();
            }
          }  
          return e;
        });
      }
    )
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

  ClearSearch(){
    this.AService.FetchArchive(this.TGEnc.TGEncoding(JSON.stringify({
      Act: "ArchiveList",
    }))).subscribe(
      (response) => {
        this.ArchiveList = JSON.parse(this.TGEnc.TGDecoding(JSON.parse(response.body)["BToken"])).map( (e: Archive) => {
          if (!e.Star) e.Star = 0;
          if (e.Tags != undefined){
            e.Tags = e.Tags.toString().split(",");
            for(let i = 0; i < e.Tags.length; i++){
              e.Tags[i] = e.Tags[i].trim();
            }
          }    
          return e;
        });
      }
    )
  }

  RoomNameClick(RoomName: string | undefined) {
    if (RoomName != undefined){
      this.SelectedIndex = 0;
      this.SearchRoom = RoomName;
      this.SearchByRoom();
    }
  }

  TagClick(Tag: string | undefined) {
    if (Tag != undefined){
      this.SelectedIndex = 2;
      this.SearchTags = Tag;
      this.SearchByTags();
    }
  }

  faRedoAlt = faRedoAlt;
  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faStar = faStar;
}
