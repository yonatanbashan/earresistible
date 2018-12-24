import { AuthData } from './models/auth-data.model';
import { AppAuthService } from './auth/app-auth.service';
import { ConnectionService } from './connection.service';
import { Profile } from './models/profile.model';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileService {

  constructor(
    private connService: ConnectionService,
    private http: HttpClient
  ) {}

  serverAddress = this.connService.getServerAddress();

  updateProfile(profileInfo: any) {
    const request = {
      profileInfo: profileInfo
    }
    return this.http.put(this.serverAddress + 'api/profiles/update/', request);
  }

  addEmptyProfile(authData: AuthData) {

    // TODO: Handle errors better
    if (!authData) {
      console.log('Error: user is not logged in!');
      return;
    }

    const request = {
      profile: {
        artistName: authData.username,
        imagePath: undefined,
        description: undefined,
        bio: undefined,
        locationCity: undefined,
        locationCountry: undefined,
        genre: undefined,
        subGenre: undefined,
        releases: [],
        userId: authData.id
      }
    }
    return this.http.post(this.serverAddress + 'api/profiles/add/', request);

  }


  getProfile(id: string) {

    let queryParams = `?id=${id}`
    return this.http.get(this.serverAddress + 'api/profiles/' + queryParams);

  }

  getReleases() {
    let releases = [
      {
        name: 'The Right Side',
        type: 'EP',
        imagePath: 'https://i.imgur.com/4JVWpL5.jpg',
        releaseDate: new Date(2015, 7, 25),
        items: [
          {
            name: 'Your Enemy',
            length: 235,
            filePath: ''
          },
          {
            name: 'The Right Side',
            length: 175,
            filePath: ''
          },
          {
            name: 'Time Of Me',
            length: 253,
            filePath: ''
          },
          {
            name: 'Gone',
            length: 325,
            filePath: ''
          },
          {
            name: 'People Like Us',
            length: 214,
            filePath: ''
          },
        ]
      },
      {
        name: 'The Astronaut',
        type: 'EP',
        imagePath: 'https://i.imgur.com/WOa26Rg.jpg',
        releaseDate: new Date(2019, 2, 12),
        items: [
          {
            name: 'The Astronaut',
            length: 250,
            filePath: ''
          },
          {
            name: 'Everything\'s Torn Deep Inside',
            length: 268,
            filePath: ''
          },
          {
            name: 'All The Time',
            length: 272,
            filePath: ''
          },
          {
            name: 'Stay Close',
            length: 251,
            filePath: ''
          },
          {
            name: 'Nightride',
            length: 218,
            filePath: ''
          },
        ]
      }];
    return releases;
  }
}
