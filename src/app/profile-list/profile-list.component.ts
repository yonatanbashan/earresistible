import { Profile } from './../models/profile.model';
import { AuthData } from './../models/auth-data.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {

  constructor() { }
  @Input() users: AuthData[];
  @Input() profiles: Profile[];

  ngOnInit() {
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
