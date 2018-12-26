import { Song } from "./song.model";

export interface Release {

  published: boolean;
  name: string;
  type: string;
  imagePath: string;
  releaseDate: Date;
  items: Song[];
  userId: string;
  id: string;

}
