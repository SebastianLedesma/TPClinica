import { Component, OnInit } from '@angular/core';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import { Especialista } from '../clases/especialista.class';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
    edad: [0, [Validators.required, Validators.min(18), Validators.max(99)]],
    mail: ['', [Validators.required, Validators.email]],
    especialidad: ['', Validators.required],
    otraEspecialidad: [''],
    password: ['', [Validators.required]],
    imagenUno: ['', [Validators.required]]
  })

  eligeOtra: boolean = false;
  imagenUno: any;
  nuevoEspecialista:Especialista = new Especialista();
  extensionArch:string='';

  constructor(private fb: FormBuilder, private authService: AuthService, private storage: Storage,private _firestoreService: FirestoreService,private router:Router, private spinnerService:SpinnerService) { }

  ngOnInit(): void {
  }

  async enviar() {
    if (this.formulario.valid) {
      this.spinnerService.mostrarSpinner();
      this.subirImagen(this.imagenUno, 'imagenUno');

      const resp = await this.authService.registrar(this.formulario.get('mail')?.value, this.formulario.get('password')?.value)
        .catch(error => {
          console.log(error);
          this.spinnerService.ocultarSpinner();
        });

      if (resp) {
        this._firestoreService.agregarDoc(this.crearEspecialista(resp.user!.uid), 'especialistas', resp.user!.uid).then(resp => {
          this.authService.enviarMailDeVerificacion();
          this.spinnerService.ocultarSpinner();
          this.router.navigate(['']);
        })
          .catch(error => console.log(error));
      }

      this.formulario.reset();
    }

  }

  mostrarInput() {
    if (this.formulario.get('especialidad')?.value === 'otra') {
      this.eligeOtra = true;
      this.formulario.controls['otraEspecialidad'].setValue('');
      this.formulario.controls['otraEspecialidad'].setValidators(Validators.required);
    } else {
      this.formulario.controls['otraEspecialidad'].clearValidators();
      this.eligeOtra = false;
    }

    this.formulario.controls['otraEspecialidad'].updateValueAndValidity()
  }

  uploadImagen(event: any) {
    //let file:File = event.target.files[0];
    this.imagenUno = event.target.files[0];
    //this.extensionArch= file.type;
    //console.log(this.extensionArch);
  }


  subirImagen(imagen: any, idImagen: string) {
    const imgRef = ref(this.storage ,`especialistas/${idImagen}_${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`);

    uploadBytes(imgRef, imagen)
      .then(resp => console.log(resp))
      .catch(error => console.log(error));
  }


  crearEspecialista(uid:string){
    let pathImagen: string = `${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`;
    let especialidadIndicada:string = '';

    if(this.formulario.get('especialidad')?.value === 'otra'){
      especialidadIndicada = this.formulario.get('otraEspecialidad')?.value;
    }else{
      especialidadIndicada = this.formulario.get('especialidad')?.value;
    }

    this.nuevoEspecialista = {
      id: uid,
      nombre: this.formulario.get('nombre')?.value,
      apellido: this.formulario.get('apellido')?.value,
      edad: this.formulario.get('edad')?.value,
      dni: this.formulario.get('dni')?.value,
      mail: this.formulario.get('mail')?.value,
      especialidad: especialidadIndicada,
      habilitado:false,
      imagenUno: `imagenUno_${pathImagen}`,
    }

    return this.nuevoEspecialista;
  }

}
