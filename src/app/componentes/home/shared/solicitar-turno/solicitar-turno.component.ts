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
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';


@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  arrayIconos:any[]=[];

  uidPaciente: string = '';
  pacienteLogueado: Paciente = new Paciente();

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

  ArrayImagenesEspecialistas: any[] = [];

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private router: Router, private authService: AuthService, private estadoTurnoService: EstadoTurnoService, private firestore: Firestore, private storage: Storage) { }

  ngOnInit() {

    this.spinnerService.mostrarSpinner();

    if (this.router.url.includes('paciente')) {
      this.authService.getInfoUsuarioLogueado()
        .subscribe(resp => {
          localStorage.setItem('id_paciente', resp?.uid!);

          this.fireStoreService.obtenerDoc('pacientes', resp?.uid!)
            .then(resp => {
              this.pacienteLogueado = resp.data()!;
            })
        })
    }

    this.fireStoreService.obtenerDocs('turnos_disponibles')
      .subscribe(resp => {
        this.turnosDisponibles = resp;
      });

    this.fireStoreService.obtenerDocs('especialistas')
      .subscribe(resp => {
        this.spinnerService.ocultarSpinner();
        this.ArrayImagenesEspecialistas=[];
        this.especialistas=[];
        this.especialistas = resp.filter(esp => esp.habilitado === true);
        console.log(this.especialistas);
        for (let index = 0; index < this.especialistas.length; index++) {
          let element = this.especialistas[index];
          this.obtenerImagenes(`${element.nombre} ${element.apellido}`, element.imagenUno!, element.id!);
        }

      })
      ;

  }

  obtenerImagenes(nombreEspecialista: string, nombreImgen: string, id_esp: string) {
    const imgRef = ref(this.storage, `especialistas/${nombreImgen}`);

    getDownloadURL(imgRef)
      .then(url => {
        this.ArrayImagenesEspecialistas.push({ 'especialista': nombreEspecialista, 'imagen': url, 'id': id_esp });
      })
  }



  mostrarEspecialistas(filtroEspecialidad: string) {
    this.divTurnos = false;
    this.especialidadElegida = filtroEspecialidad;
    this.divEspecialistas = true;
    this.especialistasAMostrar = this.especialistas.filter(esp => esp.especialidad?.includes(filtroEspecialidad));
  }

  mostrarEspecialidades(esp: any) {
    this.arrayIconos=[];
    this.turnosAMostrar=[];
    this.divTurnos=false;
    let indice = 0;
    for (let index = 0; index < this.especialistas.length; index++) {
      const element = this.especialistas[index];
      if (element.id === esp.id) {
        indice = index;
        break;
      }
    }

    this.especialidades = this.especialistas[indice].especialidad!;
    this.especialistaSeleccionado = this.especialistas[indice];

    for (let index = 0; index < this.especialidades.length; index++) {
      const element = this.especialidades[index];
      if(element === 'cardiologia'){
        this.arrayIconos.push({'especialidad':element,'icono': './../../../../../assets/imagenes/cardiologia.png'});
      }else if(element === 'otorrino'){
        this.arrayIconos.push({'especialidad':element,'icono': './../../../../../assets/imagenes/otorrino.png'});
      }else if(element === 'pediatria'){
        this.arrayIconos.push({'especialidad':element,'icono': './../../../../../assets/imagenes/pediatra.png'});
      }else if(element === 'traumatologia'){
        this.arrayIconos.push({'especialidad':element,'icono': './../../../../../assets/imagenes/traumatologia.png'});
      }else {
        this.arrayIconos.push({'especialidad':element,'icono': './../../../../../assets/imagenes/medico-clinico.png'});
      }
      
    }

    //console.log(this.especialidades);
  }


  mostrarTurnos(especialidad: string) {
    this.especialidadElegida = especialidad;
    this.turnosAMostrar = [];
    this.divTurnos = true;
    let fechaDeHoy = new Date();

    this.turnosAMostrar = this.turnosDisponibles.filter(turno => {
      //console.log(turno.fecha);
      if (turno.especialidad?.toLocaleLowerCase() === especialidad && turno.nombreEspecialista === `${this.especialistaSeleccionado.nombre} ${this.especialistaSeleccionado.apellido}`) {

        if (!(turno.fecha instanceof Date)) {
          let date = new Date(turno.fecha.seconds * 1000);
          turno.fecha = date;
        }

        let dias = Math.ceil((turno.fecha.getTime() - fechaDeHoy.getTime()) / 1000 / 60 / 60 / 24);
        //console.log(turno.fecha);
        if (dias <= 15) {
          return true;
        } else {
          return false;
        }

      } else {
        return false;
      }

    })
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
    let nombrePaciente: string = '';
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

  guardarTurno(paciente?: Paciente) {
    let id: string = '';
    let nombrePaciente: string = '';
    this.spinnerService.mostrarSpinner();

    const turno = this.crearTurnoReservado(paciente);

    this.fireStoreService.agregarDoc(turno, 'turnos_reservados', this.turnoSeleccionado.id)
      .then(resp => {
        console.log('turno reservado');

        this.estadoTurnoService.cambiarAReservado(this.turnoSeleccionado.id)
          .then(update => {
            console.log('actualizado');

            this.estadoTurnoService.borrarTurno('turnos_disponibles', this.turnoSeleccionado.id)
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

    this.divTurnos = false;
    this.divPacientes = false;
    this.actualizarTurnos(this.especialidadElegida);
  }


  async actualizarTurnos(especialidad:string) {
    const registros = (await this.fireStoreService.obtenerDoc('contador_por_especialidad', '6qoiDPDpaL4rFm5LgSuT')).data();

    if (registros) {
      let turnosRegistro:any[] = registros['turnos'];

      turnosRegistro = turnosRegistro.map(valor =>{
        if(valor.especialidad === especialidad){
          valor.cantidad -= 1;
        }
        return valor;
      })
      this.fireStoreService.agregarDoc({ turnos: turnosRegistro }, 'contador_por_especialidad', '6qoiDPDpaL4rFm5LgSuT')
        .catch(error => console.log(error));

    }
  }

}
