import { ActivatedRoute } from '@angular/router';
import { OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tag } from './../models/tag.model';
import { Component, OnInit, Input } from '@angular/core';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
    private tagService: TagService,
    private route: ActivatedRoute,
  ) { }
  tags: Tag[];
  suggestedTags: Tag[] = [];
  @Input() userId: string;
  @Input() isMe: boolean = false;
  tagForm: FormGroup;
  maxTagCount: number;

  largestTag: number;
  largestSearchTag: number;
  largestTagSize = 2.5;

  tagAmount = 10;
  suggestedTagAmount = 4;
  isLoadingTags = true;

  hovered = false;
  hoveredIndex = -1;

  submitInvalid = false;
  searchSubscription: Subscription;

  ngOnInit() {
    this.getTags();
    this.tagForm = new FormGroup({
      'tag': new FormControl(null, [Validators.required, Validators.pattern('[\ \_a-zA-Z0-9]*'), Validators.maxLength(20), Validators.minLength(3)]),
    });
  }

  ngOnChanges() {
    this.tags = [];
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

  getTags() {
    this.tagService.getUserTopTags(this.userId, this.tagAmount).subscribe(tags => {
      tags = tags.sort((a,b) => {
        if (a.text > b.text) {
          return 1;
        } else {
          return -1;
        }
      });
      this.tags = tags;
      this.largestTag = (Math.max.apply(Math, tags.map(tag => {
        return tag.count;
        })));
      this.isLoadingTags = false;
      });
  }

  onSubmit() {
    if(!this.tagForm.get('tag').valid) {
      this.submitInvalid = true;
      return;
    }
    this.submitInvalid = false;
    const tagText = this.tagForm.value.tag;
    this.tagService.addTag(this.userId, tagText).subscribe(response => {
      this.getTags();
    });
    this.tagForm.reset();
    this.suggestedTags = [];
  }

  onInput() {
    const text = this.tagForm.value.tag;
    if (text !== '') {
      if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
      }
      this.searchSubscription = this.tagService.searchUserTags(this.userId, text, this.suggestedTagAmount).subscribe(tags => {
        tags = tags.sort((a,b) => {
          if (a.text > b.text) {
            return 1;
          } else {
            return -1;
          }
        });
        this.suggestedTags = tags;
        this.largestSearchTag = (Math.max.apply(Math, tags.map(tag => {
          return tag.count;
          })));
      })
    } else {
      this.suggestedTags = [];
    }
  }

  onClickSearchResult(text: string) {
    this.tagForm.patchValue({'tag': text});
    this.onSubmit();
  }

  onEnterTag(i: number) {
    if (this.isMe) {
      this.hovered = true;
      this.hoveredIndex = i;
    }
  }

  onLeaveTag(i: number) {
    this.hovered = false;
    this.hoveredIndex = -1;
  }

  onDeleteTag(tag: Tag) {
    this.tagService.deleteTag(tag.text).subscribe(response => {
      this.getTags();
    });
  }

}
