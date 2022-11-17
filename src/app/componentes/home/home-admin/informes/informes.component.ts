import { Component, OnInit } from '@angular/core';
import { Especialista } from 'src/app/componentes/registro/clases/especialista.class';
import { FirestoreService } from 'src/app/componentes/registro/services/firestore.service';
import { SpinnerService } from 'src/app/componentes/services/spinner.service';

import { Chart, ChartConfiguration, ChartItem, registerables } from 'node_modules/chart.js'


import * as XLSX from 'xlsx';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {

  public chart: any;
  especialistas: Especialista[] = [];
  arrayNombres: string[] = [];
  arrayTurnosReservados: number[] = [];
  arrayTurnosFinalizados: number[] = [];

  turnosReservados: any[] = [];
  turnosFinalizados: any[] = [];
  contador: number = 0;
  displayStyle = "none";
  displayStyleFinalizados = "none";


  constructor(private _firestoreService: FirestoreService, private spinnerService: SpinnerService) { 
    this.createChartTurnosReservados();
    this.createChartTurnosFinalizados();
  }

  ngOnInit(): void {
  }

  createChartTurnosReservados(): void {

    this._firestoreService.obtenerDocs('turnos_reservados')
      .subscribe(resp => {
        this.turnosReservados = resp;

        this._firestoreService.obtenerDocs('especialistas')
          .subscribe(resp => {
            this.spinnerService.ocultarSpinner();
            this.especialistas = resp.filter(esp => esp.habilitado === true);

            for (let index = 0; index < this.especialistas.length; index++) {
              let element = this.especialistas[index];
              if (!this.arrayNombres.includes(`${element.nombre} ${element.apellido}`)) {
                this.arrayNombres.push(`${element.nombre} ${element.apellido}`);
              }
            }

            for (let i = 0; i < this.arrayNombres.length; i++) {
              const nombre = this.arrayNombres[i];
              for (let index = 0; index < this.turnosReservados.length; index++) {
                const element = this.turnosReservados[index];

                if (element.nombreEspecialista === nombre) {
                  this.contador++;
                }
              }
              this.arrayTurnosReservados.push(this.contador);
              this.contador = 0;
            }

            Chart.register(...registerables);
            const data = {
              labels: this.arrayNombres,
              datasets: [{
                label: 'Turnos reservados hasta 15 dias',
                backgroundColor: 'green',
                borderColor: 'black',
                data: this.arrayTurnosReservados,
              }]
            };

            const options = {
              scales: {
                y: {
                  beginAtZero: true,
                  display: true
                }
              }
            }

            const config: ChartConfiguration = {
              type: 'bar',
              data: data,
              options: options
            }

            const chartItem: ChartItem = document.getElementById('my-chart-reservados') as ChartItem;

            if(chartItem){
              new Chart(chartItem, config);
            }
          })
          ;

      });
  }


  createChartTurnosFinalizados(): void {

    this._firestoreService.obtenerDocs('turnos_finalizados')
      .subscribe(resp => {
        this.turnosFinalizados = resp;

        this._firestoreService.obtenerDocs('especialistas')
          .subscribe(resp => {
            this.spinnerService.ocultarSpinner();
            this.especialistas = resp.filter(esp => esp.habilitado === true);

            for (let index = 0; index < this.especialistas.length; index++) {
              let element = this.especialistas[index];
              if (!this.arrayNombres.includes(`${element.nombre} ${element.apellido}`)) {
                this.arrayNombres.push(`${element.nombre} ${element.apellido}`);
              }
            }

            for (let i = 0; i < this.arrayNombres.length; i++) {
              const nombre = this.arrayNombres[i];
              for (let index = 0; index < this.turnosFinalizados.length; index++) {
                const element = this.turnosFinalizados[index];

                if (element.nombreEspecialista === nombre) {
                  this.contador++;
                }
              }
              this.arrayTurnosFinalizados.push(this.contador);
              this.contador = 0;
            }

            Chart.register(...registerables);
            const data = {
              labels: this.arrayNombres,
              datasets: [{
                label: 'Turnos finalizados en los últimos 15 dias',
                backgroundColor: 'blue',
                borderColor: 'black',
                data: this.arrayTurnosFinalizados,
              }]
            };

            const options = {
              scales: {
                y: {
                  beginAtZero: true,
                  display: true
                }
              }
            }

            const config: ChartConfiguration = {
              type: 'bar',
              data: data,
              options: options
            }

            const chartItem: ChartItem = document.getElementById('my-chart-finalizados') as ChartItem;

            if(chartItem){
              new Chart(chartItem, config);
            }
          });
      });
  }


  verTurnosReservados() {
    this.displayStyleFinalizados = "none";
    this.displayStyle = "block";
  }


  async descargarLogUsuarios() {
    this.displayStyle = "none";
    this.displayStyleFinalizados = "none";
    this.spinnerService.mostrarSpinner();
    const registros = (await this._firestoreService.obtenerDoc('log_ingresos', 'tRnmct579pHa8O4tOHn6')).data();

    if (registros) {
      this.spinnerService.ocultarSpinner();
      let registroLog: any[] = registros['ingresos'];
      registroLog.map(registro => {
        let fechaCorregida = new Date(registro.fecha.seconds * 1000)
        registro.fecha = fechaCorregida;
        return registro;
      })

      const nombreArchivo = 'log_ingresos.xlsx';

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(registroLog);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'log_registro');

      XLSX.writeFile(wb, nombreArchivo);
    } else {
      this.spinnerService.ocultarSpinner();
    }
  }


  async descargarContadorTurnos() {
    this.displayStyle = "none";
    this.displayStyleFinalizados = "none";
    this.spinnerService.mostrarSpinner();
    const registros = (await this._firestoreService.obtenerDoc('contador_por_especialidad', '6qoiDPDpaL4rFm5LgSuT')).data();

    if (registros) {
      this.spinnerService.ocultarSpinner();

      let turnosRegistro: any[] = registros['turnos'];

      const nombreArchivo = 'contador_de_turnos_por_esp.xlsx';
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(turnosRegistro);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'contador_de_turnos_por_esp');

      XLSX.writeFile(wb, nombreArchivo);
    } else {
      this.spinnerService.ocultarSpinner();
    }
  }


  verTurnosFinalizados() {
    this.displayStyle = "none";
    this.displayStyleFinalizados = "block";
  }

}
