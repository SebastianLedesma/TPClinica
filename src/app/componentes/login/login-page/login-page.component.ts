import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { url } from 'inspector';
import { AuthService } from '../../registro/services/auth.service';
import { FirestoreService } from '../../registro/services/firestore.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  usuarios:any[]=[
    {mail:'nuhlockdjizgxukbqg@tmmwj.net',password:'123456'},
    {mail:'titogomeztplabo@outlook.es', password:'123456'},//esp
    {mail:'lauradiaztplabo@outlook.com', password:'123456'},//esp
    {mail:'fzfpfybxwqeqnzdwye@tmmbt.com', password:'123456'},//esp
    {mail:'ricardoledesmainfolaboral@gmail.com', password:'123456'},//pac
    {mail:'mariagomeztplabo@outlook.com', password:'123456'},//pac
    {mail:'juanpereztplabo@outlook.com', password:'123456'},//pac

  ]

  urlImagenAdmin:string='';
  urlImagenTito:string='';
  urlImagenLaura:string='';
  urlImagenJuan:string='';
  urlImagenRicardo:string='';
  urlImagenMaria:string='';
  urlImagenDario:string='';

  formulario: FormGroup = this.fb.group({
    mail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  usuarioPerfil:string='';
  mensaje:string='';

  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router, private spinnerService:SpinnerService,private storage: Storage,private _firestoreService: FirestoreService) { }


  ngOnInit(): void {
    this.spinnerService.mostrarSpinner();
    this.obtenerImagenes('administradores','imagenUno_12011201_Ledesma','admin');
    this.obtenerImagenes('pacientes','imagenUno_12131213_Perez','juan');
    this.obtenerImagenes('pacientes','imagenUno_23232323_Ledesma','ricardo');
    this.obtenerImagenes('pacientes','imagenUno_18171817_Gomez','maria');
    this.obtenerImagenes('especialistas','imagenUno_23232323_Gomez','tito');
    this.obtenerImagenes('especialistas','imagenUno_19435544_Diaz','laura');
    this.obtenerImagenes('especialistas','imagenUno_21211010_Gonzalez','dario');
  }

  cargarDatos(perfil:string,id?:string){
    this.usuarioPerfil = perfil;
    
    if(this.usuarioPerfil === 'admin'){
      this.formulario.controls['mail'].setValue(this.usuarios[0].mail);
      this.formulario.controls['password'].setValue(this.usuarios[0].password);
    }else {
      let idNro:number = Number.parseInt(id!);
      this.formulario.controls['mail'].setValue(this.usuarios[idNro].mail);
      this.formulario.controls['password'].setValue(this.usuarios[idNro].password);
    }
   
  }

  async onSubmit(){
    let perfil:string;
    this.mensaje = '';
    let mail:string = this.formulario.get('mail')?.value;
    let password:string = this.formulario.get('password')?.value;
    if(this.formulario.valid){

      this.spinnerService.mostrarSpinner();

      this.authService.loginUsuario(mail,password)
      .then( async resp =>{
        if(resp.user){
          
          if(resp!.user?.emailVerified){
            
            if(this.usuarioPerfil === 'paciente'){
              perfil='paciente';
              this.router.navigate(['home/paciente']);
             
            }else if(this.usuarioPerfil === 'especialista' || this.formulario.get('mail').value === 'jpyuietrspltmgawwu@tmmwj.com'){
              perfil='especialista'
              this.router.navigate(['home/especialista']);
            }else{
              perfil='administrador';
              this.router.navigate(['home/admin']);
            }
            
          }else{
            this.router.navigate(['home/mail-no-verificado']);
            this.spinnerService.ocultarSpinner();
          }

          const registros = (await this._firestoreService.obtenerDoc('log_ingresos', 'tRnmct579pHa8O4tOHn6')).data();

          if(registros){
            let fechaHoy = new Date;
            let registroLog = registros['ingresos'];
            registroLog.push({email: this.formulario.get('mail').value , fecha: fechaHoy, rol: perfil});
            this._firestoreService.agregarDoc({ingresos: registroLog},'log_ingresos','tRnmct579pHa8O4tOHn6')
            .catch(error => console.log(error));
            
          }

          this.spinnerService.ocultarSpinner();
        }else{
          this.mensaje = 'No hay registros con estos datos.';
          this.spinnerService.ocultarSpinner();
        }

      })
      .catch( error =>{
        this.mensaje = 'No hay registros con estos datos.';
        this.spinnerService.ocultarSpinner();
      })
    }else{
      this.formulario.markAllAsTouched();
    }
  }


  obtenerImagenes(path: string, nombreImgen: string,src:string) {
    const imgRef = ref(this.storage, `${path}/${nombreImgen}`);

    getDownloadURL(imgRef)
      .then(url => {
        if(src.includes('admin')){
          this.urlImagenAdmin = url;
        }else if(src.includes('ricardo')){
          this.urlImagenRicardo=url;
        }else if(src.includes('juan')){
          this.urlImagenJuan = url;
        }else if(src.includes('maria')){
          this.urlImagenMaria=url;
        }else if(src.includes('tito')){
          this.urlImagenTito = url;
        }else if(src.includes('laura')){
          this.urlImagenLaura = url;
        }else{
          this.urlImagenDario=url;
        }
        //console.log(src);
        this.spinnerService.ocultarSpinner();
      })
  }

}
