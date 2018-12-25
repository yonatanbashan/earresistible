import { PlayerService } from "../player.service";
import { OnInit, OnDestroy, Component, Input } from "@angular/core";
import { Song } from "../models/song.model";

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {

  // General variables
  song: Song;
  currentTime: string = '0';
  fullTime: string;
  isPlaying: boolean;
  // Subscription variables
  currentTimeSubscription: any;
  fullTimeSubscription: any;
  @Input() filePath = 'https://s3.amazonaws.com/earresistible-yonatan-bashan/DoIWannaKnow.mp3';

  progress = "0%";
  playerWidth = 500;
  playerWidthString = this.playerWidth.toString() + 'px';

  currentTimeFormatted: string;
  fullTimeFormatted: string;

  constructor(private _playerService: PlayerService) {
  }

  ngOnInit() {
    this.currentTimeFormatted = this.formatTime(parseFloat(this.currentTime));
    this.currentTimeSubscription = this._playerService.currentTime.subscribe(data => {
      this.currentTime = data;
      this.currentTimeFormatted = this.formatTime(parseFloat(this.currentTime));
      this.progress = (parseFloat(this.currentTime) / parseFloat(this.fullTime) * 100).toString() + '%';
    });
    this.fullTimeSubscription = this._playerService.fullTime.subscribe(
      data => {
        this.fullTime = data
        this.fullTimeFormatted = this.formatTime(parseFloat(this.fullTime));
      });
    this._playerService.setPlayer(this.filePath);
  }

  toggleAudio() {
    this.isPlaying = this._playerService.toggleAudio();
  }

  stopAudio() {
    this._playerService.stopAudio();
  }

  playbackSkip(e: Event) {
    const time = (<any>e).offsetX / this.playerWidth * parseInt(this.fullTime);
    this._playerService.playbackSkip(time);
  }

  ngOnDestroy() {
    this.stopAudio();
    this.currentTimeSubscription.unsubscribe();
    this.fullTimeSubscription.unsubscribe();
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
