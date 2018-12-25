import { AuthReverseGuard } from './auth/auth-reverse.guard';
import { AuthGuard } from './auth/auth.guard';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';


const appRoutes: Routes = [
  { path: 'player', component: AudioPlayerComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'details', component: UpdateDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [AuthReverseGuard] },
  { path: 'signup', component: SignupPageComponent, canActivate: [AuthReverseGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthReverseGuard]
})
export class AppRoutingModule {

}
