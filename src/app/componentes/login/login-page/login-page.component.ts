import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  usuarios:any[]=[
    {mail:'sebastianledesma1992@gmail.com',password:'123456'},
    {mail:'titogomeztplabo@outlook.es', password:'123456'},//esp
    {mail:'lauradiaztplabo@outlook.com', password:'123456'},//esp
    {mail:'dariogonzaleztplabo@outlook.es', password:'123456'},//esp
    {mail:'ricardoledesmainfolaboral@gmail.com', password:'123456'},//pac
    {mail:'mariagomeztplabo@outlook.com', password:'123456'},//pac
    {mail:'juanpereztplabo@outlook.com', password:'123456'},//pac

  ]

  formulario: FormGroup = this.fb.group({
    mail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  usuarioPerfil:string='';
  mensaje:string='';

  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router, private spinnerService:SpinnerService) { }


  ngOnInit(): void {
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
    this.mensaje = '';
    let mail:string = this.formulario.get('mail')?.value;
    let password:string = this.formulario.get('password')?.value;
    if(this.formulario.valid){

      this.spinnerService.mostrarSpinner();
      /*const resp = await this.authService.loginUsuario(mail,password);
      
      //VERIFICAR LAS URL
      if(resp?.user){
        if(this.usuarioPerfil === 'admin'){
          this.router.navigate(['home/admin']);

        }else if(resp!.user?.emailVerified){

          if(this.usuarioPerfil === 'paciente'){
            this.router.navigate(['home/paciente']);
          }else{
            this.router.navigate(['home/especialista']);
          }

        }else{
          this.mensaje='Verifique su mail en su casilla de correo.'
        }
        
      }else{
        this.mensaje = 'No hay registros con estos datos.';
      }
      
      this.spinnerService.ocultarSpinner();*/

      this.authService.loginUsuario(mail,password)
      .then( resp =>{
        if(resp.user){
          if(this.usuarioPerfil === 'admin'){
            this.router.navigate(['home/admin']);
  
          }else if(resp!.user?.emailVerified){
  
            if(this.usuarioPerfil === 'paciente'){
              this.router.navigate(['home/paciente']);
              //this.spinnerService.ocultarSpinner();
            }else{
              this.router.navigate(['home/especialista']);
            }
  
          }else{
            this.mensaje='Verifique su mail en su casilla de correo.'
            this.spinnerService.ocultarSpinner();
          }
          
        }else{
          this.mensaje = 'No hay registros con estos datos.';
          this.spinnerService.ocultarSpinner();
        }
        //console.log('Ya lo dejé pasar.');
        this.spinnerService.ocultarSpinner();
      })
      .catch( error =>{
        this.mensaje = 'No hay registros con estos datos.';
        this.spinnerService.ocultarSpinner();
      })
    }else{
      this.formulario.markAllAsTouched();
    }
  }

}
