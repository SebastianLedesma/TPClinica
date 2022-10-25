import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';
import { FirestoreService } from '../../registro/services/firestore.service';
import { EspecialistaService } from '../../services/especialista.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home-especialista',
  templateUrl: './home-especialista.component.html',
  styleUrls: ['./home-especialista.component.scss']
})
export class HomeEspecialistaComponent implements OnInit {

  //especialista:any;

  constructor(private fireStoreService:FirestoreService,private authService:AuthService,private spinnerService:SpinnerService,private especialistaService:EspecialistaService,private router:Router) { }

  ngOnInit(): void {
    //this.authService.obtenerUsuario().then( resp => this.especialista = resp);
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
