import { AppAuthService } from './../../auth/app-auth.service';
import { ReleaseService } from './../../release.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Release } from 'src/app/models/release.model';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit {

  constructor(
    private appAuthService: AppAuthService,
    private relService: ReleaseService
  ) { }

  @Input() release: Release;
  @Output() itemUpdated = new EventEmitter<string>();

  ngOnInit() {
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

}
