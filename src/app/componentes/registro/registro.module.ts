import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPageComponent } from './registro-page/registro-page.component';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { RegistroEspecialistaComponent } from './registro-especialista/registro-especialista.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavComponent } from './nav/nav.component';


@NgModule({
  declarations: [
    RegistroPageComponent,
    RegistroUsuarioComponent,
    RegistroEspecialistaComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroRoutingModule,
    NgxSpinnerModule
  ]
})
export class RegistroModule { }
