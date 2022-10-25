import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomePacienteComponent } from './home-paciente/home-paciente.component';
import { HomeEspecialistaComponent } from './home-especialista/home-especialista.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AltaAdminComponent } from './home-admin/alta-admin/alta-admin.component';
import { ControlComponent } from './home-admin/control/control.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeAdminComponent,
    HomePacienteComponent,
    HomeEspecialistaComponent,
    AltaAdminComponent,
    ControlComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class HomeModule { }
