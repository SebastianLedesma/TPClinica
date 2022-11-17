import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[resaltador]'
})
export class ResaltarDirective {

  constructor(private elementRef: ElementRef<HTMLElement>) { }


  @HostListener('mouseenter') mouseHover(eventData:Event){
    this.elementRef.nativeElement.style.fontWeight='bold';
  }

  @HostListener('mouseleave') mouseLeave(eventData:Event){
    this.elementRef.nativeElement.style.fontWeight='normal';
  }
}
