import { Directive, ElementRef, Input, OnInit ,Renderer2} from '@angular/core';

@Directive({
  selector: '[appColorButton]'
})
export class ColorButtonDirective implements OnInit{

  htmlElement:ElementRef<HTMLElement>;
  horaTurno:any;

  @Input() texto:Date;

  constructor(private el:ElementRef<HTMLElement>) {
    //console.log(el);
    this.htmlElement = el;
    //console.log(this.htmlElement);
    //console.log(this.texto);
   }


  ngOnInit(): void {
    //console.log('directiva');
    this.setColor();
  }

  setColor(){
    let horaDelDia = this.texto.getHours();
    if(horaDelDia > 9 && horaDelDia <=12){
      this.htmlElement.nativeElement.classList.add('btn','btn-warning');
    }else if(horaDelDia > 12 && horaDelDia <=15){
      this.htmlElement.nativeElement.classList.add('btn','btn-success');
    }else{
      this.htmlElement.nativeElement.classList.add('btn','btn-danger');
    }
  }

}
