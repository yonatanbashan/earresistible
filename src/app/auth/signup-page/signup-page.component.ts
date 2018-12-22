import { AppAuthService } from './../app-auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  constructor(
    private appAuthService: AppAuthService,
    private router: Router
  ) { }

  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
      'repeatPassword': new FormControl(null, Validators.required),
    });

    this.appAuthService.getAuthDataListener().subscribe(status => {
      if (status) {
        this.router.navigate(['/details']);
      }
    });

  }

  signUpWithFB() {
  }

  onSubmit() {
    this.appAuthService.addUser(this.signupForm.value.username, this.signupForm.value.password);
  }

}
