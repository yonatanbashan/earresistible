import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class PlayerService {

  private audio: any;
  public currentTime: Subject<string> = new Subject<string>();
  public fullTime: Subject<string> = new Subject<string>();


  constructor() {}

  setPlayer(audioFile: string) {
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
    this.audio.pause();
    this.audio.currentTime = 0;
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
