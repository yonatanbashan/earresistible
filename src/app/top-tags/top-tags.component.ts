import { ActivatedRoute } from '@angular/router';
import { OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Tag } from './../models/tag.model';
import { Component, OnInit } from '@angular/core';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-top-tags',
  templateUrl: './top-tags.component.html',
  styleUrls: ['./top-tags.component.css']
})
export class TopTagsComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
    private tagService: TagService,
    private route: ActivatedRoute,
  ) { }

  tags: {text: string, count: number}[] = [];
  tagForm: FormGroup;

  maxTagCount: number;
  largestTag: number;
  largestTagSize = 2.5;

  tagAmount = 25;
  isLoadingTags: boolean = false;

  searchSubscription: Subscription;

  ngOnInit() {
    this.getTags();
    this.tagForm = new FormGroup({
      'tag': new FormControl(null, null),
    });
  }

  ngOnChanges() {
    this.getTags();
  }

  ngOnDestroy() {
    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getFontSize(tag: Tag) {
    const relativeSize = tag.count / this.largestTag;
    let realSize = this.largestTagSize * relativeSize;
    realSize =  realSize < 1 ? 1 : realSize;
    return `${realSize}rem`;
  }

  getTags(text: string = undefined) {
    if(this.searchSubscription) {
      this.isLoadingTags = true;
      this.searchSubscription.unsubscribe();
    }
    if(text) {
      this.searchSubscription = this.tagService.searchTags(text, this.tagAmount).subscribe((response: any) => {
        this.tags = response.tags;
        this.largestTag = (Math.max.apply(Math, this.tags.map(tag => {
          return tag.count;
        })));
        this.isLoadingTags = false;
      });
    } else {
      this.searchSubscription = this.tagService.getTopTags(this.tagAmount).subscribe((response: any) => {
        this.tags = response.tags;
        this.largestTag = (Math.max.apply(Math, this.tags.map(tag => {
          return tag.count;
        })));
        this.isLoadingTags = false;
      });
    }
  }

  onInput() {
    const text = this.tagForm.value.tag;
    if (text !== '') {
      this.getTags(text);
    } else {
      this.getTags();
    }
  }

}
