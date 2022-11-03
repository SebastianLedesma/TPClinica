import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { EstadoTurnoService } from 'src/app/componentes/services/estado-turno.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';
import { Especialista } from '../../../registro/clases/especialista.class';

@Component({
  selector: 'app-turno-especialista',
  templateUrl: './turno-especialista.component.html',
  styleUrls: ['./turno-especialista.component.scss']
})
export class TurnoEspecialistaComponent implements OnInit {

  displayStyle = "none";
  readonly = false;
  mensajeResenia: string = '';
  tituloModal: string = '';
  textoModal: string = '';
  resenia: any;

  nombreColeccionABorrar: string = '';

  turnoSeleccionado: any;
  nombreColleccion: any;
  mostrarBoton: boolean = false;
  mostrarBotonCancelado: boolean = false;
  mostrarBotonRechazado: boolean = false;

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

  arrayFiltroPacientes: any[] = [];

  divEspecialidades: boolean = false;
  divPacientes: boolean = false;
  mostrarTabla: boolean = false;

  idEspecialistaActual: string = '';
  especialistaActual: Especialista = new Especialista();

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private authService: AuthService, private estadoTurnoService: EstadoTurnoService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.authService.getInfoUsuarioLogueado()
      .subscribe(async resp => {
        localStorage.setItem('id_especialista', resp?.uid!);
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        const esp = (await this.fireStoreService.obtenerDoc('especialistas', localStorage.getItem('id_especialista')!)).data();

        if (esp) {
          //localStorage.setItem('especialista', esp!);
          this.especialistaActual = esp!;
        }

      })

    this.spinnerService.mostrarSpinner();
    this.fireStoreService.obtenerDocs('turnos_reservados')
      .subscribe(resp => {
        this.turnosReservados = resp;
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        this.turnosReservados = this.turnosReservados.filter(turno => {
          if (turno.id_especialista === this.idEspecialistaActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });
      });

    this.fireStoreService.obtenerDocs('turnos_disponibles')
      .subscribe(resp => {
        this.turnosDisponibles = resp;
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        this.turnosDisponibles = this.turnosDisponibles.filter(turno => {
          if (turno.id_especialista === this.idEspecialistaActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

      });

    this.fireStoreService.obtenerDocs('turnos_cancelados')
      .subscribe(resp => {
        this.turnosCancelados = resp;
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        this.turnosCancelados = this.turnosCancelados.filter(turno => {
          if (turno.id_especialista === this.idEspecialistaActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });
      });


    this.fireStoreService.obtenerDocs('turnos_finalizados')
      .subscribe(resp => {
        this.turnosFinalizados = resp;
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        this.turnosFinalizados = this.turnosFinalizados.filter(turno => {
          if (turno.id_especialista === this.idEspecialistaActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

        this.spinnerService.ocultarSpinner();
      });

    this.fireStoreService.obtenerDocs('turnos_aceptados')
      .subscribe(resp => {
        this.turnosAceptados = resp;
        this.idEspecialistaActual = localStorage.getItem('id_especialista')!;

        this.turnosAceptados = this.turnosAceptados.filter(turno => {
          if (turno.id_especialista === this.idEspecialistaActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

        this.spinnerService.ocultarSpinner();
      });

  }


  mostrarEspecialidades() {
    console.log(this.especialistaActual.especialidad);
    this.limpiarArrays();
    this.mostrarTabla = false;
    this.divPacientes = false;
    this.divEspecialidades = true;
    this.mostrarTabla = false;
  }

  mostrarPacientes() {
    this.mostrarTabla = false;
    this.limpiarArrays();
    this.divEspecialidades = false;
    this.divPacientes = true;

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (!this.arrayFiltroPacientes.includes(this.turnosReservados[index].nombre_paciente)) {
        this.arrayFiltroPacientes.push(this.turnosReservados[index].nombre_paciente);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (!this.arrayFiltroPacientes.includes(this.turnosRechazados[index].nombre_paciente)) {
        this.arrayFiltroPacientes.push(this.turnosRechazados[index].nombre_paciente);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (!this.arrayFiltroPacientes.includes(this.turnosCancelados[index].nombre_paciente)) {
        this.arrayFiltroPacientes.push(this.turnosCancelados[index].nombre_paciente);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (!this.arrayFiltroPacientes.includes(this.turnosAceptados[index].nombre_paciente)) {
        this.arrayFiltroPacientes.push(this.turnosAceptados[index].nombre_paciente);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (!this.arrayFiltroPacientes.includes(this.turnosFinalizados[index].nombre_paciente)) {
        this.arrayFiltroPacientes.push(this.turnosFinalizados[index].nombre_paciente);
      }
    }

    //console.log(this.arrayFiltroPacientes);
  }

  mostrarTurnosPorEspecialidades(especialidad: string) {
    this.limpiarArrays();

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

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (this.turnosReservados[index].especialidad === especialidad) {
        this.turnosReservadosAMostrar.push(this.turnosReservados[index]);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (this.turnosRechazados[index].especialidad === especialidad) {
        this.turnosRechazadosAMostrar.push(this.turnosRechazados[index]);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (this.turnosCancelados[index].especialidad === especialidad) {
        this.turnosCanceladosAMostrar.push(this.turnosCancelados[index]);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (this.turnosFinalizados[index].especialidad === especialidad) {
        this.turnosFinalizadosAMostrar.push(this.turnosFinalizados[index]);
      }
    }
    this.mostrarTabla = true;
  }

  mostrarTurnosPorPaciente(paciente: string) {
    this.limpiarArrays();

    for (let index = 0; index < this.turnosReservados.length; index++) {
      if (this.turnosReservados[index].nombre_paciente === paciente) {
        this.turnosReservadosAMostrar.push(this.turnosReservados[index]);
      }
    }

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (this.turnosRechazados[index].nombre_paciente === paciente) {
        this.turnosRechazadosAMostrar.push(this.turnosRechazados[index]);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (this.turnosCancelados[index].nombre_paciente === paciente) {
        this.turnosCanceladosAMostrar.push(this.turnosCancelados[index]);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (this.turnosAceptados[index].nombre_paciente === paciente) {
        this.turnosAceptadosAMostrar.push(this.turnosAceptados[index]);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (this.turnosFinalizados[index].nombre_paciente === paciente) {
        this.turnosFinalizadosAMostrar.push(this.turnosFinalizados[index]);
      }
    }
    this.mostrarTabla = true;
  }

  openDivResenia(turno?: any, nombreColleccion?: string, mensaje?: string) {
    this.displayStyle = "block";
    this.mensajeResenia = '';

    if (turno != null) {
      this.turnoSeleccionado = turno;
      if (nombreColleccion === 'turnos_aceptados') {
        this.tituloModal = "Confirmar atención";
        this.textoModal = "Ingrese el diagnóstico del paciente";
        this.mostrarBoton = true;
      } else if (nombreColleccion === 'turnos_disponibles') {
        this.mostrarBotonCancelado = true;
      } else {
        this.mostrarBotonRechazado = true;
      }


      this.readonly = false;
      this.turnoSeleccionado = turno;
      this.nombreColleccion = nombreColleccion;
      //this.mostrarBoton = true;
    } else {
      this.readonly = true;
      this.mensajeResenia = mensaje!;
    }
  }

  closePopup() {
    this.turnoSeleccionado = null;
    this.nombreColleccion = null;
    this.mostrarBoton = false;
    this.mostrarBotonCancelado = false;
    this.mostrarBotonRechazado = false;
    this.displayStyle = "none";
  }


  limpiarArrays(): void {

    this.turnosDisponiblesAMostrar = [];
    this.turnosAceptadosAMostrar = [];
    this.turnosCanceladosAMostrar = [];
    this.turnosFinalizadosAMostrar = [];
    this.turnosRechazadosAMostrar = [];
    this.turnosReservadosAMostrar = [];
  }

  async verResenia(tipo: string, turno: any) {
    if (tipo === 'cancelados') {
      this.tituloModal = "Cancelado";
      this.textoModal = "Motivo de cancelación:";
    } else if (tipo === 'rechazados') {
      this.tituloModal = "Rechazado";
      this.textoModal = "Motivo del rechazo del turno:";
    } else {
      this.tituloModal = "Turno realizado";
      this.textoModal = "Diagnóstico:";
    }


    const resp = (await this.fireStoreService.obtenerDoc('resenias', turno.id_turno)).data();
    console.log(resp);
    if (resp) {
      this.resenia = resp!;
      //console.log(this.resenia);
      this.openDivResenia(null, '', this.resenia.motivo);
    }
  }


  aceptarTurno(turno: any) {
    this.turnoSeleccionado = turno;

    const turnoAceptadoo = {
      id_turno: this.turnoSeleccionado.id,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.spinnerService.mostrarSpinner();

    this.fireStoreService.agregarDoc(turnoAceptadoo, 'turnos_aceptados', turnoAceptadoo.id_turno)
      .then(resp => {
        console.log('turno aceptado');

        this.estadoTurnoService.cambiarAAceptado(turnoAceptadoo.id_turno)
          .then(update => {
            console.log('actualizado');

            this.estadoTurnoService.borrarTurno('turnos_reservados', turnoAceptadoo.id_turno)
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
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log(error)
      })
      .finally(() => {
        this.spinnerService.ocultarSpinner();
        this.mostrarTabla = false;
      });
  }


  cancelarTurno() {
    console.log(this.turnoSeleccionado);
    this.spinnerService.mostrarSpinner();
    const turnoCancelado = {
      id_turno: this.turnoSeleccionado.id,
      fecha: this.turnoSeleccionado.fecha,
      motivo: this.mensajeResenia,
      especialidad: this.turnoSeleccionado.especialidad,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    const resenia = {
      id_turno: this.turnoSeleccionado.id,
      motivo: this.mensajeResenia,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.spinnerService.mostrarSpinner();
    this.fireStoreService.agregarDoc(resenia, 'resenias', resenia.id_turno)
      .then(resp => {
        console.log('reseña agregada');
      })
      .catch(error => console.log(error));

    this.fireStoreService.agregarDoc(turnoCancelado, 'turnos_cancelados', turnoCancelado.id_turno)
      .then(resp => {
        console.log('turno cancelado');

        this.estadoTurnoService.cambiarACancelado(turnoCancelado.id_turno)
          .then(update => {
            console.log('cancelado');

            this.estadoTurnoService.borrarTurno('turnos_disponibles', turnoCancelado.id_turno)
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
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log(error)
      })
      .finally(() => {
        this.closePopup();
        this.mostrarTabla = false;
      });
  }


  rechazarTurno() {
    //this.turnoSeleccionado = turno;
    this.spinnerService.mostrarSpinner();
    const turnoRechazado = {
      id_turno: this.turnoSeleccionado.id,
      fecha: this.turnoSeleccionado.fecha,
      motivo: this.mensajeResenia,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      id_paciente: this.turnoSeleccionado.id_paciente,
      especialidad: this.turnoSeleccionado.especialidad,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.fireStoreService.agregarDoc(turnoRechazado, 'turnos_rechazados', this.turnoSeleccionado.id_turno)
      .then(resp => {
        console.log('turno rechazado');

        this.estadoTurnoService.cambiarARechazado(this.turnoSeleccionado.id)
          .then(update => {
            console.log('rechazado');

            this.estadoTurnoService.borrarTurno('turnos_reservados', this.turnoSeleccionado.id_turno)
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
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log(error)
      })
      .finally(() => {
        this.mostrarTabla = false;
      });
  }


  enviarResenia() {
    const turnoFinalizado = {
      id_turno: this.turnoSeleccionado.id,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    const resenia = {
      id_turno: this.turnoSeleccionado.id,
      motivo: this.mensajeResenia,
      id_paciente: this.turnoSeleccionado.id_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.spinnerService.mostrarSpinner();


    this.fireStoreService.agregarDoc(turnoFinalizado, 'turnos_finalizados', turnoFinalizado.id_turno)
      .then(resp => {
        console.log('turno finalizado');

        this.fireStoreService.agregarDoc(resenia, 'resenias', resenia.id_turno)
          .then(resp => {
            console.log('reseña agregada');
          })
          .catch(error => console.log(error));

        this.estadoTurnoService.cambiarAFinalizado(turnoFinalizado.id_turno)
          .then(terminado => {
            console.log('actualizado');
            this.closePopup();
            this.spinnerService.ocultarSpinner();
            this.mostrarTabla=false;
            this.estadoTurnoService.borrarTurno('turnos_aceptados', turnoFinalizado.id_turno)
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
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log(error)
      });

  }

}
