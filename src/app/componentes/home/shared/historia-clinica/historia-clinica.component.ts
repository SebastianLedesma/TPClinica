import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';
import { Paciente } from '../../../registro/clases/paciente';

import pdfMake from "pdfmake/build/pdfmake"; 
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() id_paciente:string= '';
  turnosFinalizados:any[]=[];
  paciente:Paciente = new Paciente();

  mostrarBotonPDF:boolean=false;

  constructor(private fireStoreService: FirestoreService, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.mostrarBotonPDF=false;
    if(this.id_paciente){
      this.spinnerService.mostrarSpinner();
      //console.log(changes['id_paciente'].currentValue);
  
      const resp = (await this.fireStoreService.obtenerDoc('pacientes',changes['id_paciente'].currentValue)).data();
  
      if(resp){
        this.paciente = resp;
      }
  
      this.fireStoreService.obtenerDocsPorId('diagnostico_turnos',changes['id_paciente'].currentValue)
      .then( (registros: any[]) => {
        this.turnosFinalizados = registros.map(turno => {
          let date = new Date(turno.fecha.seconds * 1000);
          turno.fecha = date;

          return turno;
        });

        if(this.turnosFinalizados.length){
          this.mostrarBotonPDF=true;
        }
        this.spinnerService.ocultarSpinner();
        //this.puntajes = this.puntajes.sort((a:any,b:any) => b.puntaje - a.puntaje);
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

}
