import { ProfileService } from './../profile.service';
import { Song } from './../models/song.model';
import { Profile } from './../models/profile.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private profileService: ProfileService
  ) { }
  profile: Profile;

  ngOnInit() {

    this.profile = this.profileService.getProfile();
  }

  getLengthStr(length: number) {
    const minutes = Math.floor(length/60);
    const seconds = length % 60;
    let secondsStr;
    if (seconds < 10) {
      secondsStr = '0' + seconds;
    } else {
      secondsStr = seconds;
    }
    return `${minutes}:${secondsStr}`;
  }



}
