import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diaEnEspaniol'
})
export class DiaEnEspaniolPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    let dia = value.getDay()
    let diaEnEspaniol:string='';
    switch(dia){
      case 0:
        diaEnEspaniol = 'Domingo';
        break;
      case 1:
        diaEnEspaniol = 'Lunes';
        break;
      case 2:
        diaEnEspaniol= 'Martes';
        break;
      case 3:
        diaEnEspaniol = 'Miercoles';
        break;
      case 4:
        diaEnEspaniol = 'Jueves';
        break;
      case 5:
        diaEnEspaniol = 'Viernes';
        break;
      case 6:
        diaEnEspaniol = 'Sábado';
    }
    return diaEnEspaniol;
  }

}
