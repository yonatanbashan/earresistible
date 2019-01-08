import { AuxiliaryService } from './../auxiliary.service';
import { Subscription } from 'rxjs';
import { AppAuthService } from './../auth/app-auth.service';
import { ProfileService } from './../profile.service';
import { Profile } from './../models/profile.model';
import { AuthData } from './../models/auth-data.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReleaseService } from '../release.service';
import { shortText } from '../common/short-text';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  constructor(
    private profService: ProfileService,
    private relService: ReleaseService,
    private appAuthService: AppAuthService,
    private auxService: AuxiliaryService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  profile: Profile;
  matchingProfiles: Profile[];
  matchingUsers: AuthData[];
  isLoadingProfile = true;
  isLoadingReleases = true;
  isLoadingMatches = true;
  isMe = false;
  userId: string;
  username: string;
  authStatusSubs: Subscription;
  isAuth = false;
  bioText: string;
  shortBio: boolean = true;
  bioBtnText: string = 'Show full bio';
  maxChar = 50;

  // For similar artists
  tagNumToMatchArtists = 5;
  maxMatchedArtists = 3;

  ngOnInit() {

    this.isAuth = (this.appAuthService.getToken() !== null);

    this.authStatusSubs = this.appAuthService.getAuthStatusListener().subscribe(status => {
      this.isAuth = status;
    });

    this.route.params.subscribe((params) => {
      this.isLoadingMatches = true;
      this.username = params['username'];
      this.profService.getUserByUsername(this.username)
      .subscribe((response: any) => {
        this.userId = response.user._id;
        this.tagService.getMatchingUsers(this.userId, this.tagNumToMatchArtists, this.maxMatchedArtists).subscribe((response: any) => {
          this.matchingUsers = response.users;
          this.tagService.getMatchingProfiles(response.userIds).subscribe((response: any) => {
            this.matchingProfiles = response.profiles;
            this.isLoadingMatches = false;
          });
        });
        this.updateProfile();
        if(this.isAuth) {
          if (this.appAuthService.getAuthData().id === this.userId) {
            this.isMe = true;
          } else {
            this.isMe = false;
          }
        } else {
          this.isMe = false;
        }
      });
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

  updateProfile() {
    this.isLoadingProfile = true;
    this.isLoadingReleases = true;
    this.profService.getProfile(this.username).subscribe((response: any) => {
      this.profile = response.profile;
      this.bioText = shortText(this.profile.bio, this.maxChar);
      this.isLoadingProfile = false;
      this.relService.getReleases(this.userId).subscribe(releases => {
        this.profile.releases = releases;
        this.isLoadingReleases = false;
      });
    });
  }

  onEditProfile() {
    this.router.navigate(['/profile-edit']);
  }

  onNewRelease() {
    this.router.navigate(['/release-edit']);
  }

  onDeleteAccount() {
    this.auxService.openDialog('Delete account', 'Are you sure you want to delete your account? This action is non-reversible.').subscribe(result => {
      if(result) {
        this.isLoadingProfile = true;
        this.appAuthService.deleteMyUser();
      }
    });
  }

  toggleBio() {
    this.shortBio = !this.shortBio;
    if(this.shortBio) {
      this.bioText = shortText(this.profile.bio, this.maxChar);
      this.bioBtnText = 'Show full bio';
    } else {
      this.bioText = this.profile.bio;
      this.bioBtnText = 'Show less'
    }
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
