import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DocsComponent } from './docs/docs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NewRoomComponent } from './new-room/new-room.component'
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleEditComponent } from './schedule-edit/schedule-edit.component'
import { ArchiveComponent } from './archive/archive.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },
  { path: '', component: HomeComponent },
  { path: 'roomapply', component: NewRoomComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'schededit/:mode', component: ScheduleEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
