import { HomeComponent } from './home/home.component';
import { AddSongComponent } from './add-song/add-song.component';
import { ReleaseEditComponent } from './release-edit/release-edit.component';
import { AuthReverseGuard } from './auth/auth-reverse.guard';
import { AuthGuard } from './auth/auth.guard';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TagViewComponent } from './tag-view/tag-view.component';


const appRoutes: Routes = [
  { path: 'player', component: AudioPlayerComponent },
  { path: 'profile/:username', component: ProfilePageComponent },
  { path: 'profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'release-edit', component: ReleaseEditComponent, canActivate: [AuthGuard] },
  { path: 'add-song/:releaseId', component: AddSongComponent, canActivate: [AuthGuard] },
  { path: 'details', component: UpdateDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [AuthReverseGuard] },
  { path: 'signup', component: SignupPageComponent, canActivate: [AuthReverseGuard] },
  { path: 'tag/:tagName', component: TagViewComponent},
  { path: 'home', component: HomeComponent },
  { path: 'not-found', component: ErrorPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: ':other', redirectTo: 'not-found', pathMatch: 'prefix' },
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthReverseGuard]
})
export class AppRoutingModule {

}
