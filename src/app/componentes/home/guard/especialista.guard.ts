import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../registro/services/auth.service';
import { FirestoreService } from '../../registro/services/firestore.service';
import { SpinnerService } from '../../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaGuard implements CanActivate {

  constructor(private authService:AuthService,private fireStoreService:FirestoreService,private spinnerService:SpinnerService){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    
      this.spinnerService.mostrarSpinner();
      const uid = this.authService.getIdUsuario();
      const doc = (await this.fireStoreService.obtenerDoc('especialistas',uid!)).data();
      this.spinnerService.ocultarSpinner();
      
      if(doc?.habilitado){
        return true;
      }else{
        return false;
      }
      
  }
  
}
