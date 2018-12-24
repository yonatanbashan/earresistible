import { Release } from './release.model';
import { AuthData } from './auth-data.model';
export interface Profile {

  authData: AuthData;
  artistName: string;
  imagePath: string;
  description: string;
  bio: string;
  locationCity: string;
  locationCountry: string;
  genre: string;
  subGenre: string;
  releases: Release[];

}
