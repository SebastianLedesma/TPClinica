import { Component, OnInit } from '@angular/core';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';
import { Administrador } from '../clases/administrador.class';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.scss']
})
export class AltaAdminComponent implements OnInit {

  displayStyle:string="none";
  colorPalabra:string='';
  palabraAMostrar:string='';
  respuesta:string='';
  jsonColor:any;

  arrayDeColores:any[]=[
    {colorIngles:'red',colorEspaniol:'rojo'},{colorIngles:'yellow',colorEspaniol:'amarillo'},{colorIngles:'blue',colorEspaniol:'azul'},{colorIngles:'green',colorEspaniol:'verde'},
    {colorIngles:'black',colorEspaniol:'negro'},{colorIngles:'pink',colorEspaniol:'rosa'},
    {colorIngles:'orange',colorEspaniol:'naranja'}
  ]

  arrayPalabras:string[]=['rojo','azul','verde','amarillo','naranja','negro','marron'];


  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
    edad: [0, [Validators.required, Validators.min(18), Validators.max(99)]],
    mail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    imagenUno: ['', [Validators.required]]
  })


  nuevoAdmin:Administrador = new Administrador();
  imagenUno: any;


  constructor(private fb: FormBuilder, private authService: AuthService, private storage: Storage, private _firestoreService: FirestoreService, private router: Router, private spinerService: SpinnerService) { }

  ngOnInit(): void {
  }

  async enviar() {
    if (this.formulario.valid) {
      this.spinerService.mostrarSpinner();

      this.subirImagen(this.imagenUno, 'imagenUno');

      const resp = await this.authService.registrar(this.formulario.get('mail')?.value, this.formulario.get('password')?.value)
        .catch(error => {
          this.spinerService.ocultarSpinner();
          console.log(error);
        });

      if (resp) {
        this._firestoreService.agregarDoc(this.crearAdmin(resp.user!.uid), 'administradores', resp.user!.uid).then(resp => {
          this.authService.enviarMailDeVerificacion();
          this.spinerService.ocultarSpinner();
          this.router.navigate(['home/admin']);
        })
          .catch(error => console.log(error));
      }


      this.formulario.reset();
    }
  }

  uploadImagen(event: any) {
    this.imagenUno = event.target.files[0];
  }


  subirImagen(imagen: any, idImagen: string) {
    const imgRef = ref(this.storage, `administradores/${idImagen}_${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`);

    uploadBytes(imgRef, imagen)
      .then(resp => console.log(resp))
      .catch(error => console.log(error));
  }


  crearAdmin(uid: string) {
    let pathImagen: string = `${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`;

    this.nuevoAdmin = {
      id: uid,
      nombre: this.formulario.get('nombre')?.value,
      apellido: this.formulario.get('apellido')?.value,
      edad: this.formulario.get('edad')?.value,
      mail: this.formulario.get('mail')?.value,
      dni: this.formulario.get('dni')?.value,
      imagenUno: `imagenUno_${pathImagen}`
    }
    
    return this.nuevoAdmin;
  }

  mostrarCaptcha(){
    this.displayStyle="block";
    this.jsonColor = this.arrayDeColores[this.obtenerNumeroAleatorio(0,6)]
    this.colorPalabra = this.jsonColor.colorIngles;

    this.palabraAMostrar = this.arrayPalabras[this.obtenerNumeroAleatorio(0,6)];
    console.log(this.colorPalabra);
    console.log(this.palabraAMostrar);
  }

  verificarCaptcha(){
    if(this.jsonColor.colorEspaniol === this.respuesta){
      this.enviar();
      console.log('acertaste')
    }

    this.closePopup();
  }

  closePopup() {
    this.displayStyle = "none";
    this.respuesta ='';
  }

  obtenerNumeroAleatorio(minimo:number,maximo:number){
    let min = Math.ceil(minimo);
    let max = Math.floor(maximo);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
