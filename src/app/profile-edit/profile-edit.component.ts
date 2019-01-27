import { AppAuthService } from './../auth/app-auth.service';
import { ProfileService } from './../profile.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { HttpClient } from '@angular/common/http';
import { Genres } from '../common/genres';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  constructor(
    private profService: ProfileService,
    private appAuthService: AppAuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  isLoading: boolean = false;
  isDeletingImage: boolean = false;
  isUpdating: boolean = false;

  profileEditForm: FormGroup;
  genres: string[];
  countries: string[];
  currentSubGenres: string[];
  isOtherGenre: boolean = false;
  imagePreview: string;
  genresInst: Genres;

  subGenres: Map<string, string[]>;


  ngOnInit() {

    this.getCountries();
    this.genresInst = new Genres();

    this.route.params.subscribe(params => {
      if (!params['empty']) {
        this.isLoading = true;
        this.profService.getProfile(this.appAuthService.getAuthData().username)
        .subscribe((response: any) => {
          const profile = response.profile;
          this.populateForm(profile);
          this.isLoading = false;
        });
      }
    });

    this.profileEditForm = new FormGroup({
      'artistName': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'bio': new FormControl(null),
      'countrySelect': new FormControl(null),
      'city': new FormControl(null),
      'genreSelect': new FormControl(null),
      'otherGenre': new FormControl(null),
      'otherSubGenre': new FormControl(null),
      'subGenreSelect': new FormControl(null),
      'userImage': new FormControl(null)
    });

    this.genres = this.genresInst.getGenres();


    // Initial list before going to API
    this.countries = ['Israel', 'USA', 'UK', 'Germany', 'Japan', 'Mexico', 'Spain', 'Turkey'].sort();

    this.http.get('https://restcountries.eu/rest/v2/all').subscribe((responseArray: any) => {
      this.countries = [];
      responseArray.forEach(element => {
        if(element.name.length > 20) {
          this.countries.push(element.nativeName);
        } else {
          this.countries.push(element.name);
        }
      });
    })

  }

  // Once the profile data has arrived, need to populate the form
  populateForm(profile: any) {
    this.profileEditForm.patchValue({
      artistName: profile.artistName,
      description: profile.description,
      bio: profile.bio,
      countrySelect: profile.locationCountry,
      city: profile.locationCity,
    });

    if (this.genres.includes(profile.genre)) {
      this.isOtherGenre = false;
      this.currentSubGenres = this.genresInst.getSubGenres(profile.genre);
      this.profileEditForm.patchValue({
        genreSelect: profile.genre,
        subGenreSelect: profile.subGenre
      });
    } else {
      this.isOtherGenre = true;
      this.profileEditForm.patchValue({
        genreSelect: 'Other',
        otherGenre: profile.genre,
        otherSubGenre: profile.subGenre
      });
    }
    this.imagePreview = profile.imagePath;
  }

  onSelectGenre(e: Event) {
    this.currentSubGenres = this.genresInst.getSubGenres(this.profileEditForm.value.genreSelect);
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

    let description = this.profileEditForm.value.description;
    let bio = this.profileEditForm.value.bio;
    let locationCountry = this.profileEditForm.value.countrySelect;
    let locationCity = this.profileEditForm.value.city;

    genre = (genre === null) ? '' : genre;
    subGenre = (subGenre === null) ? '' : subGenre;
    bio = (bio === null) ? '' : bio;
    description = (description === null) ? '' : description;
    locationCountry = (locationCountry === null) ? '' : locationCountry;
    locationCity = (locationCity === null) ? '' : locationCity;

    const profile = {
      artistName: this.profileEditForm.value.artistName,
      description: description,
      bio: bio,
      locationCountry: locationCountry,
      locationCity: locationCity,
      genre: genre,
      subGenre: subGenre,
    }

    this.isUpdating = true;
    this.profService.updateProfile(profile, this.profileEditForm.value.userImage)
    .subscribe((response) => {
      this.isUpdating = false;
      this.router.navigate(['/profile', this.appAuthService.getAuthData().username]);
    }, (error) => {
      console.log(error.error.message); // TODO: Better error handling
    });

  }

  getCountries() {
    // TODO
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.profileEditForm.patchValue({ 'userImage': file });
    this.profileEditForm.get('userImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onDeleteImage() {
    this.isDeletingImage = true;
    this.profService.deleteUserImage()
    .subscribe(response => {
      this.ngOnInit();
      this.isDeletingImage = false;
      this.imagePreview = '';
      this.profileEditForm.patchValue({ 'userImage': null });
    });
  }

}
