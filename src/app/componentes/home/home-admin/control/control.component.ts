import { Component, OnInit } from '@angular/core';
import { Especialista } from 'src/app/componentes/registro/clases/especialista.class';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { EspecialistaService } from 'src/app/componentes/services/especialista.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  especialistas:Especialista[]=[];
  especialista:any;

  constructor(private fireStoreService:FirestoreService,private authService:AuthService,private spinnerService:SpinnerService,private especialistaService:EspecialistaService) { }

  ngOnInit(): void {
    this.spinnerService.mostrarSpinner();
    this.fireStoreService.obtenerDocs('especialistas')
    .subscribe( resp => {
      this.especialistas = resp;
      this.spinnerService.ocultarSpinner();
    })
  }

  cambiarEstado(especialista:Especialista){
    this.especialistaService.cambiarEstadoEspecialista(especialista.id!,!especialista.habilitado);
  }

}
