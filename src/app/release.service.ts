import { AppAuthService } from './auth/app-auth.service';
import { ConnectionService } from './connection.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { dateFormat } from './common/date-formatter';
import { Subscription, Observable } from 'rxjs';
import { Release } from './models/release.model';
import { Song } from './models/song.model';

@Injectable()
export class ReleaseService {

  constructor(
    private connService: ConnectionService,
    private appAuthService: AppAuthService,
    private http: HttpClient
  ) {}

  serverAddress = this.connService.getServerAddress();

  mapReleases = (response) => {
    return response.releases.map(release => {
      return {
        name: release.name,
        type: release.type,
        imagePath: release.imagePath,
        releaseDate: dateFormat(new Date(release.releaseDate), {dateOnly: true}),
        items: release.items,
        userId: release.userId,
        published: release.published,
        id: release._id
      };
    });
  }

  mapSongs = (response) => {
    return response.songs.map(song => {
      return {
        name: song.name,
        filePath: song.filePath,
        plays: song.plays,
        id: song._id
      };
    });
  }

  // Get a single release by ID
  getRelease(releaseId: string) {
    const queryParams = `?id=${releaseId}`;
    return this.http.get(this.serverAddress + 'api/releases/get/' + queryParams)
    .pipe(map(this.mapReleases));
  }


  // Get all the user's releases
  getReleases(id: string) {
    const queryParams = `?userId=${id}`;
    return this.http.get(this.serverAddress + 'api/releases/user/' + queryParams)
    .pipe(map(this.mapReleases));
  }

  addRelease(releaseInfo: any, image: File = null) {

    let releaseData = new FormData();
    if(image !== null && image !== undefined) {
      releaseData.append("image", image);
    }

    releaseData.append("name", releaseInfo.name);
    releaseData.append("type", releaseInfo.type);

    if(releaseInfo.imagePath !== undefined) {
      releaseInfo.append("imagePath", releaseInfo.imagePath);
    }

    return this.http.post(this.serverAddress + 'api/releases/add/', releaseData);

  }

  addSong(release: Release, song: any, songFile: File = null) {
    let songData = new FormData();

    songData.append("song", songFile);
    songData.append("name", song.name);
    songData.append("releaseName", release.name)
    songData.append("releaseId", release.id)


    return this.http.post(this.serverAddress + 'api/songs/add/', songData);

  }

  getReleaseSongs(release: Release) {
    const queryParams = `?releaseId=${release.id}&userId=${release.userId}`;
    return this.http.get(this.serverAddress + 'api/songs/release/' + queryParams)
    .pipe(map(this.mapSongs));
  }

  deleteSong(song: Song) {
    const queryParams = `?songId=${song.id}`;
    return this.http.delete(this.serverAddress + 'api/songs/' + queryParams);
  }


  publishRelease(release: Release) {
    const request = {
      id: release.id
    }
    return this.http.put(this.serverAddress + 'api/releases/publish/', request);
  }

  deleteRelease(release: Release) {
    const queryParams = `?releaseId=${release.id}`
    return this.http.delete(this.serverAddress + 'api/releases/' + queryParams);
  }


}
