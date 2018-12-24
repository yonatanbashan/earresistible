import { AppAuthService } from './../auth/app-auth.service';
import { ProfileService } from './../profile.service';
import { Profile } from './../models/profile.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private profileService: ProfileService,
    private appAuthService: AppAuthService,
    private router: Router
  ) { }
  profile: Profile;
  isLoadingProfile = false;
  isLoadingReleases = false;

  ngOnInit() {

    this.isLoadingProfile = true;
    this.isLoadingReleases = true;
    this.profileService.getProfile(this.appAuthService.getAuthData().id).subscribe((response: any) => {
      this.profile = response.profile;
      this.profile.releases = this.profileService.getReleases();
      this.isLoadingProfile = false;
      this.isLoadingReleases = false;
    });

  }

  onEditProfile() {
    this.router.navigate(['/profile-edit']);
  }


}
