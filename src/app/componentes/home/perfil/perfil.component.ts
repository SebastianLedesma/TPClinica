import { Component, OnInit } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';
import { FirestoreService } from '../../registro/services/firestore.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  url: string = '';

  uidUsuario:string='';
  datosAEnviar = {
    especialista:'',
    id_paciente:''
  };

  turnosFinalizados: any[] = [];
  nombre: string = '';
  apellido: string = '';
  edad: number = 0;
  dni: string = '';
  mail: string = '';
  imagenUno = '';
  imagenDos = '';
  especialidades = [] = [];
  urlImgenUno: string = '';
  urlImagenDos: string = '';
  obraSocial: string = '';

  arrayEspecialistas:string[]=[];

  mostrarHistoria: boolean = false;

  constructor(private router: Router, private authService: AuthService, private firestoreService: FirestoreService, private spinnerService: SpinnerService,
    private storage: Storage) { }

  ngOnInit(): void {
    this.mostrarHistoria = false;
    this.url = this.router.url;

    this.spinnerService.mostrarSpinner();

    this.authService.getInfoUsuarioLogueado()
      .subscribe(resp => {

        localStorage.setItem('id_paciente',resp.uid);
        this.uidUsuario = resp?.uid!;

        if (this.uidUsuario) {

          if (this.url.includes('paciente')) {
            this.obtenerUsuario('pacientes',this.uidUsuario);
          } else if (this.url.includes('admin')) {
            this.obtenerUsuario('administradores', this.uidUsuario);
          } else {
            this.obtenerUsuario('especialistas', this.uidUsuario);
          }
        }

      });
  }


  async obtenerUsuario(nombreCollection: string, uid: string) {
    const resp = (await this.firestoreService.obtenerDoc(nombreCollection, uid)).data();
    console.log(uid);
    if (resp) {
      this.nombre = resp?.['nombre'];
      this.apellido = resp?.['apellido'];
      this.edad = resp?.['edad'];
      this.mail = resp?.['mail'];
      this.dni = resp?.['dni'];
      this.imagenUno = resp?.['imagenUno'];

      if (nombreCollection === 'pacientes') {
        this.obraSocial = resp?.['obraSocial'];
        this.imagenDos = resp?.['imagenDos'];
        this.obtenerImagenes('pacientes', this.imagenUno);
        this.obtenerImagenes('pacientes', this.imagenDos);

        this.mostrarHistoria = true;

        this.firestoreService.obtenerDocs('diagnostico_turnos')
          .subscribe(resp => {
            this.arrayEspecialistas=[];

            this.turnosFinalizados = resp.filter(turnoFinalizado => {

              if (turnoFinalizado.nombre_paciente === `${this.nombre} ${this.apellido}`) {
                if(!this.arrayEspecialistas.includes(turnoFinalizado.nombreEspecialista)){
                  this.arrayEspecialistas.push(turnoFinalizado.nombreEspecialista);
                }

                return true;
              } else {
                return false;
              }
            })
            this.spinnerService.ocultarSpinner();
          })

      } else if (nombreCollection === 'especialistas') {
        this.especialidades = resp?.['especialidad'];

        this.obtenerImagenes('especialistas', this.imagenUno);
      } else {
        this.obtenerImagenes('administradores', this.imagenUno);
      }
    }
  }

  obtenerImagenes(path: string, nombreImgen: string) {
    const imgRef = ref(this.storage, `${path}/${nombreImgen}`);

    getDownloadURL(imgRef)
      .then(url => {
        if (nombreImgen.includes('Uno')) {
          this.urlImgenUno = url;
        } else {
          this.urlImagenDos = url;
        }
        this.spinnerService.ocultarSpinner();
      })
  }

  seleccionarEspecialista(especialista:string){
    this.datosAEnviar ={
      especialista: especialista,
      id_paciente : localStorage.getItem('id_paciente')
    }
    //console.log(especialista);
  }
}
