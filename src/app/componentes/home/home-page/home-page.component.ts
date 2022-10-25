import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  usuario:any;

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(){
    this.authService.getInfoUsuarioLogueado()
    .subscribe( resp => {
      this.usuario = resp;
    })
  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['']);
  }

  openNav() {
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

}
