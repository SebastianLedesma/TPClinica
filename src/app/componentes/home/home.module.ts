import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomePacienteComponent } from './home-paciente/home-paciente.component';
import { HomeEspecialistaComponent } from './home-especialista/home-especialista.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AltaAdminComponent } from './home-admin/alta-admin/alta-admin.component';
import { ControlComponent } from './home-admin/control/control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MailNoVerificadoComponent } from './mail-no-verificado/mail-no-verificado.component';
import { PerfilNoVerificadoComponent } from './perfil-no-verificado/perfil-no-verificado.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AgendaComponent } from './home-especialista/agenda/agenda.component';
import { SolicitarTurnoComponent } from './shared/solicitar-turno/solicitar-turno.component';
import { TurnosPacienteComponent } from './home-paciente/turnos-paciente/turnos-paciente.component';
import { TurnosAdminComponent } from './home-admin/turnos-admin/turnos-admin.component';
import { TurnoEspecialistaComponent } from './home-especialista/turno-especialista/turno-especialista.component';
import { HistoriaClinicaComponent } from './shared/historia-clinica/historia-clinica.component';
import { UsuariosComponent } from './home-admin/usuarios/usuarios.component';
import { PacientesComponent } from './home-especialista/pacientes/pacientes.component';



@NgModule({
  declarations: [
    HomeAdminComponent,
    HomePacienteComponent,
    HomeEspecialistaComponent,
    AltaAdminComponent,
    ControlComponent,
    MailNoVerificadoComponent,
    PerfilNoVerificadoComponent,
    PerfilComponent,
    AgendaComponent,
    SolicitarTurnoComponent,
    TurnosPacienteComponent,
    TurnosAdminComponent,
    TurnoEspecialistaComponent,
    HistoriaClinicaComponent,
    UsuariosComponent,
    PacientesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports:[
    UsuariosComponent
  ]
})
export class HomeModule { }
