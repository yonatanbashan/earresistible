import { AppAuthService } from './../../auth/app-auth.service';
import { ReleaseService } from './../../release.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Release } from 'src/app/models/release.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Song } from 'src/app/models/song.model';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private appAuthService: AppAuthService,
    private relService: ReleaseService,
    private router: Router,
  ) { }

  authStatusSubs: Subscription;
  isAuth: boolean = false;
  isLoadingSongs = true;

  @Input() release: Release;
  @Output('itemUpdated') itemUpdated: EventEmitter<string> = new EventEmitter<string>();
  isMe = false;

  ngOnInit() {

    this.isLoadingSongs = true;
    this.relService.getReleaseSongs(this.release)
    .subscribe((songs: Song[]) => {
      this.isLoadingSongs = false;
      this.release.items = songs;
    });

    this.isAuth = (this.appAuthService.getToken() !== null);

    this.updateMeStatus();
    this.authStatusSubs = this.appAuthService.getAuthStatusListener().subscribe(status => {
      this.isAuth = status;
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

  ngOnChanges() {
    this.updateMeStatus();
  }

  deleteSong(song: Song) {
    this.isLoadingSongs = true;
    this.relService.deleteSong(song).subscribe(() => {
      this.itemUpdated.emit('update');
      this.isLoadingSongs = false;
    });
  }

  updateMeStatus() {
    if (this.isAuth) {
      this.isMe = (this.release.userId === this.appAuthService.getAuthData().id) ? true : false;
    } else {
      this.isMe = false;
    }
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

  removeRelease(release: Release) {
    if(confirm(`Are you sure you want to delete '${release.name}'?`)) {
      this.relService.deleteRelease(release).subscribe(response => {
        this.itemUpdated.emit('update');
      });
    }
  }

  publishRelease(release: Release) {
    this.relService.publishRelease(release).subscribe(response => {
      this.itemUpdated.emit('update');
    });
    this.release.published = true;
  }

  onAddSong(release: Release) {
    this.router.navigate(['/add-song', release.id])
  }

}
