import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { EstadoTurnoService } from 'src/app/componentes/services/estado-turno.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.scss']
})
export class TurnosPacienteComponent implements OnInit {

  displayStyle = "none";
  tituloModal: string = '';
  mostrarBoton: boolean = false;
  readonly = false;
  mensajeResenia: string = '';
  textoModal: string = '';
  mostrarBotonCalificacion: boolean = false;

  displayCalificacionStyle="none";
  tituloCalificacionModal='';
  mensajeCalificacion='';
  textoLabelCalifiacion='';
  readonlyCalificacion=false;
  botonCalificacion:boolean=false;

  displayFormStyle = "none";
  mostrarBotonForm: boolean = false;

  tiempoEspera: string = '';
  sugerencia: string = '';
  recepcion: string = '';


  tiempoEsperaButton: string = '';
  sugerenciaMensaje: string = '';
  recepcionButton: string = '';
  editableDivForm: boolean = false;

  turnoEncuesta: any;
  resenia: any;

  turnoSeleccionado: any;
  nombreColleccion: any;

  mostrarTabla: boolean = false;

  divEspecialidades: boolean = false;
  especialidadElegida: string = '';

  divEspecialistas: boolean = false;
  especialistaElegido: string = '';

  arrayFiltroEspecialidad: string[] = [];
  arrayFiltroEspecialistas: string[] = [];

  turnosReservados: any[] = [];
  turnosReservadosAMostrar: any[] = [];

  turnosRechazados: any[] = [];
  turnosRechazadosAMostrar: any[] = [];

  turnosCancelados: any[] = [];
  turnosCanceladosAMostrar: any[] = [];

  turnosFinalizados: any[] = [];
  turnosFinalizadosAMostrar: any[] = [];

  turnosAceptados: any[] = [];
  turnosAceptadosAMostrar: any[] = [];

  idUsuarioActual: string = '';

  nombreColeccionABorrar: string = '';

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private authService: AuthService, private estadoTurnoService: EstadoTurnoService) { }

  ngOnInit(): void {

    this.spinnerService.mostrarSpinner();
    this.authService.getInfoUsuarioLogueado()
      .subscribe(resp => {
        localStorage.setItem('id_paciente', resp?.uid!);
      })

    this.fireStoreService.obtenerDocs('turnos_reservados')
      .subscribe(resp => {
        this.turnosReservados = resp;
        this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosReservados = this.turnosReservados.filter(turno => {
          if (turno.id_paciente === this.idUsuarioActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

      });

    this.fireStoreService.obtenerDocs('turnos_rechazados')
      .subscribe(resp => {
        this.turnosRechazados = resp;
        this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosRechazados = this.turnosRechazados.filter(turno => {
          if (turno.id_paciente === this.idUsuarioActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

        //console.log(this.turnosRechazados);
      });

    this.fireStoreService.obtenerDocs('turnos_cancelados')
      .subscribe(resp => {
        this.turnosCancelados = resp;
        this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosCancelados = this.turnosCancelados.filter(turno => {
          if (turno.id_paciente === this.idUsuarioActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

        //console.log(this.turnosCancelados);
      });


    this.fireStoreService.obtenerDocs('turnos_finalizados')
      .subscribe(resp => {
        this.turnosFinalizados = resp;
        this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosFinalizados = this.turnosFinalizados.filter(turno => {
          if (turno.id_paciente === this.idUsuarioActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });

        this.spinnerService.ocultarSpinner();
        //console.log(this.turnosFinalizados);
      });


    this.fireStoreService.obtenerDocs('turnos_aceptados')
      .subscribe(resp => {
        this.turnosAceptados = resp;
        this.idUsuarioActual = localStorage.getItem('id_paciente')!;

        this.turnosAceptados = this.turnosAceptados.filter(turno => {
          if (turno.id_paciente === this.idUsuarioActual) {
            let fechaTimeStamp = turno.fecha!;
            let date = new Timestamp(parseInt(fechaTimeStamp.toString().substring(18, fechaTimeStamp.toString().indexOf(','))), 0).toDate();
            turno.fecha = date;
            return true
          } else {
            return false;
          }
        });
      });

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

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosRechazados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosRechazados[index].especialidad);
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

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (!this.arrayFiltroEspecialidad.includes(this.turnosAceptados[index].especialidad)) {
        this.arrayFiltroEspecialidad.push(this.turnosAceptados[index].especialidad);
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

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (!this.arrayFiltroEspecialistas.includes(this.turnosAceptados[index].nombreEspecialista)) {
        this.arrayFiltroEspecialistas.push(this.turnosAceptados[index].nombreEspecialista);
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

    for (let index = 0; index < this.turnosRechazados.length; index++) {
      if (this.turnosRechazados[index].nombreEspecialista === especialista) {
        this.turnosRechazadosAMostrar.push(this.turnosRechazados[index]);
      }
    }

    for (let index = 0; index < this.turnosCancelados.length; index++) {
      if (this.turnosCancelados[index].nombreEspecialista === especialista) {
        this.turnosCanceladosAMostrar.push(this.turnosCancelados[index]);
      }
    }

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      if (this.turnosFinalizados[index].nombreEspecialista === especialista) {
        this.turnosFinalizadosAMostrar.push(this.turnosFinalizados[index]);
      }
    }

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (this.turnosAceptados[index].nombreEspecialista === especialista) {
        this.turnosAceptadosAMostrar.push(this.turnosAceptados[index]);
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

    for (let index = 0; index < this.turnosAceptados.length; index++) {
      if (this.turnosAceptados[index].especialidad === especialidad) {
        this.turnosAceptadosAMostrar.push(this.turnosAceptados[index]);
      }
    }

    this.mostrarTabla = true;
  }

  limpiarArrays(): void {
    this.turnosAceptadosAMostrar = [];
    this.turnosCanceladosAMostrar = [];
    this.turnosFinalizadosAMostrar = [];
    this.turnosRechazadosAMostrar = [];
    this.turnosReservadosAMostrar = [];
  }



  async editarDivModal(turno?: any, coleccion?: string) {

    if (coleccion === 'calificacion') {
      this.spinnerService.mostrarSpinner();
      const resp = (await this.fireStoreService.obtenerDoc('calificacion_turnos', turno.id_turno)).data();

      if (resp) {
        this.resenia = resp!;
        this.mensajeResenia = this.resenia.calificacion;
        this.readonly = true;
        this.tituloModal = "Ya calificaste la atencón";
        this.textoModal = "Calificación del especialista";
        this.displayStyle = "block";
      }

      this.spinnerService.ocultarSpinner();
    } else {
      this.mensajeResenia = '';
      this.turnoSeleccionado = turno;

      if (coleccion === 'turnos_reservados' || coleccion === 'turnos_aceptados') {
        this.tituloModal = "Estás por cancelar un turno";
        this.textoModal = "Indique brevemente el motivo de la cancelación:";
        this.nombreColeccionABorrar = coleccion;
        this.mostrarBoton = true;
        this.mostrarBotonCalificacion = false;
      } else {
        this.tituloModal = "Califica la atención";
        this.textoModal = "Indique brevemente qué le pareció la atención del especialista:";
        this.nombreColeccionABorrar = "";
        this.mostrarBoton = false;
        this.mostrarBotonCalificacion = true;
      }

      this.readonly = false;
    }


    this.displayStyle = "block";
  }

  async editarCalificacion(turno:any,coleccion:string){
    this.spinnerService.mostrarSpinner();
      const resp = (await this.fireStoreService.obtenerDoc('calificacion_turnos', turno.id_turno)).data();

      if (resp) {
        this.resenia = resp!;
        this.mensajeCalificacion = this.resenia.calificacion;
        this.readonlyCalificacion = true;
        this.tituloCalificacionModal = "Ya calificaste la atención";
        this.textoLabelCalifiacion = "Calificación del especialista";
        this.mostrarBotonCalificacion=false;
      }else{
        this.turnoSeleccionado=turno;
        this.readonlyCalificacion = false;
        this.mostrarBotonCalificacion=true;
        this.tituloCalificacionModal = "Calificación de la atención";
        this.textoLabelCalifiacion = "Indica brevemente qué te pareció la atención del especialista";
      }
      this.displayCalificacionStyle = "block";
      this.spinnerService.ocultarSpinner();
  }

  closePopup() {
    this.turnoSeleccionado = null;
    this.nombreColeccionABorrar = '';
    this.mostrarBoton = false;
    this.mostrarBotonCalificacion = false;
    this.readonly=false;
    this.mensajeResenia='';
    this.displayStyle = "none";
    this.displayCalificacionStyle="none";
    this.mensajeCalificacion='';
    this.readonlyCalificacion=false;
  }


  openDivForm(turno: any) {
    if (this.sugerenciaMensaje) {
      this.editableDivForm = false
    } else {
      this.editableDivForm = true;
    }
    this.displayFormStyle = "block";
  }

  closeDivForm() {
    this.displayFormStyle = "none";
    this.turnoSeleccionado=null;
    this.sugerenciaMensaje='';
    this.tiempoEsperaButton='';
    this.recepcionButton='';
  }

  cancelarTurno() {
    this.spinnerService.mostrarSpinner();
    const turnoCancelado = {
      id_turno: this.turnoSeleccionado.id,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.fireStoreService.agregarDoc(turnoCancelado, 'turnos_cancelados', this.turnoSeleccionado.id)
      .then(resp => {
        console.log('turno cancelado');

        const resenia = {
          id_turno: this.turnoSeleccionado.id,
          motivo: this.mensajeResenia,
          id_paciente: this.turnoSeleccionado.id_paciente,
          fecha: this.turnoSeleccionado.fecha,
          especialidad: this.turnoSeleccionado.especialidad,
          id_especialista: this.turnoSeleccionado.id_especialista
        }

        this.fireStoreService.agregarDoc(resenia, 'resenias', this.turnoSeleccionado.id)
          .then(resp => {
            console.log('reseña agregada');
          })
          .catch(error => console.log('error en la reseña.'));

        this.estadoTurnoService.cambiarACancelado(this.turnoSeleccionado.id)
          .then(update => {
            console.log('actualizado');

            this.estadoTurnoService.borrarTurno(this.nombreColeccionABorrar, this.turnoSeleccionado.id)
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
        this.mostrarTabla = false;
      });
  }

  calificarAtencion() {
    this.spinnerService.mostrarSpinner();

    const turnoCalificado = {
      id_turno: this.turnoSeleccionado.id,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      fecha: this.turnoSeleccionado.fecha,
      especialidad: this.turnoSeleccionado.especialidad,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombreEspecialista: this.turnoSeleccionado.nombreEspecialista,
      calificacion: this.mensajeCalificacion,
      id_especialista: this.turnoSeleccionado.id_especialista
    }

    this.fireStoreService.agregarDoc(turnoCalificado, 'calificacion_turnos', turnoCalificado.id_turno)
      .then(resp => {
        console.log('calificacion agregada');
        this.spinnerService.ocultarSpinner()
      })
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log('error en la calificacion.')
      });

    this.estadoTurnoService.cambiarACalificado(turnoCalificado.id_turno)
      .then(resp => {
        console.log('actualizado');
        this.spinnerService.ocultarSpinner();
      })
      .catch(error => {
        this.spinnerService.ocultarSpinner();
        console.log('error en la actualizacion');
      })

    this.closePopup();

  }


  async verResenia(tipo: string, turno: any) {
    if (tipo === 'diagnostico') {
      this.tituloModal = 'Detalle de la visita';
      this.textoModal = 'Diagnóstico del especialista'
    } else {
      this.tituloModal = 'Turno cancelado';
      this.textoModal = 'Motivo de la cancelación';
    }
    
    const resp = (await this.fireStoreService.obtenerDoc('resenias', turno.id_turno)).data();

    if (resp) {
      this.resenia = resp!;
      this.mensajeResenia = this.resenia.motivo;
      this.readonly = true;
      this.displayStyle = "block";
    }else{
      this.editarDivModal(turno,'calificacion');
    }

  }


  async verEncuesta(turno: any) {
    
    this.spinnerService.mostrarSpinner();
    const resp = (await this.fireStoreService.obtenerDoc('encuestas_de_turnos', turno.id_turno)).data();
    this.spinnerService.ocultarSpinner();
  
    if (resp) {
      this.turnoSeleccionado = resp!;
      this.sugerenciaMensaje=this.turnoSeleccionado.sugerencia;
      this.recepcionButton= this.turnoSeleccionado.recepcion;
      this.tiempoEsperaButton = this.turnoSeleccionado.tiempoEspera;
      this.openDivForm(this.turnoSeleccionado);
    } {
      this.turnoSeleccionado = turno;
      this.openDivForm(null);
    }
  }

  completarEncuesta() {

    const encuesta = {
      id_turno: this.turnoSeleccionado.id_turno,
      id_paciente: this.turnoSeleccionado.id_paciente,
      nombre_paciente: this.turnoSeleccionado.nombre_paciente,
      id_especialista: this.turnoSeleccionado.id_especialista,
      tiempoEspera: this.tiempoEspera,
      sugerencia: this.sugerencia,
      recepcion: this.recepcion
    }

    this.spinnerService.mostrarSpinner();

    this.fireStoreService.agregarDoc(encuesta, 'encuestas_de_turnos', encuesta.id_turno)
      .then(resp => {
        console.log('encuesta completada');
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.closeDivForm();
        this.mostrarTabla=false;
        this.spinnerService.ocultarSpinner()
      });
  }

}
