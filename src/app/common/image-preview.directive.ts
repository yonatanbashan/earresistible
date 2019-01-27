import { Directive, OnInit, ElementRef, Renderer2, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[imagePreview]'
})
export class ImagePreviewDirective implements OnInit, OnChanges {

  constructor(private renderer: Renderer2,
    private elRef: ElementRef) {}

  ngOnInit() {
    this.getDimensions();
    this.setImageAttributes();
  }

  ngOnChanges() {
  }

  getDimensions() {
    // console.log(this.elRef);

    let el = this.elRef.nativeElement;
    // console.log(el.scrollWidth);

  }


  setImageAttributes() {
    // this.renderer.setStyle(this.elRef.nativeElement, 'width', '30%');
  }

}
