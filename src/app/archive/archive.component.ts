import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../services/archive.service';
import Archive from '../models/Archive';
import { ShowSearch } from '../models/ShowSearch';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {DomSanitizer} from '@angular/platform-browser';

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
    private Sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.AService.getArchive().subscribe(
      (response: Archive[]) => {
        this.ArchiveList = response;
      }
    )
  }

  SearchByRoom(): void {
    this.AService.getArchiveRoom(this.SearchRoom).subscribe(
      (response: Archive[]) => {
        this.ArchiveList = response;
        this.SearchRoom = "";
        this.SearchLink = "";
        this.SearchTags = "";
      }
    )
  }

  SearchByLink(): void {
    this.AService.getArchiveLink(this.SearchLink).subscribe(
      (response: Archive[]) => {
        this.ArchiveList = response;
        this.SearchRoom = "";
        this.SearchLink = "";
        this.SearchTags = "";
      }
    )
  }

  SearchByTags(): void {
    this.AService.getArchiveTags(this.SearchTags.replace(", ", "_").replace(" ", "_")).subscribe(
      (response: Archive[]) => {
        this.ArchiveList = response;
        this.SearchRoom = "";
        this.SearchLink = "";
        this.SearchTags = "";
      }
    )
  }

  sanitize(url:string | undefined){
    if (url != undefined) {
      return this.Sanitizer.bypassSecurityTrustUrl("m-chad://Archive/" + url.replace(" ", "%20"));
    } else {
      return ("Error");
    }
  }
  toggleDrop() {
    this.isdropActive = !this.isdropActive;
  }

  ShowSearch(indexitem:number) {
    this.SelectedIndex = indexitem;
    this.isSearchActive = !this.isSearchActive;
  }



  faChevronDown = faChevronDown;
}
