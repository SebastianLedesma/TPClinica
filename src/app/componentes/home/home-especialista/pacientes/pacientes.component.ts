import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
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
  arrayPacientesAMostrar: any[] = [];
  arrayNombres: string[] = [];
  arrayAtencionesPorPaciente: any[] = [];
  mostrarTabla: boolean = false;

  displayStyle: string = 'none';
  altura: number = 0;
  peso: number = 0;
  temperatura: number = 0;
  presion: number = 0;
  tituloDatoUno: string = '';
  valorDatoUno: string = '';
  tituloDatoDos: string = '';
  valorDatoDos: string = '';
  tituloDatoTres: string = '';
  valorDatoTres: string = '';
  resenia: string = '';
  infoPacientes: any[] = [];

  ArrayImagenesPacientes: any[] = [];

  constructor(private spinnerService: SpinnerService, private authService: AuthService, private fireStoreService: FirestoreService, private especialistaService: EspecialistaService, private storage: Storage) { }

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


  // verHistorialPaciente(paciente: any) {
  //   console.log(paciente);
  //   this.id_pacienteSeleccionado = paciente.id_paciente!;
  // }

  verAtenciones(paciente: any) {
    this.arrayAtencionesPorPaciente = [];
    this.arrayAtencionesPorPaciente = this.pacientes.filter(turnoFinalizado => {
      if (!(turnoFinalizado.fecha instanceof Date)) {
        let date = new Date(turnoFinalizado.fecha.seconds * 1000);
        turnoFinalizado.fecha = date;
      }

      if (turnoFinalizado.nombre_paciente === `${paciente.nombre} ${paciente.apellido}`) {
        return true;
      } else {
        return false;
      }
    });

    this.mostrarTabla = true;
  }

  verResenia(turnoSeleccionado: any) {
    let diagnostico = this.arrayAtencionesPorPaciente.filter(turno => {
      if (turno.id_turno === turnoSeleccionado.id_turno) {
        return true;
      }
      return false;
    })

    diagnostico = diagnostico[0];
    this.resenia = diagnostico['motivo'];

    this.altura = diagnostico['altura'];
    this.peso = diagnostico['peso'];
    this.temperatura = diagnostico['temperatura'];
    this.presion = diagnostico['presion'];
    this.tituloDatoUno = diagnostico['datos_dinamicos'][0].clave;
    this.valorDatoUno = diagnostico['datos_dinamicos'][0].valor;
    this.tituloDatoDos = diagnostico['datos_dinamicos'][1]?.clave || '';
    this.valorDatoDos = diagnostico['datos_dinamicos'][1]?.valor || '';
    this.tituloDatoTres = diagnostico['datos_dinamicos'][2]?.clave || '';
    this.valorDatoTres = diagnostico['datos_dinamicos'][2]?.valor || '';
    this.displayStyle = 'block';
  }

  closePopup() {
    this.displayStyle = "none";
  }

  filtrarPacientes() {
    this.spinnerService.mostrarSpinner();
    this.fireStoreService.obtenerDocs('pacientes')
      .subscribe(resp => {
        this.infoPacientes = resp;
        this.spinnerService.ocultarSpinner();
        
        this.arrayNombres = [];
        this.arrayPacientesAMostrar = [];
        
        for (let index = 0; index < this.infoPacientes.length; index++) {
          let element = this.infoPacientes[index];

          for (let index = 0; index < this.pacientes.length; index++) {
            const paciente = this.pacientes[index].nombre_paciente;
            if (paciente === `${element.nombre} ${element.apellido}` && !this.arrayNombres.includes(paciente)) {
              this.arrayNombres.push(paciente);
              this.obtenerImagenes(element, element.imagenUno!, element.id!);
            }

          }
        }
        
      })
  }



  obtenerImagenes(paciente: any, nombreImgen: string, id_esp: string) {
    const imgRef = ref(this.storage, `pacientes/${nombreImgen}`);

    getDownloadURL(imgRef)
      .then(url => {
        if(this.ArrayImagenesPacientes.includes)
        this.ArrayImagenesPacientes.push({ 'paciente': paciente, 'imagen': url, 'id': id_esp });
      })
  }

}
