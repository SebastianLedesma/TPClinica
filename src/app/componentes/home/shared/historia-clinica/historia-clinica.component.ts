import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';
import { Paciente } from '../../../registro/clases/paciente';

import pdfMake from "pdfmake/build/pdfmake"; 
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() datos:any;
  turnosFinalizados:any[]=[];
  paciente:Paciente = new Paciente();

  mostrarBotonPDF:boolean=false;
  mostrarBotonExcel:boolean=false;

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService, private router:Router) { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    //console.log('dispara onchacnge.');
    this.datos.id_paciente = localStorage.getItem('id_paciente') || '';
    this.mostrarBotonPDF=false;
    
    if(this.datos.id_paciente){
      this.spinnerService.mostrarSpinner();
  
      const resp = (await this.fireStoreService.obtenerDoc('pacientes',changes['datos'].currentValue.id_paciente)).data();
  
      if(resp){
        this.paciente = resp;
      }
  
      this.fireStoreService.obtenerDocsPorId('diagnostico_turnos',changes['datos'].currentValue.id_paciente)
      .then( (registros: any[]) => {
        this.turnosFinalizados = registros.map(turno => {
          let date = new Date(turno.fecha.seconds * 1000);
          turno.fecha = date;

          return turno;
        });

        this.turnosFinalizados = this.turnosFinalizados.filter(turno => {
          if(changes['datos'].currentValue.especialista === ''){
            return true;
          }else if(turno.nombreEspecialista === changes['datos'].currentValue.especialista){
            return true;
          }
          return false;
        })

        if(this.turnosFinalizados.length && !this.router.url.includes('pacientes') && !this.router.url.includes('admin')){
          this.mostrarBotonPDF=true;
        }

        if(this.turnosFinalizados.length && this.router.url.includes('admin')){
          this.mostrarBotonExcel=true;
        }
        // console.log(this.turnosFinalizados);
        this.spinnerService.ocultarSpinner();
      })
    }
   
  }


  async descargarPDF(){
    let fecha = Date.now();
    let fechaCorrecta = new Date(fecha);
    let fechaCadena = `${fechaCorrecta.getDate()}/${fechaCorrecta.getMonth() + 1} del ${fechaCorrecta.getFullYear()}`;

    let cadenaTurnos:string='';

    for (let index = 0; index < this.turnosFinalizados.length; index++) {
      let element = this.turnosFinalizados[index];
      cadenaTurnos += `FECHA: ${element.fecha.getDate()}/${element.fecha.getMonth() + 1} del ${element.fecha.getFullYear()}\n\n`;

      cadenaTurnos += `Diagnóstico: ${element.motivo}\n\n`;
      cadenaTurnos += `Especialidad: ${element.especialidad}\t\tNombre: ${element.nombreEspecialista}\n`;
      cadenaTurnos += `Altura: ${element.altura}\t\t\tPeso: ${element.peso}\t\t\tPresión: ${element.presion}\n`;
      cadenaTurnos += `Temperatura: ${element.temperatura} \t\t\t${element.datos_dinamicos[0].clave}: ${element.datos_dinamicos[0].valor}`
      if(element.datos_dinamicos[1]?.clave != null){
        cadenaTurnos += `\t\t\t${element.datos_dinamicos[1].clave}: ${element.datos_dinamicos[1].valor}`;
      }

      if(element.datos_dinamicos[2]?.clave != null){
        cadenaTurnos += `\n${element.datos_dinamicos[2].clave}: ${element.datos_dinamicos[2].valor}\n`;
      }

      cadenaTurnos += '\n-----------------------------------------------------------------------\n';
    }

    let docDefinition = {  
      content: [
        {
          image: await this.getBase64ImageFromURL('../../../../../assets/imagenes/hospital-banner-background_6222425.jpg'),
          width: 180,
			    height: 120
        },
        'TP-Clínica',
        {
          stack: [
            `Historia clínica de ${this.paciente.nombre} ${this.paciente.apellido}`,
            {text: `Fecha de emisión: ${fechaCadena}`, style: 'subheader'},
          ],
          style: 'header'
        },
        {
          text: [cadenaTurnos,
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 40, 0, 40]
        },
        subheader: {
          fontSize: 14
        },
        superMargin: {
          margin: [20, 0, 40, 0],
          fontSize: 15
        }
      }

    };  
   
    pdfMake.createPdf(docDefinition).open();
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  descargarExcel(){
    const nombreArchivo = `${this.paciente.apellido}${this.paciente.nombre}.xlsx`;
    
    console.log(this.turnosFinalizados);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.turnosFinalizados);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb,ws,`${this.paciente.apellido} ${this.paciente.nombre}`);

    XLSX.writeFile(wb,nombreArchivo);
  }

}
