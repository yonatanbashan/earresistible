import { AppAuthService } from './../app-auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private authService: AuthService,
    private appAuthService: AppAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
    });

    this.authService.authState.subscribe((user) => {
      // TODO: implement auth with Facebook
      //console.log(user);
      //this.appAuthService.login(this.loginForm.value.username, this.loginForm.value.password);
    });

    this.appAuthService.getAuthDataListener().subscribe(status => {
      if (status) {
        this.router.navigate(['/dashboard']);
      }
    });

  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    this.appAuthService.login(this.loginForm.value.username, this.loginForm.value.password);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
