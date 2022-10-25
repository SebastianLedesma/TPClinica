import { Component, OnInit } from '@angular/core';
import { Especialista } from '../../registro/clases/especialista.class';
import { AuthService } from '../../registro/services/auth.service';
import { FirestoreService } from '../../registro/services/firestore.service';
import { EspecialistaService } from '../../services/especialista.service';
import { SpinnerService } from '../../services/spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {

  especialistas:Especialista[]=[];
  especialista:any;

  constructor(private fireStoreService:FirestoreService,private authService:AuthService,private spinnerService:SpinnerService,private especialistaService:EspecialistaService,private router:Router) { }

  ngOnInit(): void {
  }

  
  traerEspecislialistas(){
    this.spinnerService.mostrarSpinner();
    this.fireStoreService.obtenerDocs('especialistas')
    .subscribe( resp => {
      this.especialistas = resp;
      this.spinnerService.ocultarSpinner();
    })
  }

  cambiarEstado(especialista:Especialista){
    this.especialistaService.cambiarEstadoEspecialista(especialista.id!,!especialista.habilitado);
  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['']);
  }

  openNav() {
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }

}
