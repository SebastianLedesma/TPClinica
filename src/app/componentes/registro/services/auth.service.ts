import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'
//import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authService: AngularFireAuth) { }


  async registrar(email: string, password: string) {
    return await this.authService.createUserWithEmailAndPassword(email, password);
  }

  async loginUsuario(email: string, password: string) {
    return await this.authService.signInWithEmailAndPassword(email, password);
  }

  async enviarMailDeVerificacion() {
    return (await this.authService.currentUser)?.sendEmailVerification();
  }

  async obtenerUsuario(){
    return this.authService.currentUser;
  }

  getInfoUsuarioLogueado(){
    return this.authService.authState;
  }

  getIdUsuario(){
    const auth = getAuth();
    const id = auth.currentUser?.uid;

    return id;
  }

  logOut(){
    this.authService.signOut();
  }

}