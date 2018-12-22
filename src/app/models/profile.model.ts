import { Release } from './release.model';
import { GenreData } from './genre-data.model';
import { LocationData } from './location-data.model';
import { AuthData } from './auth-data.model';
export interface Profile {

  authData: AuthData;
  artistName: string;
  imagePath: string;
  description: string;
  bio: string;
  location: LocationData;
  genre: GenreData;
  releases: Release[];

}
