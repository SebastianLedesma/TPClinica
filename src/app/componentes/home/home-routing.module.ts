import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomePacienteComponent } from './home-paciente/home-paciente.component';
import { HomeEspecialistaComponent } from './home-especialista/home-especialista.component';
import { EspecialistaGuard } from './guard/especialista.guard';
import { ControlComponent } from './home-admin/control/control.component';
import { AltaAdminComponent } from './home-admin/alta-admin/alta-admin.component';

const routes:Routes=[
  {
    path:'',
    component: HomePageComponent,
    children:[
      {
        path:'admin',
        component:HomeAdminComponent,
        children:[
          {
            path:'alta',
            component:AltaAdminComponent
          },
          {
            path:'control',
            component:ControlComponent
          }
        ]
      },
      {
        path:'paciente',
        component:HomePacienteComponent
      },
      {
        path:'especialista',
        component:HomeEspecialistaComponent,
        canActivate:[EspecialistaGuard]
      }
    ]
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
export class HomeRoutingModule { }
