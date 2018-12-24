import { Component, OnInit, Input } from '@angular/core';
import { Release } from 'src/app/models/release.model';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit {

  constructor() { }

  @Input() release: Release;

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


}
