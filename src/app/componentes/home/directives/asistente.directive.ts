import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[asistenteDeVoz]'
})
export class AsistenteDirective {

  constructor(private elementeRef:ElementRef<HTMLElement>) { }

  @HostListener('mouseenter') entradaMouse() {
    speechSynthesis.speak(new SpeechSynthesisUtterance(this.elementeRef.nativeElement.textContent));
  }

  @HostListener('mouseleave') salidaMouse() {
    speechSynthesis.cancel();
  }

}
