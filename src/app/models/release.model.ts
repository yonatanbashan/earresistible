import { Song } from "./song.model";

export interface Release {

  name: string;
  type: string;
  imagePath: string;
  releaseDate: Date;
  items: Song[];

}