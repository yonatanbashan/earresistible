import { ProfileService } from './../profile.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  constructor(
    private profService: ProfileService,
    private router: Router
  ) { }

  profileEditForm: FormGroup;
  genres: string[];
  countries: string[];
  currentSubGenres: string[];
  isOtherGenre: boolean = false;

  subGenres: Map<string, string[]>;


  ngOnInit() {
    this.profileEditForm = new FormGroup({
      'artistName': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'bio': new FormControl(null),
      'countrySelect': new FormControl(null),
      'city': new FormControl(null),
      'genreSelect': new FormControl(null),
      'otherGenre': new FormControl(null),
      'otherSubGenre': new FormControl(null),
      'subGenreSelect': new FormControl(null)
    });

    this.genres = ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Electronic', 'Classical', 'Indie', 'Folk', 'Country'].sort();

    this.subGenres = new Map<string, string[]>([
      ['Rock', ['Alternative Rock', 'Punk Rock', 'Indie Rock', 'Progressive Rock', 'Pop/Rock', 'Hard Rock', 'Heavy Metal', 'Punk', 'Funk Rock']],
      ['Pop', ['Dream Pop', 'Psychedelic Pop', 'Electronic Pop', 'Dance', 'Dancehall', 'Indie Pop', 'Piano Pop', 'Pop/Rock', 'Synth-pop', 'Singer-Songwriter']],
      ['Hip Hop', ['R&B', 'Rap', 'Alternative Hip Hop', 'Alternative R&B', 'Gangsta Rap', 'Fusion Hip Hop']],
      ['Jazz', ['Cool Jazz', 'Jazz Blues', 'Modal Jazz', 'Big Band', 'Fusion', 'Smooth Jazz', 'Contemporary Jazz', 'Hard Bop', 'Avant-garde Jazz', 'Acid Jazz']],
      ['Electronic', ['Ambient', 'Dub', 'Downtempo', 'Electronica', 'Electronic Indie', 'Synth-pop', 'Trip Hop', 'Minimal', 'Trance', 'House', 'Techno', 'Vaporwave']],
      ['Indie', ['Indie Rock', 'Indie Folk', 'Electronic Indie', 'Indie Pop', 'Post-Grunge', 'Shoegaze', 'Singer-Songwriter', 'Psychedelic Indie', 'Garage', ]],

    ]);

    // TODO: Get real list
    this.countries = ['Israel', 'USA', 'UK', 'Germany', 'Japan', 'Mexico', 'Spain', 'Turkey'].sort();

  }

  onSelectGenre(e: Event) {
    console.log('###: ' + this.profileEditForm.value.genreSelect);
    this.currentSubGenres = this.subGenres.get(this.profileEditForm.value.genreSelect);
    if (this.profileEditForm.value.genreSelect.includes('Other')) {
      this.isOtherGenre = true;
    } else {
      this.currentSubGenres = this.currentSubGenres.sort();
      this.isOtherGenre = false;
    }
  }

  onSubmit() {
    let genre, subGenre;
    if (this.isOtherGenre) {
      genre = this.profileEditForm.value.otherGenre;
      subGenre = this.profileEditForm.value.otherSubGenre;
    } else {
      genre = this.profileEditForm.value.genreSelect;
      subGenre = this.profileEditForm.value.subGenreSelect;
    }

    const profile = {
      artistName: this.profileEditForm.value.artistName,
      description: this.profileEditForm.value.description,
      bio: this.profileEditForm.value.bio,
      locationCountry: this.profileEditForm.value.countrySelect,
      locationCity: this.profileEditForm.value.city,
      genre: genre,
      subGenre: subGenre,
    }

    this.profService.updateProfile(profile)
    .subscribe((response) => {
      this.router.navigate(['/dashboard']);
    }, (error) => {
      console.log(error.error.message); // TODO: Better error handling
    });

  }

}
