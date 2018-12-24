import { FacebookLoginProvider } from 'angularx-social-login';
import { AuthService } from 'angularx-social-login';
import { AppAuthService } from './../app-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private appAuthService: AppAuthService,
    private router: Router
  ) { }

  signupForm: FormGroup;
  fbSubs: Subscription = new Subscription();

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'repeatPassword': new FormControl(null, Validators.required),
    });

    this.appAuthService.getAuthDataListener().subscribe(status => {
      if (status) {
        this.router.navigate(['/details']);
      }
    });

  }

  ngOnDestroy() {
    this.fbSubs.unsubscribe();
  }

  signUpWithFB() {
    this.fbSubs = this.authService.authState.subscribe((user) => {
      this.appAuthService.addUser(user.email, user.authToken, true);
    });
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  onSubmit() {
    this.appAuthService.addUser(this.signupForm.value.username, this.signupForm.value.password);
  }

  formValid() {
    if (this.signupForm.value.password !== this.signupForm.value.repeatPassword) {
      return false;
    }

    return true;

  }

}
