import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerService:NgxSpinnerService ) { }

  mostrarSpinner(){
    this.spinnerService.show();
  }

  ocultarSpinner(){
    this.spinnerService.hide();
  }
}
