import { AppAuthService } from './../auth/app-auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReleaseService } from '../release.service';

@Component({
  selector: 'app-release-edit',
  templateUrl: './release-edit.component.html',
  styleUrls: ['./release-edit.component.css']
})
export class ReleaseEditComponent implements OnInit {

  constructor(
    private relService: ReleaseService
  ) { }

  releaseEditForm: FormGroup;
  types: string[];
  imagePreview: string;

  isUpdating: boolean = false;

  ngOnInit() {

    this.types = ['Album', 'EP', 'LP', 'Single', 'Compilation', 'Other'];

    this.releaseEditForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'typeSelect': new FormControl(null, Validators.required),
      'releaseImage': new FormControl(null)
    });
  }

  onSubmit() {
    const name = this.releaseEditForm.value.name;
    const type = this.releaseEditForm.value.typeSelect;
    const release = {
      name: name,
      type: type
    }

    this.isUpdating = true;
    this.relService.addRelease(release, this.releaseEditForm.value.releaseImage).subscribe((response: any) => {
        this.isUpdating = false;
    }, (error) => {
      console.log(error.error.message); // TODO: Better error handling
    });
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.releaseEditForm.patchValue({ 'releaseImage': file });
    this.releaseEditForm.get('releaseImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

}
