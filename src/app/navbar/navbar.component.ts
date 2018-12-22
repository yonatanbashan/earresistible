import { AppAuthService } from './../auth/app-auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuth = false;

  constructor(
    private appAuthService: AppAuthService
  ) { }

  ngOnInit() {
    this.appAuthService.getAuthStatusListener().subscribe(status => {
      this.isAuth = status;
    });
    this.appAuthService.autoAuthUser();

  }

  logout() {
    this.appAuthService.logout();
  }

}
