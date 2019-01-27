export class Genres {

  constructor() {
    this.initGenres();
    this.initSubGenres();
  }

  genres: string[];
  subGenres: Map<string, string[]>;

  private initGenres() {
    this.genres = ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Electronic', 'Classical', 'Indie', 'Folk', 'Country'].sort();
  }

  private initSubGenres() {
    this.subGenres = new Map<string, string[]>([
      ['Rock', ['Alternative Rock', 'Classic Rock', 'Punk Rock', 'Indie Rock', 'Progressive Rock', 'Pop/Rock', 'Hard Rock', 'Heavy Metal', 'Punk', 'Funk Rock']],
      ['Pop', ['Dream Pop', 'Psychedelic Pop', 'Electronic Pop', 'Dance', 'Dancehall', 'Indie Pop', 'Piano Pop', 'Pop/Rock', 'Synth-pop', 'Singer-Songwriter']],
      ['Hip Hop', ['R&B', 'Rap', 'Alternative Hip Hop', 'Alternative R&B', 'Gangsta Rap', 'Fusion Hip Hop']],
      ['Jazz', ['Cool Jazz', 'Jazz Blues', 'Modal Jazz', 'Big Band', 'Fusion', 'Smooth Jazz', 'Contemporary Jazz', 'Hard Bop', 'Avant-garde Jazz', 'Acid Jazz']],
      ['Electronic', ['Ambient', 'Dub', 'Downtempo', 'Electronica', 'Electronic Indie', 'Synth-pop', 'Trip Hop', 'Minimal', 'Trance', 'House', 'Techno', 'Vaporwave']],
      ['Classical', ['Baroque', 'Classical', 'Romantic', 'Modern', 'Avant-garde', 'Contemporary', 'Orchestral', 'Opera']],
      ['Indie', ['Indie Rock', 'Indie Folk', 'Electronic Indie', 'Indie Pop', 'Post-Grunge', 'Shoegaze', 'Singer-Songwriter', 'Psychedelic Indie', 'Garage', ]],
      ['Folk', ['Indie Folk', 'Country', 'Singer-Songwriter', 'Folk', 'Acoustic Folk', 'Psychedelic Folk', 'Ambient Folk']],
      ['Country', ['American Folk', 'German Folk', 'Country', 'Bluegrass', 'Country Rock', 'Country Pop', 'Latin Country']]
    ]);
  }

  getSubGenres(genre: string) {
    return this.subGenres.get(genre);
  }

  getGenres() {
    return this.genres;
  }

}
