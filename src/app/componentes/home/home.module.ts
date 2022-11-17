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
import { ColorButtonDirective } from './directives/color-button.directive';
import { DiaEnEspaniolPipe } from './pipes/dia-en-espaniol.pipe';
import { MesEnEspaniolPipe } from './pipes/mes-en-espaniol.pipe';
import { NombreAbreviadoPipe } from './pipes/nombre-abreviado.pipe';
import { ResaltarDirective } from './directives/resaltar.directive';
import { AsistenteDirective } from './directives/asistente.directive';
import { InformesComponent } from './home-admin/informes/informes.component';



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
    PacientesComponent,
    ColorButtonDirective,
    DiaEnEspaniolPipe,
    MesEnEspaniolPipe,
    NombreAbreviadoPipe,
    ResaltarDirective,
    AsistenteDirective,
    InformesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports:[
    UsuariosComponent,
    ColorButtonDirective,
    AsistenteDirective
  ]
})
export class HomeModule { }
