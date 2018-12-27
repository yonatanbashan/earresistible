import { AppAuthService } from './../auth/app-auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Release } from '../models/release.model';
import { ReleaseService } from '../release.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private relService: ReleaseService,
    private appAuthService: AppAuthService,
  ) { }

  release: Release;
  releaseId: string;
  isLoading = true;
  isUploading = false;
  filePicked = null;

  addSongForm: FormGroup;

  ngOnInit() {


    this.addSongForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'songFile': new FormControl(null),
    });


    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.releaseId = params['releaseId'];
      this.relService.getRelease(this.releaseId)
      .subscribe((releases: any) => {
        this.isLoading = false;
        this.release = releases[0]; // Result is coming as an array with single item
      });
    });
  }

  onFilePicked() {
    const file = (event.target as HTMLInputElement).files[0];
    this.filePicked = file;
    this.addSongForm.patchValue({ 'songFile': file });
    this.addSongForm.get('songFile').updateValueAndValidity();
  }

  onSubmit() {
    const name = this.addSongForm.value.name;
    const song = {
      name: name,
    }

    this.isUploading = true;
    this.relService.addSong(this.release, song, this.addSongForm.value.songFile).subscribe((response: any) => {
        this.isUploading = false;
        this.router.navigate(['/profile', this.appAuthService.getAuthData().username]);
    });
  }

}
