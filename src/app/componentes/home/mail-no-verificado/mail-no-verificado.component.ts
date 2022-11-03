import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';

@Component({
  selector: 'app-mail-no-verificado',
  templateUrl: './mail-no-verificado.component.html',
  styleUrls: ['./mail-no-verificado.component.scss']
})
export class MailNoVerificadoComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  reenviarMail(){
    this.authService.enviarMailDeVerificacion();
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['']);
  }

  openNav() {
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }

}
