import { AuthData } from './models/auth-data.model';
import { ConnectionService } from './connection.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileService {

  constructor(
    private connService: ConnectionService,
    private http: HttpClient
  ) {}

  serverAddress = this.connService.getServerAddress();

  deleteUserImage() {
    const queryParams = '?field=photo';
    return this.http.delete(this.serverAddress + 'api/profiles/' + queryParams)
  }

  updateProfile(profileInfo: any, image: File = null) {

    let profileData = new FormData();
    if(image !== null && image !== undefined) {
      profileData.append("image", image);
    }

    profileData.append("artistName", profileInfo.artistName);
    profileData.append("description", profileInfo.description);
    profileData.append("bio", profileInfo.bio);
    profileData.append("locationCountry", profileInfo.locationCountry);
    profileData.append("locationCity", profileInfo.locationCity);
    profileData.append("genre", profileInfo.genre);
    profileData.append("subGenre", profileInfo.subGenre);

    if(profileInfo.imagePath !== undefined) {
      profileInfo.append("imagePath", profileInfo.imagePath);
    }

    return this.http.put(this.serverAddress + 'api/profiles/update/', profileData)

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
        userId: authData.id
      }
    }
    return this.http.post(this.serverAddress + 'api/profiles/add/', request);

  }

  getUserByUsername(username: string) {

    return this.http.get(this.serverAddress + 'api/users/user/' + username);

  }


  getProfile(param: string, isUsername = true) {

    let queryParams;
    if(isUsername) {
      queryParams = `?username=${param}`
    } else {
      queryParams = `?id=${param}`
    }
    return this.http.get(this.serverAddress + 'api/profiles/' + queryParams);

  }


  getReleases() {
    let releases = [
      {
        userId: 'blabla',
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
        userId: 'blabla',
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
