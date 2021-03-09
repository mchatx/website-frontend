import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../services/archive.service';
import Archive from '../models/Archive';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  ArchiveList: Archive[] = [];
  SearchRoom: string = "";
  SearchLink: string = "";
  SearchTags: string = "";

  constructor(private AService:ArchiveService) {}

  ngOnInit(): void {
    this.AService.getArchive().subscribe(
      (response:Archive[]) => {
        this.ArchiveList = response;
      }
    )
  }

  SearchByRoom(): void {
    this.AService.getArchiveRoom(this.SearchRoom).subscribe(
      (response:Archive[]) => {
        this.ArchiveList = response;
        this.SearchRoom = "";
        this.SearchLink = "";
        this.SearchTags = "";
      }
    )
  }

  SearchByLink(): void {
    this.AService.getArchiveLink(this.SearchLink).subscribe(
      (response:Archive[]) => {
        this.ArchiveList = response;
      }
    )
  }

  SearchByTags(): void {
    this.AService.getArchiveTags(this.SearchTags.replace(", ", "_").replace(" ", "_")).subscribe(
      (response:Archive[]) => {
        this.ArchiveList = response;
      }
    )
  }

  JumpToClient(link: string | undefined){
    if (link != undefined){
      window.location.href = "m-chad://Archive/" + link.replace(" ", "%20");
    }
  }
}
