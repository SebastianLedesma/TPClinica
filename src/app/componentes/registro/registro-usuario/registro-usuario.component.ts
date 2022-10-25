import { Component, OnInit } from '@angular/core';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import { Paciente } from '../clases/paciente';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
    edad: [0, [Validators.required, Validators.min(18), Validators.max(99)]],
    obraSocial: ['', [Validators.required]],
    mail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    imagenUno: ['', [Validators.required]],
    imagenDos: ['', [Validators.required]]
  })

  nuevoPaciente: Paciente = new Paciente;
  imagenUno: any;
  imagenDos: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private storage: Storage, private _firestoreService: FirestoreService,private router:Router,private spinerService:SpinnerService) { }

  ngOnInit(): void {
  }

  async enviar() {
    if (this.formulario.valid) {
      this.spinerService.mostrarSpinner();

      this.subirImagen(this.imagenUno, 'imagenUno');
      this.subirImagen(this.imagenDos, 'imagenDos');

      const resp = await this.authService.registrar(this.formulario.get('mail')?.value, this.formulario.get('password')?.value)
        .catch(error => {
          this.spinerService.ocultarSpinner();
          console.log(error);
        });

      if (resp) {
        this._firestoreService.agregarDoc(this.crearPaciente(resp.user!.uid), 'pacientes', resp.user!.uid).then(resp => {
          this.authService.enviarMailDeVerificacion();
          this.spinerService.ocultarSpinner();
          this.router.navigate(['']);
        })
          .catch(error => console.log(error));
      }


      this.formulario.reset();
    }
  }

  uploadImagen(event: any, idImagen: string) {

    switch (idImagen) {
      case 'imagenUno':
        this.imagenUno = event.target.files[0];
        break;
      case 'imagenDos':
        this.imagenDos = event.target.files[0];
        break;
      default:
        console.log('Id invalido.');
        break;
    }
  }


  subirImagen(imagen: any, idImagen: string) {
    const imgRef = ref(this.storage, `pacientes/${idImagen}_${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`);

    uploadBytes(imgRef, imagen)
      .then(resp => console.log(resp))
      .catch(error => console.log(error));
  }


  crearPaciente(uid: string): Paciente {

    let pathImagen: string = `${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`;

    this.nuevoPaciente = {
      id: uid,
      nombre: this.formulario.get('nombre')?.value,
      apellido: this.formulario.get('apellido')?.value,
      edad: this.formulario.get('edad')?.value,
      dni: this.formulario.get('dni')?.value,
      mail: this.formulario.get('mail')?.value,
      obraSocial: this.formulario.get('obraSocial')?.value,
      imagenUno: `imagenUno_${pathImagen}`,
      imagenDos: `imagenDos_${pathImagen}`
    }

    return this.nuevoPaciente;
  }

}
