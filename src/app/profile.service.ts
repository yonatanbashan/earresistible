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

}
