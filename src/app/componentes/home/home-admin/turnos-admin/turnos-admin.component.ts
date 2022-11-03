import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { EstadoTurnoService } from 'src/app/componentes/services/estado-turno.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

@Component({
  selector: 'app-turnos-admin',
  templateUrl: './turnos-admin.component.html',
  styleUrls: ['./turnos-admin.component.scss']
})
export class TurnosAdminComponent implements OnInit {

  mensajeResenia: string = '';
  displayStyle = "none";
  turnoSeleccionado: any;
  nombreColleccion: any;

  turnosReservados: any[] = [];
  turnosReservadosAMostrar: any[] = [];

  turnosDisponibles: any[] = [];
  turnosDisponiblesAMostrar: any[] = [];

  turnosRechazados: any[] = [];
  turnosRechazadosAMostrar: any[] = [];

  turnosCancelados: any[] = [];
  turnosCanceladosAMostrar: any[] = [];

  turnosFinalizados: any[] = [];
  turnosFinalizadosAMostrar: any[] = [];

  turnosAceptados: any[] = [];
  turnosAceptadosAMostrar: any[] = [];

  mostrarTabla: boolean = false;

  divEspecialidades: boolean = false;
  especialidadElegida: string = '';

  divEspecialistas: boolean = false;
  especialistaElegido: string = '';

  arrayFiltroEspecialidad: string[] = [];
  arrayFiltroEspecialistas: string[] = [];

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private estadoTurnoService: EstadoTurnoService) { }

  ngOnInit(): void {

    this.spinnerService.mostrarSpinner();
    this.fireStoreService.obtenerDocs('turnos_reservados')
      .subscribe(resp => {
        this.turnosReservados = resp;
        //this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosReservados = this.turnosReservados.map(turno => {

          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });
      });

    this.fireStoreService.obtenerDocs('turnos_disponibles')
      .subscribe(resp => {
        this.turnosDisponibles = resp;

        this.turnosDisponibles = this.turnosDisponibles.map(turno => {
          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });

      });

    this.fireStoreService.obtenerDocs('turnos_rechazados')
      .subscribe(resp => {
        this.turnosRechazados = resp;

        this.turnosRechazados = this.turnosRechazados.filter(turno => {
          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });

      });


    this.fireStoreService.obtenerDocs('turnos_cancelados')
      .subscribe(resp => {
        this.turnosCancelados = resp;

        this.turnosCancelados = this.turnosCancelados.filter(turno => {
          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });
      });


    this.fireStoreService.obtenerDocs('turnos_finalizados')
      .subscribe(resp => {
        this.turnosFinalizados = resp;

        this.turnosFinalizados = this.turnosFinalizados.filter(turno => {
          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });

        this.spinnerService.ocultarSpinner();
      });

    this.fireStoreService.obtenerDocs('turnos_aceptados')
      .subscribe(resp => {
        this.turnosFinalizados = resp;

        this.turnosFinalizados = this.turnosFinalizados.filter(turno => {
          let fechaTimeStamp = turno.fecha!;
          let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
          turno.fecha = date;
          return turno;
        });

        this.spinnerService.ocultarSpinner();
      });
  }

  openDivResenia(turno: any, nombreColleccion: string) {
    this.displayStyle = "block";
    this.turnoSeleccionado = turno;
    this.nombreColleccion = nombreColleccion;
  }

  closePopup() {
    this.mensajeResenia='';
    this.displayStyle = "none";
  }


  mostrarEspecialidades() {
    this.divEspecialistas = false;
    this.divEspecialidades = true;
    this.mostrarTabla = false;

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosReservados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosReservados[index].especialidad);
      }
    }

    for (let index = 0; index < this.turnosDisponibles.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosDisponibles[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosDisponibles[index].especialidad);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosAceptados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosAceptados[index].especialidad);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosCancelados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosCancelados[index].especialidad);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosFinalizados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosFinalizados[index].especialidad);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosRechazados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosRechazados[index].especialidad);
      }
    }

  }

  mostrarEspecialistas() {
    this.divEspecialistas = true;
    this.divEspecialidades = false;
    this.mostrarTabla = false;

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosReservados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosReservados[index].nombreEspecialista);
      }
    }

    for (let index = 0; index < this.turnosDisponibles.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosDisponibles[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosDisponibles[index].nombreEspecialista);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosAceptados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosAceptados[index].nombreEspecialista);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosRechazados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosRechazados[index].nombreEspecialista);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosCancelados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosCancelados[index].nombreEspecialista);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosFinalizados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosFinalizados[index].nombreEspecialista);
      }
    }
  }


  mostrarTurnosPorEspecialista(especialista: string) {
    this.limpiarArrays();

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (this.turnosReservados[index].nombreEspecialista === especialista) {
        this.turnosReservadosAMostrar.push(this.turnosReservados[index]);
      }
    }

    for (let index = 0; index < this.turnosDisponibles.length; index++) {
      if (this.turnosDisponibles[index].nombreEspecialista === especialista) {
        this.turnosDisponiblesAMostrar.push(this.turnosDisponibles[index]);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (this.turnosAceptados[index].nombreEspecialista === especialista) {
        this.turnosAceptadosAMostrar.push(this.turnosAceptados[index]);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (this.turnosCancelados[index].nombreEspecialista === especialista) {
        this.turnosCanceladosAMostrar.push(this.turnosCancelados[index]);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (this.turnosRechazados[index].nombreEspecialista === especialista) {
        this.turnosRechazadosAMostrar.push(this.turnosRechazados[index]);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (this.turnosFinalizados[index].nombreEspecialista === especialista) {
        this.turnosFinalizadosAMostrar.push(this.turnosFinalizados[index]);
      }
    }

    this.mostrarTabla = true;
  }

  mostrarTurnosPorEspecialidades(especialidad: string) {
    this.limpiarArrays();

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (this.turnosReservados[index].especialidad === especialidad) {
        this.turnosReservadosAMostrar.push(this.turnosReservados[index]);
      }
    }

    for (let index = 0; index < this.turnosDisponibles.length; index++) {
      if (this.turnosDisponibles[index].especialidad === especialidad) {
        this.turnosDisponiblesAMostrar.push(this.turnosDisponibles[index]);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (this.turnosAceptados[index].especialidad === especialidad) {
        this.turnosAceptadosAMostrar.push(this.turnosAceptados[index]);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (this.turnosCancelados[index].especialidad === especialidad) {
        this.turnosCanceladosAMostrar.push(this.turnosCancelados[index]);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (this.turnosRechazados[index].especialidad === especialidad) {
        this.turnosRechazadosAMostrar.push(this.turnosRechazados[index]);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (this.turnosFinalizados[index].especialidad === especialidad) {
        this.turnosFinalizadosAMostrar.push(this.turnosFinalizados[index]);
      }
    }

    this.mostrarTabla = true;
  }

  limpiarArrays(): void {
    this.turnosDisponiblesAMostrar = [];
    this.turnosReservadosAMostrar = [];
    this.turnosAceptadosAMostrar=[];
    this.turnosCanceladosAMostrar=[];
    this.turnosRechazadosAMostrar=[];
    this.turnosFinalizadosAMostrar=[];
  }


  cancelarTurno() {
    this.spinnerService.mostrarSpinner();

    let turnoCancelado = {
      id_turno: this.turnoSeleccionado.id,
      fecha: this.turnoSeleccionado.fecha,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      especialidad: this.turnoSeleccionado.especialidad,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    const resenia = {
      id_turno: this.turnoSeleccionado.id,
      motivo: this.mensajeResenia,
      id_paciente:this.turnoSeleccionado.id_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    if(this.nombreColleccion === 'turnos_reservados'){
      turnoCancelado.nombre_paciente = this.turnoSeleccionado.nombre_paciente;
      turnoCancelado.id_paciente = this.turnoSeleccionado.id_paciente;
      resenia.id_paciente = this.turnoSeleccionado.id_paciente
    }
    

    this.fireStoreService.agregarDoc(turnoCancelado, 'turnos_cancelados', this.turnoSeleccionado.id)
      .then(resp => {
        console.log('turno cancelado');

        

        this.fireStoreService.agregarDoc(resenia, 'resenias', this.turnoSeleccionado.id)
          .then(resp => {
            console.log('reseña agregada');
          })
          .catch(error => console.log('error en la reseña.'));

        this.estadoTurnoService.cambiarACancelado(this.turnoSeleccionado.id)
          .then(update => {
            console.log('actualizado');

            this.estadoTurnoService.borrarTurno(this.nombreColleccion, this.turnoSeleccionado.id)
              .then(resp => {
                this.closePopup();
                this.spinnerService.ocultarSpinner();
                console.log('borrado');
              })
              .catch(error => {
                this.closePopup();
                this.spinnerService.ocultarSpinner();
                console.log(error);
              });

          })
          .catch(error => {
            this.spinnerService.ocultarSpinner();
            console.log(error);
          });

      })
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log(error)
      })
      .finally(() => {
        this.closePopup();
        this.mostrarTabla = false;
      });
  }

}
