import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPageComponent } from './registro-page/registro-page.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { RegistroEspecialistaComponent } from './registro-especialista/registro-especialista.component';

const routes:Routes=[
  {
    path:'',
    component: RegistroPageComponent,
  },
  {
    path:'registro-paciente',
    component: RegistroUsuarioComponent
  },
  {
    path:'registro-especialista',
    component: RegistroEspecialistaComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class RegistroRoutingModule { }
