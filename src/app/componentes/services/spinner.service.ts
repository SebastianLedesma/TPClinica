import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerService:NgxSpinnerService ) { }

  mostrarSpinner(){
    //console.log('abro')
    this.spinnerService.show();
  }

  ocultarSpinner(){
    //console.log('cierro');
    this.spinnerService.hide();
  }
}
