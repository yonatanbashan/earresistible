import { Subscription } from 'rxjs';
import { PlayerService } from "../player.service";
import { OnInit, OnDestroy, Component, Input } from "@angular/core";
import { Song } from "../models/song.model";

import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {

  // General variables
  currentTime: string = '0';
  fullTime: string;
  isPlaying: boolean;
  // Subscription variables
  currentTimeSubscription: Subscription;
  fullTimeSubscription: Subscription;
  currentlyPlayingSubscription: Subscription;

  faPlay = faPlay;
  faPause = faPause;

  filePath = 'https://s3.amazonaws.com/earresistible-yonatan-bashan/DoIWannaKnow.mp3';
  @Input() song: Song;

  progress = "0%";
  playerWidth = 350;
  playerWidthString = this.playerWidth.toString() + 'px';
  playStarted = false;
  isPaused: boolean;

  currentTimeFormatted: string;
  fullTimeFormatted: string;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {

    this.filePath = this.song.filePath;

    this.currentlyPlayingSubscription = this.playerService.currentlyPlayingFileName.subscribe(filename => {
      if (this.filePath !== filename) {
        this.isPlaying = false;
        this.currentTime = '0';
        this.currentTimeFormatted = '0:00';
        this.progress = '0%';
      } else {
        this.isPlaying = true;
      }
    });
    this.currentTimeFormatted = this.formatTime(parseFloat(this.currentTime));
    this.currentTimeSubscription = this.playerService.currentTime.subscribe(data => {
      if (this.isPlaying) {
        this.currentTime = data;
        this.currentTimeFormatted = this.formatTime(parseFloat(this.currentTime));
        this.progress = (parseFloat(this.currentTime) / parseFloat(this.fullTime) * 100).toString() + '%';
      }
    });
    this.fullTimeSubscription = this.playerService.fullTime.subscribe(data => {
      if (this.isPlaying) {
        this.fullTime = data;
        this.fullTimeFormatted = this.formatTime(parseFloat(this.fullTime));
      }
    });
  }

  initializePlay() {
    this.playStarted = true;
    this.playerService.setPlayer(this.filePath);
  }

  toggleAudio() {
    if (!this.playStarted || !this.isPlaying) {
      this.initializePlay();
      this.isPaused = false;
    } else {
      this.isPaused = !this.isPaused;
    }
    this.playerService.toggleAudio();
  }

  stopAudio() {
    this.playerService.stopAudio();
  }

  playbackSkip(e: Event) {
    if(this.isPlaying) {
      const time = (<any>e).offsetX / this.playerWidth * parseInt(this.fullTime);
      this.playerService.playbackSkip(time);
    }
  }

  ngOnDestroy() {
    this.stopAudio();
    this.currentTimeSubscription.unsubscribe();
    this.fullTimeSubscription.unsubscribe();
    this.currentlyPlayingSubscription.unsubscribe();
  }

  formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    const minutesStr = minutes.toString();
    let secondsStr = seconds.toString();
    secondsStr = seconds < 10 ? '0' + secondsStr : secondsStr;
    return `${minutesStr}:${secondsStr}`;
  }

}
