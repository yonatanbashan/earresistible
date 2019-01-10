import { AuthData } from './../models/auth-data.model';
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
  profiles: Profile[] = [];
  users: AuthData[] = [];

  artistAmount = 6;
  isLoading = false;
  noMoreArtists = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tagName = params['tagName'];
      this.getArtistsByTag();
    });
  }

  getArtistsByTag() {
    this.isLoading = true;
    this.tagService.getArtistsByTag(this.tagName, this.artistAmount).subscribe((response: any) => {
      if (this.users.length >= response.users.length) {
        this.noMoreArtists = true;
      } else {
        this.noMoreArtists = false;
      }
      this.users = response.users;
      this.profiles = response.profiles;
      this.isLoading = false;
    });
  }

  onLoadMore() {
    this.artistAmount += 2;
    this.getArtistsByTag();
  }

}
