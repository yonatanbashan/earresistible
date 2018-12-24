import { AppAuthService } from './../app-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  loginForm: FormGroup

  constructor(
    private authService: AuthService,
    private appAuthService: AppAuthService,
    private router: Router
  ) { }

  fbSubs: Subscription = new Subscription();

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
    });


    this.appAuthService.getAuthDataListener().subscribe(status => {
      if (status) {
        this.router.navigate(['/dashboard']);
      }
    });

  }

  ngOnDestroy() {
    this.fbSubs.unsubscribe();
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    this.appAuthService.login(this.loginForm.value.username, this.loginForm.value.password);
  }

  signInWithFB(): void {
    this.fbSubs = this.authService.authState.subscribe((user) => {
      this.appAuthService.login(user.email, user.authToken, true);
    });
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
