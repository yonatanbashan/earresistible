import { AppAuthService } from './auth/app-auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ConnectionService } from './connection.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileService } from './profile.service';
import { LoginPageComponent } from './auth/login-page/login-page.component';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileItemComponent } from './profile-page/profile-item/profile-item.component';
import { SpinnerComponent } from './spinner/spinner.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule, MatProgressSpinnerModule, MatNativeDateModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { PlayerService } from './player.service';

import { AudioContextModule } from 'angular-audio-context';

let socialConfig = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("302682943787752")
  }

]);

export function provideConfig() {
  return socialConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    NavbarComponent,
    LoginPageComponent,
    DashboardComponent,
    SignupPageComponent,
    UpdateDetailsComponent,
    ProfileEditComponent,
    ProfileItemComponent,
    SpinnerComponent,
    AudioPlayerComponent,
  ],
  imports: [
    AudioContextModule.forRoot('balanced'),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    ProfileService,
    AppAuthService,
    PlayerService,
    ConnectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
