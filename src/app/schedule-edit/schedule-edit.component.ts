import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleService } from '../services/schedule.service';
import ScheduleData from '../models/Schedule';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent implements OnInit {
  mode: string | null = "";
  LoginMode: boolean = false;
  status: string = "";
  SearchNick: string = "";
  SearchPass: string = "";
  ScheduleList: any;  
  SelectedIndex:number = -1;
  SelectedSched: ScheduleData = {
    Room: "",
    Link: "",
    Note: "",
    Time: 0,
    Tag: ""
  };
  DateParser: String = "";
  TimeParser: String = "";

  Token: string = "";

  constructor(
    private RouteParam: ActivatedRoute, 
    private ScheduleService: ScheduleService, 
    private router: Router,
    ) 
    { }

  ngOnInit(): void {
    this.LoginMode = false;
    this.mode = this.RouteParam.snapshot.paramMap.get('mode');

    let Today:string = (new Date(Date.now() - (new Date().getTimezoneOffset() * 60.0 * 1000.0))).toISOString();
    this.DateParser = Today.substr(0, 10);
    this.TimeParser = Today.substr(11,5);
  }

  LoginRoom() {
    this.ScheduleService.GetToken(this.SearchNick, this.SearchPass).subscribe({
      error: error => {
        this.status = "WRONG PASSWORD/ROOM NAME";
        this.SearchPass = "";
      },
      next: data => {
        this.Token = data.body[0]["Token"];
        this.SelectedSched.Room = this.SearchNick;
        this.LoginMode = true;
        if (this.mode != "Add"){
          this.LoadSchedule();
        }
        this.SearchPass = "";
        this.status = "";
      }
    });
  }

  AddSchedule() {
    let time: string = ((new Date(this.DateParser + " " + this.TimeParser + ":00")).getTime()).toString();

    if (time == "NaN")  {
      this.status = "Invalid Date";
    } else if (Number.parseInt(time) < (Date.now())) {
      this.status = "Stream already finished?";
    } else if (this.SelectedSched.Link == "") {
      this.status = "Needed Link";
    } else {
      this.SelectedSched.Room = this.SearchNick;
      this.SelectedSched.Time = Number.parseInt(time);
      
      this.ScheduleService.AddSchedule(this.SelectedSched.Room, this.Token, this.SelectedSched.Link, this.SelectedSched.Note, this.SelectedSched.Tag, this.SelectedSched.Time).subscribe({
        error: error => {
          this.status = error.message;
          this.LoginMode = false;
        },
        next: data => {
          this.router.navigate(['/schedule']);
        }
      });
    }
  }

  LoadSchedule(){
    this.ScheduleService.getSchedule(this.SelectedSched.Room).subscribe(
      (response) => {
        this.ScheduleList = response.map( (e:any) => {
          if (e.Time != undefined){
            let Stamp:string = (new Date(e.Time - (new Date().getTimezoneOffset() * 60.0 * 1000.0))).toISOString();
            return ({
                LocalTimeStr: Stamp.substr(0, 10) + " " + Stamp.substr(11,5),
                ...e
            });
          } else {
            return (null);
          };
        })
    });
  }

  SetSelected(index:number) {
    this.SelectedIndex = index;
    this.SelectedSched.Link = this.ScheduleList[this.SelectedIndex].Link;
    this.SelectedSched.Time = this.ScheduleList[this.SelectedIndex].Time;
    this.SelectedSched.Note = this.ScheduleList[this.SelectedIndex].Note;
    this.SelectedSched.Tag = this.ScheduleList[this.SelectedIndex].Tag;
    this.DateParser = this.ScheduleList[this.SelectedIndex].LocalTimeStr.substr(0, 10);
    this.TimeParser = this.ScheduleList[this.SelectedIndex].LocalTimeStr.substr(11,5);
  }

  SendUpdate() {
    let time: string = ((new Date(this.DateParser + " " + this.TimeParser + ":00")).getTime()).toString();

    if (time == "NaN")  {
      this.status = "Invalid Date";
    } else if (this.SelectedSched.Link == "") {
      this.status = "Needed Link";
    } else {
      this.ScheduleService.EditSchedule(this.SelectedSched.Room, this.Token, this.SelectedSched.Link, this.SelectedSched.Note, this.SelectedSched.Tag, this.ScheduleList[this.SelectedIndex]._id).subscribe({
        error: error => {
          this.status = error.message;
          this.LoginMode = false;
        },
        next: data => {
          this.router.navigate(['/schedule']);
        }
      });
    }
  }

  RemoveSchedule() {
    if (this.SelectedIndex != -1){
      this.ScheduleService.DeleteSchedule(this.SelectedSched.Room, this.Token, this.ScheduleList[this.SelectedIndex]._id).subscribe({
        error: error => {
          this.status = error.message;
          this.LoginMode = false;
        },
        next: data => {
          this.router.navigate(['/schedule']);
        }
      });
    }
  }

}
