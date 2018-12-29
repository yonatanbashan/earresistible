import { AuxiliaryService } from './../../auxiliary.service';
import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';
import { AppAuthService } from './../../auth/app-auth.service';
import { ReleaseService } from './../../release.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Release } from 'src/app/models/release.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Song } from 'src/app/models/song.model';
import { MatDialog } from '@angular/material';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private appAuthService: AppAuthService,
    private relService: ReleaseService,
    public auxService: AuxiliaryService,
    private router: Router,
  ) { }

  faTrash = faTrash;

  authStatusSubs: Subscription;
  isAuth: boolean = false;
  isLoadingSongs = true;

  @Input() release: Release;
  @Output('itemUpdated') itemUpdated: EventEmitter<string> = new EventEmitter<string>();
  isMe = false;

  ngOnInit() {

    this.isLoadingSongs = true;
    if (this.release.id) {
      this.relService.getReleaseSongs(this.release.id)
      .subscribe((songs: Song[]) => {
        this.isLoadingSongs = false;
        this.release.items = songs;
      });
    }

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
    this.auxService.openDialog('Delete release', `${song.name}: Are you sure you want to delete this song?`).subscribe((result: boolean) => {
    if(result) {
      this.isLoadingSongs = true;
      this.relService.deleteSong(song).subscribe(() => {
        this.itemUpdated.emit('update');
        this.isLoadingSongs = false;
      });
    }
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
    this.auxService.openDialog('Delete release', `${release.name}: Are you sure you want to delete this release?`).subscribe((result: boolean) => {
      if(result) {
        this.relService.deleteRelease(release).subscribe(response => {
          this.itemUpdated.emit('update');
        });
      }
    });
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
