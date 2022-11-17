import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../registro/services/firestore.service';
import { Especialista } from '../../../registro/clases/especialista.class';
import { EspecialistaService } from '../../../services/especialista.service';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { TurnoDiponible } from '../../clases/turno-disponible.component.class';
import { EstadoTurno } from '../../clases/estado-turno.component.class';
import { SpinnerService } from '../../../services/spinner.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  especialista: Especialista = new Especialista();
  estadoTurno: EstadoTurno = new EstadoTurno();

  diasDeAtencion: Array<any> = [
    { name: 'lunes', value: '1' },
    { name: 'martes', value: '2' },
    { name: 'miercoles', value: '3' },
    { name: 'jueves', value: '4' },
    { name: 'viernes', value: '5' }
  ];

  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  formulario: FormGroup = this.fb.group({
    desde: [0, [Validators.required, Validators.min(9), Validators.max(17)]],
    hasta: [0, [Validators.required, Validators.min(10), Validators.max(18)]],
    diaInicio: [0, [Validators.required, Validators.min(1), Validators.max(31)]],
    diaFinal: [0, [Validators.required, Validators.min(1), Validators.max(31)]],
    mesInicio: ['', Validators.required],
    mesFinal: ['', Validators.required],
    especialidades: ['', Validators.required],
    diasSeleccionados: new FormArray([])
  })


  cantidadDeTurnosPorDia: number = 0;
  ultimoDiaDeAtencion: any;
  arraDeTurnos: Date[] = [];


  constructor(private fb: FormBuilder, private fireStore: FirestoreService, private especialistaService: EspecialistaService, private authService: AuthService, private spinnerService: SpinnerService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    const resp = (await this.especialistaService.obtenerDoc('especialistas', this.authService.getIdUsuario()!)).data();

    if (resp) {
      this.especialista = resp;

    }

  }

  armarAgenda() {

    let arrayDias: any[] = this.formulario.controls['diasSeleccionados'].value;

    let fechaDeHoy: Date = new Date();

    let fechaInicio: Date = new Date(fechaDeHoy.getFullYear(), parseInt(this.formulario.get('mesInicio')?.value), this.formulario.get('diaInicio')?.value, this.formulario.get('desde')?.value, 0, 0);

    let fechaFinal: Date = new Date(fechaDeHoy.getFullYear(), parseInt(this.formulario.get('mesFinal')?.value), this.formulario.get('diaFinal')?.value, 0, 0, 0);

    let dias = fechaFinal.getTime() - fechaInicio.getTime();
    dias = dias / 1000 / 60 / 60 / 24;
    console.log(fechaInicio);
    console.log(fechaFinal);
    let diasATrabajar = Math.ceil(dias);

    if (dias > 30) {
      console.log('Solo puede agendar hasta un mes de turnos.');
    } else {

      let turnoActual = fechaInicio;
      let fechaTurnoSiguiente: Date;

      this.cantidadDeTurnosPorDia = (this.formulario.get('hasta')?.value - this.formulario.get('desde')?.value) * 2;

      for (let index = 0; index < diasATrabajar + 1; index++) {

        if (turnoActual.getDay() != 0 && turnoActual.getDay() != 6
          && arrayDias.includes(turnoActual.getDay().toString())) {

          this.arraDeTurnos.push(turnoActual);

          for (let indice = 0; indice < this.cantidadDeTurnosPorDia - 1; indice++) {
            let mediaHoraMilis = 1000 * 30 * 60;
            fechaTurnoSiguiente = new Date(turnoActual.getTime() + mediaHoraMilis);
            this.arraDeTurnos.push(fechaTurnoSiguiente);
            turnoActual = fechaTurnoSiguiente;
          }
        }


        let unDia = 1000 * 60 * 60 * 24;
        turnoActual = new Date(turnoActual.getTime() + unDia);
        turnoActual.setHours(parseInt(this.formulario.get('desde')?.value));
        turnoActual.setMinutes(0);
      }

    }
  }


  crearTurnos() {
    this.armarAgenda();
    let turnoDisponible = new TurnoDiponible();
    turnoDisponible.especialidad = this.formulario.get('especialidades')?.value;
    turnoDisponible.id_especialista = this.especialista.id;
    turnoDisponible.nombreEspecialista = `${this.especialista.nombre} ${this.especialista.apellido}`;

    this.spinnerService.mostrarSpinner();

    setTimeout(() => {
      this.arraDeTurnos.forEach(turno => {
        turnoDisponible.fecha = turno;

        this.especialistaService.agregarTurno(turnoDisponible)
          .then(resp => {
            this.estadoTurno.disponible = true;
            this.estadoTurno.id = resp.id;

            this.fireStore.agregarDoc(this.crearEstadoTurno(resp.id), 'estado_turnos', resp.id)
              .then(resp => console.log('agregado'))
              .catch(error => console.log(error));
          })
          .catch(error => console.log(error))
          .finally(() => this.spinnerService.ocultarSpinner());

      });
      this.formulario.reset();
      this.router.navigate(['home/especialista']);
    }, 3000);

    this.agregarTurnos(turnoDisponible.especialidad);
  }


  async agregarTurnos(especialidad:string) {
    const registros = (await this.fireStore.obtenerDoc('contador_por_especialidad', '6qoiDPDpaL4rFm5LgSuT')).data();

    if (registros) {
      let fechaHoy = new Date;
      let turnosRegistro:any[] = registros['turnos'];
      //registroLog.push({ email: this.formulario.get('mail').value, fecha: fechaHoy, rol: perfil });

      turnosRegistro = turnosRegistro.map(valor =>{
        if(valor.especialidad === especialidad){
          valor.cantidad += this.arraDeTurnos.length;
        }
        return valor;
      })
      this.fireStore.agregarDoc({ turnos: turnosRegistro }, 'contador_por_especialidad', '6qoiDPDpaL4rFm5LgSuT')
        .catch(error => console.log(error));

    }
  }


  onCheckboxChange(event: any) {

    const diasSelec = (this.formulario.controls['diasSeleccionados'] as FormArray);
    if (event.target.checked) {
      diasSelec.push(new FormControl(event.target.value));
    } else {
      const index = diasSelec.controls
        .findIndex(x => x.value === event.target.value);
      diasSelec.removeAt(index);
    }
  }


  crearEstadoTurno(uid: string): EstadoTurno {
    this.estadoTurno = {
      id: uid,
      disponible: true,
      reservado: false,
      aceptado: false,
      rechazado: false,
      finalizado: false,
      resenia: false,
      encuesta: false,
      calificacion: false
    }

    return this.estadoTurno;
  }

}
