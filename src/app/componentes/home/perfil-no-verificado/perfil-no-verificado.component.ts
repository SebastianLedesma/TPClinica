import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';

@Component({
  selector: 'app-perfil-no-verificado',
  templateUrl: './perfil-no-verificado.component.html',
  styleUrls: ['./perfil-no-verificado.component.scss']
})
export class PerfilNoVerificadoComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['']);
  }

  closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }

  // openNav() {
  //   document.getElementById("mySidebar")!.style.width = "250px";
  //   document.getElementById("main")!.style.marginLeft = "250px";
  // }

}
