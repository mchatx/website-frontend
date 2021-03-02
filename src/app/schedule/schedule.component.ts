import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import ScheduleData from '../models/Schedule';
import ScheduleDisplay from '../models/ScheduleDisplay';

//  TO DIVIDE THE SCHEDULE DEPENDING ON THE DAYS BASED ON LOCAL TIME
type Pager = { 
  Timestamp : string,
  DataList : ScheduleDisplay[]
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  SchedulePage: Pager[] = [];   //  DIVIDE SCHEDULE INTO PAGES BASED ON LOCAL TIME DAY

  constructor( private SService: ScheduleService ) { }

  ngOnInit(): void {
    this.SService.getSchedule().subscribe(
      (response) => {
        this.PopulatePager(response); // PARSE AND DIVIDE THE INCOMING RESPONSE INTO PAGES
      }
    )
  }

  PopulatePager(Data: ScheduleData[]): void {
    let Startnum:number = Date.now() - ((new Date()).getHours() + 24) * 3600 * 1000 - (new Date()).getMinutes() * 60 * 1000;
    
    let index:number = -1;
    let created:boolean = false;

    Data.map( e => {
      if (e.Time != undefined){
        while (e.Time > Startnum)
        {
          created = false;
          Startnum += 24*3600*1000;
        }
  
        if (created == false) {
          let Stamp:string = (new Date(Startnum - ((new Date().getTimezoneOffset() + 24.0 * 60.0) * 60.0 * 1000.0))).toISOString();
          this.SchedulePage.push({
            Timestamp: Stamp.substr(0, 10),
            DataList: [],
          });
          created = true;
          index++;
        }

        let Stamp:string = (new Date(e.Time - (new Date().getTimezoneOffset() * 60.0 * 1000.0))).toISOString();
        this.SchedulePage[index].DataList.push ({
          Room: e.Room,
          Link: e.Link,
          Note: e.Note,
          Time: Stamp.substr(0, 10) + " " + Stamp.substr(11, 5),
          Tag: e.Tag
        });
      }
    });
  }
}
