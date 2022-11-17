import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mesEnEspaniol'
})
export class MesEnEspaniolPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    let mes = value.getMonth();
    let mesEnEspaniol: string = '';
    switch (mes) {
      case 0: mesEnEspaniol = 'Enero';
        break;
      case 1: mesEnEspaniol = 'Febrero';
        break;
      case 2: mesEnEspaniol = 'Marzo';
        break;
      case 3: mesEnEspaniol = 'Abril';
        break;
      case 4: mesEnEspaniol = 'Mayo';
        break;
      case 5: mesEnEspaniol = 'Junio';
        break;
      case 6: mesEnEspaniol = 'Julio';
        break;
      case 7: mesEnEspaniol = 'Agosto';
        break;
      case 8: mesEnEspaniol = 'Septiembre';
        break;
      case 9: mesEnEspaniol = 'Octubre';
        break;
      case 10: mesEnEspaniol = 'Noviembre';
        break;
      case 11: mesEnEspaniol = 'Diciembre';
        break;
    }
    return mesEnEspaniol;
  }

}
