import { AppAuthService } from './auth/app-auth.service';
import { ConnectionService } from './connection.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { dateFormat } from './common/date-formatter';
import { Subscription, Observable } from 'rxjs';
import { Release } from './models/release.model';

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
        id: release._id
      };
    });
  }


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

  deleteRelease(release: Release) {
    const queryParams = `?releaseId=${release.id}`
    return this.http.delete(this.serverAddress + 'api/releases/' + queryParams);
  }


}
