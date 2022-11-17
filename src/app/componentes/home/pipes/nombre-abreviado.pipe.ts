import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreAbreviado'
})
export class NombreAbreviadoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let arrayNombre = value.split(" ");
    let apellidoAbreviado = arrayNombre[arrayNombre.length -1].substring(0,3);
    let nombreAbreviado = arrayNombre[arrayNombre.length -2] + " " + apellidoAbreviado + ".";

    return nombreAbreviado;
  }

}
