import { Profile } from './../models/profile.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.css']
})
export class TagViewComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private tagService: TagService
    ) { }

  tagName: string = '';
  profiles: Profile[];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tagName = params['tagName'];
      this.getTagArtists();
    });
  }

  getTagArtists() {

  }

}
