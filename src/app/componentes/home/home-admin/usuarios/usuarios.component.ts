import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/componentes/registro/clases/paciente';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  divPacientes: boolean = false;
  pacientes: Paciente[] = [];
  id_pacienteSeleccionado:string = '';

  constructor(private spinnerService: SpinnerService, private authService: AuthService, private fireStoreService: FirestoreService) { }

  ngOnInit(): void {

    this.spinnerService.mostrarSpinner();

    this.authService.getInfoUsuarioLogueado()
      .subscribe(resp => {
        localStorage.setItem('id_paciente', resp?.uid!);

        this.fireStoreService.obtenerDocs('pacientes')
        .subscribe(resp => {
          this.pacientes = resp;
          this.divPacientes=true;
          this.spinnerService.ocultarSpinner();
        })
      })
  }


  verHistorialPaciente(paciente:Paciente){
    this.id_pacienteSeleccionado = paciente.id!;
    //console.log(this.pacienteSeleccionado);
  }

}
