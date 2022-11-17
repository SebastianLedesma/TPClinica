import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Paciente } from 'src/app/componentes/registro/clases/paciente';
import { AuthService } from 'src/app/componentes/registro/services/auth.service';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

import * as XLSX from 'xlsx';
import { Especialista } from '../../../registro/clases/especialista.class';
import { Administrador } from '../clases/administrador.class';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  divPacientes: boolean = false;
  pacientes: Paciente[] = [];
  id_pacienteSeleccionado:string = '';

  especialistas:Especialista[]=[];
  administradores:Administrador[]=[];

  datos={
    especialista:'',
    id_paciente:''
  };
  arrayUsuarios:any[]=[];

  ArrayImagenesPacientes: any[] = [];


  constructor(private spinnerService: SpinnerService, private authService: AuthService, private fireStoreService: FirestoreService, private storage: Storage) { }

  ngOnInit(): void {

    this.spinnerService.mostrarSpinner();

    this.authService.getInfoUsuarioLogueado()
      .subscribe(resp => {
        //localStorage.setItem('id_paciente', resp?.uid!);

        this.fireStoreService.obtenerDocs('pacientes')
        .subscribe(resp => {
          //this.ArrayImagenesPacientes=[];
          this.pacientes = resp;
          this.divPacientes=true;
          for (let index = 0; index < this.pacientes.length; index++) {
            let element = this.pacientes[index];
            this.obtenerImagenes(element, element.imagenUno!, element.id!);
          }
          //this.spinnerService.ocultarSpinner();
        })

        this.fireStoreService.obtenerDocs('especialistas')
        .subscribe(resp => {
          this.especialistas = resp;
          this.divPacientes=true;
          //this.spinnerService.ocultarSpinner();
        })

        this.fireStoreService.obtenerDocs('administradores')
        .subscribe(resp => {
          this.administradores = resp;
          this.divPacientes=true;
          this.spinnerService.ocultarSpinner();
        })
      })

    
  }

  obtenerImagenes(paciente: any, nombreImgen: string, id_esp: string) {
    const imgRef = ref(this.storage, `pacientes/${nombreImgen}`);

    getDownloadURL(imgRef)
      .then(url => {
        this.ArrayImagenesPacientes.push({ 'paciente': paciente, 'imagen': url, 'id': id_esp });
      })
  }


  verHistorialPaciente(paciente:Paciente){
    //console.log(paciente);
    //this.id_pacienteSeleccionado = paciente.id!;
    //console.log(this.pacienteSeleccionado);
    localStorage.setItem('id_paciente',paciente.id);
    this.datos={
      id_paciente : paciente.id,
      especialista:''
    }
  }

  descargarExcel(){
    const nombreArchivo = 'usuarios.xlsx';
    this.administradores.forEach(usuario =>{
      this.arrayUsuarios.push(usuario);
    })

    this.especialistas.forEach(esp =>{
      this.arrayUsuarios.push(esp);
    })

    this.pacientes.forEach(pac =>{
      this.arrayUsuarios.push(pac);
    })
    console.log(this.arrayUsuarios);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayUsuarios);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb,ws,'usuarios');

    XLSX.writeFile(wb,nombreArchivo);
  }

}
