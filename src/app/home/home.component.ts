import { AppAuthService } from './../auth/app-auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private appAuthService: AppAuthService
  ) { }

  isAuth: boolean = false;

  ngOnInit() {
    if(this.appAuthService.getToken()) {
      this.isAuth = true;
    }
  }

}
