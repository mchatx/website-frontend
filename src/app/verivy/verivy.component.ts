import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verivy',
  templateUrl: './verivy.component.html',
  styleUrls: ['./verivy.component.scss']
})
export class VerivyComponent implements OnInit {
  Token: string | null = "";
  status: string = "";

  constructor(
    private AccService: AccountService,
    private RouteParam: ActivatedRoute,
    private Router: Router
  ) { }

  ngOnInit(): void {
    this.Token = this.RouteParam.snapshot.paramMap.get('token');
    if (this.Token!= null){
      this.status = "Verivying account...";
      this.AccService.PostVerivy(this.Token).subscribe({
        error: error => {
          setTimeout(() => {
            this.Router.navigate(['']);
          }, 5000);
          this.status = "UNABLE TO PROCESS TOKEN.";
        },
        next: data => {
          setTimeout(() => {
            this.Router.navigate(['']);
          }, 5000);
          this.status = "ACCOUNT VERIVIED. REDIRECTING...";
        }
      });      
    } else {
      this.Router.navigate(['']);
    }
  }

}
