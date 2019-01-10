import { HttpClient } from '@angular/common/http';
import { ConnectionService } from './connection.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class TagService {

  constructor(
    private connService: ConnectionService,
    private http: HttpClient
  ) {}

  serverAddress = this.connService.getServerAddress();

  mapTags = (response) => {
    return response.tags.map(tag => {
      return {
        text: tag.text,
        userId: tag.userId,
        count: tag.count,
        id: tag._id
      };
    });
  }

  getArtistsByTag(text: string, amount: number) {
    const queryParams = `?text=${text}&amount=${amount}`;
    return this.http.get(this.serverAddress + 'api/tags/artists/' + queryParams);
  }

  getTags(userId: string) {
    const queryParams = `?userId=${userId}`;
    return this.http.get(this.serverAddress + 'api/tags/all/' + queryParams)
    .pipe(map(this.mapTags));
  }

  getTopTags(amount: number) {
    const queryParams = `?amount=${amount}`;
    return this.http.get(this.serverAddress + 'api/tags/top/' + queryParams);
  }

  getUserTopTags(userId: string, amount: number) {
    const queryParams = `?userId=${userId}&amount=${amount}`;
    return this.http.get(this.serverAddress + 'api/tags/usertop/' + queryParams)
    .pipe(map(this.mapTags));
  }

  searchUserTags(userId: string, text: string, amount: number) {
    const queryParams = `?userId=${userId}&text=${text}&amount=${amount}`;
    return this.http.get(this.serverAddress + 'api/tags/search/' + queryParams)
    .pipe(map(this.mapTags));
  }

  searchTags(text: string, amount: number) {
    const queryParams = `?text=${text}&amount=${amount}`;
    return this.http.get(this.serverAddress + 'api/tags/top/' + queryParams);
  }

  getMatchingUsers(userId: string, refTagsAmount: number, maxMatches: number) {
    const queryParams = `?userId=${userId}&refTagsAmount=${refTagsAmount}&maxMatches=${maxMatches}`;
    return this.http.get(this.serverAddress + 'api/tags/similar/' + queryParams);
  }

  getMatchingProfiles(userIds: string[]) {
    const request = {
      userIds: userIds
    };
    return this.http.post(this.serverAddress + 'api/profiles/get/', request);
  }

  addTag(userId: string, text: string) {
    const request = {
      text: text,
      userId: userId
    };
    return this.http.post(this.serverAddress + 'api/tags/', request);
  }

  deleteTag(text: string) {
    const queryParams = `?text=${text}`;
    return this.http.delete(this.serverAddress + 'api/tags/' + queryParams);
  }


}
