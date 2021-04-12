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
import { ArchiveEditComponent } from './archive-edit/archive-edit.component';
import { LoginComponent } from './login/login.component';
import { VerivyComponent } from './verivy/verivy.component';
import { SignupComponent } from './signup/signup.component';
import { RestartpassComponent } from './restartpass/restartpass.component';
import { AccountpageComponent } from './accountpage/accountpage.component';
import { TestingGroundComponent } from './testing-ground/testing-ground.component'

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'docs', component: DocsComponent },
  //{path: 'docs', loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)} Lazy loading need more work first
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },
  { path: '', component: HomeComponent },
  { path: 'roomapply', component: NewRoomComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'schededit/:mode', component: ScheduleEditComponent },
  { path: 'verivy/:token', component: VerivyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'restart-pass', component: RestartpassComponent },
  { path: 'account', component: AccountpageComponent },
  { path: 'archiveedit', component: ArchiveEditComponent },
  { path: 'test', component: TestingGroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
