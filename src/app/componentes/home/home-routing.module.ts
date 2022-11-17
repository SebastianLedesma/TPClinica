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
import { MailNoVerificadoComponent } from './mail-no-verificado/mail-no-verificado.component';
import { PerfilNoVerificadoComponent } from './perfil-no-verificado/perfil-no-verificado.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AgendaComponent } from './home-especialista/agenda/agenda.component';
import { SolicitarTurnoComponent } from './shared/solicitar-turno/solicitar-turno.component';
import { TurnosPacienteComponent } from './home-paciente/turnos-paciente/turnos-paciente.component';
import { TurnosAdminComponent } from './home-admin/turnos-admin/turnos-admin.component';
import { TurnoEspecialistaComponent } from './home-especialista/turno-especialista/turno-especialista.component';
import { UsuariosComponent } from './home-admin/usuarios/usuarios.component';
import { PacientesComponent } from './home-especialista/pacientes/pacientes.component';
import { InformesComponent } from './home-admin/informes/informes.component';

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
            path:'mi-perfil',
            component: PerfilComponent
          },
          {
            path:'solicitar-turno',
            component: SolicitarTurnoComponent
          },
          {
            path:'alta',
            component:AltaAdminComponent
          },
          {
            path:'mis-turnos',
            component: TurnosAdminComponent
          },
          {
            path:'control',
            component:ControlComponent
          },
          {
            path:'usuarios',
            component:UsuariosComponent
          },
          {
            path:'informes',
            component:InformesComponent
          }
        ]
      },
      {
        path:'paciente',
        component:HomePacienteComponent,
        children:[
          {
            path:'mi-perfil',
            component: PerfilComponent
          },
          {
            path:'solicitar-turno',
            component: SolicitarTurnoComponent
          },
          {
            path:'mis-turnos',
            component: TurnosPacienteComponent
          }
        ]
      },
      {
        path:'especialista',
        component:HomeEspecialistaComponent,
        canActivate:[EspecialistaGuard],
        children:[
          {
            path:'mi-perfil',
            component: PerfilComponent
          },
          {
            path:'mis-turnos',
            component: TurnoEspecialistaComponent
          },
          {
            path:'agenda',
            component: AgendaComponent
          },
          {
            path:'pacientes',
            component: PacientesComponent
          }
        ]
      },
      {
        path:'mail-no-verificado',
        component: MailNoVerificadoComponent
      },{
        path:'perfil-no-verificado',
        component: PerfilNoVerificadoComponent
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
