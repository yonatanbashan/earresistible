import { AppAuthService } from './../auth/app-auth.service';
import { Component, OnInit } from '@angular/core';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuth = false;
  faHeadphones = faHeadphones;

  constructor(
    private appAuthService: AppAuthService,
  ) { }

  ngOnInit() {
    this.appAuthService.getAuthStatusListener().subscribe(status => {
      this.isAuth = status;
    });
    this.appAuthService.autoAuthUser();

  }

  getUserId() {
    return this.appAuthService.getAuthData().id;
  }

  getUsername() {
    return this.appAuthService.getAuthData().username;
  }

  logout() {
    this.appAuthService.logout();
  }

}
