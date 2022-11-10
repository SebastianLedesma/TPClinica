import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/componentes/registro/clases/paciente';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { EspecialistaService } from 'src/app/componentes/services/especialista.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {

  divPacientes: boolean = false;
  pacientes: any[] = [];
  id_pacienteSeleccionado: string = '';
  especialistaLogueado: any;
  arrayPacientesAMostrar:any[]=[];
  arrayNombres:string[]=[];

  constructor(private spinnerService: SpinnerService, private authService: AuthService, private fireStoreService: FirestoreService, private especialistaService: EspecialistaService) { }

  ngOnInit(): void {

    this.spinnerService.mostrarSpinner();

    this.authService.getInfoUsuarioLogueado()
      .subscribe(async resp => {
        localStorage.setItem('id_especialista', resp?.uid!);

        const esp = (await this.especialistaService.obtenerDoc('especialistas', this.authService.getIdUsuario()!)).data();

        if (esp) {
          this.especialistaLogueado = esp;
        }

        this.fireStoreService.obtenerDocs('diagnostico_turnos')
          .subscribe(resp => {
            this.pacientes = resp;
            this.pacientes = this.pacientes.filter(turnoFinalizado => {

              if (turnoFinalizado.nombreEspecialista === `${this.especialistaLogueado.nombre} ${this.especialistaLogueado.apellido}`) {
                return true;
              } else {
                return false;
              }
            })
            
            this.filtrarPacientes();
            this.divPacientes = true;
            this.spinnerService.ocultarSpinner();
          })
      })
  }


  verHistorialPaciente(paciente: any) {
    console.log(paciente);
    this.id_pacienteSeleccionado = paciente.id_paciente!;
    //console.log(this.pacienteSeleccionado);
  }

  filtrarPacientes(){
    this.arrayNombres=[];
    this.arrayPacientesAMostrar=[];

    for (let index = 0; index < this.pacientes.length; index++) {
      const paciente = this.pacientes[index].nombre_paciente;
      if(!this.arrayNombres.includes(paciente)){
        this.arrayPacientesAMostrar.push(this.pacientes[index]);
        this.arrayNombres.push(paciente);
      }
      
    }
    //console.log(this.arrayPacientesAMostrar);
  }

}
