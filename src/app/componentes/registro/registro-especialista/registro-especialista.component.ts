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
    dni: ['', [Validators.required, Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
    edad: [0, [Validators.required, Validators.min(18), Validators.max(99)]],
    mail: ['', [Validators.required, Validators.email]],
    especialidadUno: [''],
    segundaEsp: [''],
    terceraEsp: [''],
    password: ['', [Validators.required]],
    imagenUno: ['', [Validators.required]]
  })

  eligeOtra: boolean = false;
  imagenUno: any;
  nuevoEspecialista:Especialista = new Especialista();
  extensionArch:string='';
  especialidadesDisponibles:string[]=[];

  constructor(private fb: FormBuilder, private authService: AuthService, private storage: Storage,private _firestoreService: FirestoreService,private router:Router, private spinnerService:SpinnerService) { }

  async ngOnInit(): Promise<void> {
    const resp = (await this._firestoreService.obtenerDoc('especialidadesDisponibles','sF2ILmsvdrWuY1Y4Pujy')).data();
    
    if(resp?.['especialidades']){
      this.especialidadesDisponibles = resp?.['especialidades'];
    }
  }

  async enviar() {
    if (this.formulario.valid) {
      //console.log(this.formulario.value);
      this.spinnerService.mostrarSpinner();
      this.subirImagen(this.imagenUno, 'imagenUno');

      const resp = await this.authService.registrar(this.formulario.get('mail')?.value, this.formulario.get('password')?.value)
        .catch(error => {
          console.log(error);
          this.spinnerService.ocultarSpinner();
        });

      if (resp) {
        this._firestoreService.agregarDoc(this.crearEspecialista(resp.user!.uid), 'especialistas', resp.user!.uid).then(resp => {
          this.authService.enviarMailDeVerificacion().then(resp => console.log('enviado'))
          .catch(error => console.log(error));

          if(this.formulario.get('terceraEsp')?.value !== ''){
            console.log(this.formulario.get('terceraEsp')?.value);
            this.especialidadesDisponibles.push(this.formulario.get('terceraEsp')?.value);
            this._firestoreService.agregarDoc({especialidades: this.especialidadesDisponibles},'especialidadesDisponibles','sF2ILmsvdrWuY1Y4Pujy')
            .catch(error => console.log(error));

          }
          this.formulario.reset();
          this.spinnerService.ocultarSpinner();
          this.router.navigate(['']);
        })
          .catch(error => console.log(error));
      }
      
    }
  }
  

  uploadImagen(event: any) {
    this.imagenUno = event.target.files[0];
  }


  subirImagen(imagen: any, idImagen: string) {
    const imgRef = ref(this.storage ,`especialistas/${idImagen}_${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`);

    uploadBytes(imgRef, imagen)
      .then(resp => console.log(resp))
      .catch(error => console.log(error));
  }


  crearEspecialista(uid:string){
    let pathImagen: string = `${this.formulario.get('dni')?.value}_${this.formulario.get('apellido')?.value}`;
  
    let arrayEspecialidades:string[]=[];
    if(this.formulario.get('especialidadUno')?.value !==''){
      arrayEspecialidades.push(this.formulario.get('especialidadUno')?.value);
    }

    if(this.formulario.get('segundaEsp')?.value !==''){
      arrayEspecialidades.push(this.formulario.get('segundaEsp')?.value);
    }

    if(this.formulario.get('terceraEsp')?.value !==''){
      arrayEspecialidades.push(this.formulario.get('terceraEsp')?.value);
    }

    this.nuevoEspecialista = {
      id: uid,
      nombre: this.formulario.get('nombre')?.value,
      apellido: this.formulario.get('apellido')?.value,
      edad: this.formulario.get('edad')?.value,
      dni: this.formulario.get('dni')?.value,
      mail: this.formulario.get('mail')?.value,
      especialidad: arrayEspecialidades,
      habilitado:false,
      imagenUno: `imagenUno_${pathImagen}`,
    }

    return this.nuevoEspecialista;
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
