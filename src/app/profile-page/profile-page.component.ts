import { AppAuthService } from './../auth/app-auth.service';
import { ProfileService } from './../profile.service';
import { Profile } from './../models/profile.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReleaseService } from '../release.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private profService: ProfileService,
    private relService: ReleaseService,
    private appAuthService: AppAuthService,
    private router: Router
  ) { }
  profile: Profile;
  isLoadingProfile = false;
  isLoadingReleases = false;

  ngOnInit() {
    this.updateProfile();
  }

  updateProfile() {
    this.isLoadingProfile = true;
    this.isLoadingReleases = true;
    this.profService.getProfile(this.appAuthService.getAuthData().id).subscribe((response: any) => {
      this.profile = response.profile;
      this.relService.getReleases(this.appAuthService.getAuthData().id).subscribe(releases => {
        this.profile.releases = releases;
      });
      this.isLoadingProfile = false;
      this.isLoadingReleases = false;
    });
  }

  onEditProfile() {
    this.router.navigate(['/profile-edit']);
  }

  onNewRelease() {
    this.router.navigate(['/release-edit']);
  }


}
