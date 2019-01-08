import { AuthData } from './../models/auth-data.model';
import { Release } from './../models/release.model';
import { AppAuthService } from './../auth/app-auth.service';
import { ReleaseService } from './../release.service';
import { TagService } from './../tag.service';
import { ProfileService } from './../profile.service';
import { Component, OnInit } from '@angular/core';
import { Profile } from '../models/profile.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private appAuthService: AppAuthService,
    private profService: ProfileService,
    private tagService: TagService,
    private relService: ReleaseService
  ) { }

  isLoadingProfile = true;
  isLoadingReleases = true;
  isLoadingMatches = true;
  profile: Profile;
  releases: Release[];
  userId: string;
  matchingUsers: AuthData[];
  matchingProfiles: Profile[];

  tagNumToMatchArtists = 7;
  maxMatchedArtists = 5;

  ngOnInit() {
    this.userId = this.appAuthService.getAuthData().id;
    this.profService.getProfile(this.appAuthService.getAuthData().username).subscribe((response: any) => {
      this.profile = response.profile;
      this.isLoadingProfile = false;
    });
    this.relService.getReleases(this.userId).subscribe(releases => {
      this.releases = releases;
      this.isLoadingReleases = false;
    });
    this.tagService.getMatchingUsers(this.userId, this.tagNumToMatchArtists, this.maxMatchedArtists).subscribe((response: any) => {
      this.matchingUsers = response.users;
      this.tagService.getMatchingProfiles(response.userIds).subscribe((response: any) => {
        this.matchingProfiles = response.profiles;
        this.isLoadingMatches = false;
      });
    });

  }


  getPreviewText(profile: Profile) {
    let profileText = '';
    if(profile.genre) {
      profileText += `${profile.genre}`;
    }
    if(profile.locationCountry) {
      profileText += `, ${profile.locationCountry}`;
    }

    return profileText;
  }

}
