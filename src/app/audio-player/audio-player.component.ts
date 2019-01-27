import { Subscription } from 'rxjs';
import { PlayerService } from "../player.service";
import { OnInit, OnDestroy, Component, Input } from "@angular/core";
import { Song } from "../models/song.model";

import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { ReleaseService } from '../release.service';

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
  timePlayed: number;
  timeStarted: number;
  willIncPlays: boolean = false;
  songFragmentToIncPlays = 0.1;

  currentTimeFormatted: string;
  fullTimeFormatted: string;

  constructor(private playerService: PlayerService,
    private relService: ReleaseService) {
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
        if(this.willIncPlays) {
          this.checkIncrementPlays();
        }
        this.currentTime = data;
        this.currentTimeFormatted = this.formatTime(parseFloat(this.currentTime));
        this.updateProgress();
        if(this.currentTime === this.fullTime) {
          this.isPaused = true;
        }
      }
    });
    this.fullTimeSubscription = this.playerService.fullTime.subscribe(data => {
      if (this.isPlaying) {
        this.fullTime = data;
        this.fullTimeFormatted = this.formatTime(parseFloat(this.fullTime));
      }
    });
  }

  updateProgress() {
    this.progress = (parseFloat(this.currentTime) / parseFloat(this.fullTime) * 100).toString() + '%';
  }

  initializePlay() {
    this.playStarted = true;
    this.playerService.setPlayer(this.filePath);
    this.willIncPlays = true;
  }

  toggleAudio() {
    if (!this.playStarted || !this.isPlaying) {
      this.initializePlay();
      this.isPaused = false;
      this.timeStarted =  parseInt(this.currentTime);
    } else {
      this.isPaused = !this.isPaused;
    }
    this.playerService.toggleAudio();
  }

  checkIncrementPlays() {
    this.timePlayed = parseInt(this.currentTime) - this.timeStarted;
      if(this.timePlayed > parseInt(this.fullTime) * this.songFragmentToIncPlays) {
        this.willIncPlays = false;
        if (this.song.id) {
          this.relService.incSongPlays(this.song.id).subscribe((response: any) => {
            this.song = response.song;
          });
        }
      }
  }

  stopAudio() {
    this.playerService.stopAudio();
    this.willIncPlays = false;
  }

  playbackSkip(e: Event) {
    if(this.isPlaying) {
      if ((<any>e).toElement.offsetWidth < 20) { // To avoid clicking the progress line itself
        return;
      }
      const time = (<any>e).offsetX / (<any>e).toElement.offsetWidth * parseInt(this.fullTime);
      this.playerService.playbackSkip(time);
      this.timeStarted = time;
      this.updateProgress();
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
