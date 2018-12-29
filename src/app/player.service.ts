import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class PlayerService {

  audio: any;
  currentTime: Subject<string> = new Subject<string>();
  fullTime: Subject<string> = new Subject<string>();
  currentlyPlayingFileName: Subject<string> = new Subject<string>();
  playStarted: boolean= false;


  constructor() {}

  setPlayer(audioFile: string) {
    if(!this.playStarted) {
      this.playStarted = true;
    } else {
      this.audio.pause();
      this.audio = null;
    }
    this.currentlyPlayingFileName.next(audioFile);
    this.audio = new Audio(audioFile);
    this.audio.oncanplaythrough = () => {
      this.fullTime.next(this.audio.duration);
    };
    this.audio.ontimeupdate = () => {
      this.currentTime.next(this.audio.currentTime);
    };
    this.audio.pause();
  }

  playbackSkip(time: number) {
    this.audio.currentTime = time;
  }

  stopAudio() {
    if(this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  toggleAudio() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }

    return this.audio.paused;
  }

}
