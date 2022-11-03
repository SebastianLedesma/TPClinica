import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../registro/services/firestore.service';
import { TurnoDiponible } from '../../clases/turno-disponible.component.class';
import { Especialista } from '../../../registro/clases/especialista.class';
import { SpinnerService } from '../../../services/spinner.service';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/componentes/registro/clases/paciente';
import { TurnoReservado } from '../../clases/turno-reservado.component.class';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { EstadoTurnoService } from 'src/app/componentes/services/estado-turno.service';
import { setDoc, Timestamp, Firestore, doc } from '@angular/fire/firestore';


@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  uidPaciente:string='';
  pacienteLogueado:Paciente=new Paciente();

  turnosDisponibles: any[] = [];
  especialidades: string[] = [];

  especialistas: Especialista[] = [];
  especialistasAMostrar: Especialista[] = [];

  turnosAMostrar: TurnoDiponible[] = [];
  especialidadElegida: string = '';
  especialistaSeleccionado: Especialista = new Especialista();

  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente = new Paciente();

  divTurnos: boolean = false;
  divEspecialistas: boolean = false;
  divPacientes: boolean = false;

  turnoSeleccionado: any;
  turnoReservado!: TurnoReservado;

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private router: Router, private authService: AuthService,private estadoTurnoService:EstadoTurnoService,private firestore:Firestore) { }

  ngOnInit() {

    this.spinnerService.mostrarSpinner();

    if(this.router.url.includes('paciente')){
      this.authService.getInfoUsuarioLogueado()
      .subscribe(resp => {
        localStorage.setItem('id_paciente',resp?.uid!);

        this.fireStoreService.obtenerDoc('pacientes',resp?.uid!)
        .then(resp => {
          this.pacienteLogueado = resp.data()!;
        })
      })
    }

    this.fireStoreService.obtenerDocs('turnos_disponibles')
      .subscribe(resp => {
        this.turnosDisponibles = resp;
      });

    this.fireStoreService.obtenerDoc('especialidadesDisponibles', 'sF2ILmsvdrWuY1Y4Pujy')
      .then(resp => {
        this.especialidades = resp.data()?.['especialidades'];
        this.spinnerService.ocultarSpinner();
      });

    this.fireStoreService.obtenerDocs('especialistas')
      .subscribe(resp => {
        this.spinnerService.ocultarSpinner();
        this.especialistas = resp.filter(esp => esp.habilitado === true);
      })
    ;

  }



  mostrarEspecialistas(filtroEspecialidad: string) {
    this.divTurnos = false;
    this.especialidadElegida = filtroEspecialidad;
    this.divEspecialistas = true;
    this.especialistasAMostrar = this.especialistas.filter(esp => esp.especialidad?.includes(filtroEspecialidad));
  }


  mostrarTurnos(especialista: Especialista) {
    console.log(this.turnosDisponibles);
    this.turnosAMostrar = [];
    this.especialistaSeleccionado = especialista;
    this.divTurnos = true;
    let fechaDeHoy = new Date();

    this.turnosAMostrar = this.turnosDisponibles.filter(turno => {

      if (turno.especialidad?.toLocaleLowerCase() === this.especialidadElegida.toLocaleLowerCase() && turno.nombreEspecialista === `${especialista.nombre} ${especialista.apellido}`) {
        let fechaTimeStamp = turno.fecha!;
        let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
        turno.fecha = date;
        let dias = Math.ceil((date.getTime() - fechaDeHoy.getTime()) / 1000 / 60 / 60 / 24);
        // console.log(dias);

        if (dias <= 15) {
          return true;
        } else {
          return false;
        }

      } else {
        return false;
      }

    })
    //console.log(this.turnosAMostrar);
  }

  verTurno(turno: any) {
    this.turnoSeleccionado = turno;
    
    if (this.router.url.includes('admin')) {
      this.divPacientes = true;

      this.spinnerService.mostrarSpinner();
      this.fireStoreService.obtenerDocs('pacientes')
        .subscribe(resp => {
          this.spinnerService.ocultarSpinner();
          this.pacientes = resp;
        })

    } else {

      this.guardarTurno();
    }
  }

  pedirTurno(paciente: Paciente) {
    this.guardarTurno(paciente);
  }

  crearTurnoReservado(paciente?: Paciente) {
    let id: string = '';
    let nombrePaciente:string='';
    if (paciente) {
      id = paciente.id!;
      nombrePaciente = `${paciente.nombre} ${paciente.apellido}`;
    } else {
      id = localStorage.getItem('id_paciente')!
      nombrePaciente = `${this.pacienteLogueado.nombre} ${this.pacienteLogueado.apellido}`;
    }

    console.log(id);

    const turnoReservado = {
      id_turno: this.turnoSeleccionado.id,
      fecha: this.turnoSeleccionado.fecha,
      id_paciente: id,
      nombre_paciente: nombrePaciente,
      id_especialista: this.especialistaSeleccionado.id!,
      nombreEspecialista: `${this.especialistaSeleccionado.nombre} ${this.especialistaSeleccionado.apellido}`,
      especialidad: this.especialidadElegida
    }

    return turnoReservado;
  }

  guardarTurno(paciente?:Paciente) {
    let id:string='';
    let nombrePaciente:string='';
    this.spinnerService.mostrarSpinner();
    
    const turno = this.crearTurnoReservado(paciente);

    this.fireStoreService.agregarDoc(turno, 'turnos_reservados', this.turnoSeleccionado.id)
      .then(resp => {
        console.log('turno reservado');

        this.estadoTurnoService.cambiarAReservado(this.turnoSeleccionado.id)
        .then(update => {
          console.log('actualizado');

          this.estadoTurnoService.borrarTurno('turnos_disponibles',this.turnoSeleccionado.id)
          .then(resp => {
            this.spinnerService.ocultarSpinner();
            console.log('borrado');
          })
          .catch(error => {
            this.spinnerService.ocultarSpinner();
            console.log(error);
          });

        })
        .catch(error => {
          this.spinnerService.ocultarSpinner();
          console.log(error);
        });

      })
      .catch(error =>{
        this.spinnerService.ocultarSpinner();
        console.log(error)
      });
    
      this.divTurnos=false;
      this.divPacientes=false;
  }

}
