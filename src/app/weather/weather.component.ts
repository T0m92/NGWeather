// weather.component.ts
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { DailyWeatherData, HourlyWeatherData } from '../models/weather-data.model';
import { BaseChartDirective } from 'ng2-charts'; //per i grafici
import { FormsModule } from '@angular/forms'; // modulo necessario per eseguire two-way binding per la select del tipo dati del grafico
//import per usare le label nel grafico
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels); //bisogna registrarlo prima di usarlo

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  imports: [
    CommonModule, // Questo modulo fornisce la pipe 'date'
    BaseChartDirective, //per i grafici 
    FormsModule // // Aggiungi FormsModule per supportare ngModel (two way binding) nel file weather.component.html
  ],
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  dailyWeatherData: DailyWeatherData[] = [];
  selectedDayIndex: number | null = null;

  maxMin: string[] = [];
  dailyWeatherClasses: string[][] = [];
  severeWeatherClass: string[] = [];

  selectedDataType: string = 'temperature2m';
  lineChart: any;
  lineChartOptions: any;
  chartColor: string = 'rgb(31,70,82)';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.dailyWeatherData = data;
      this.getDailyMaxMin();
      this.processWeatherCodes();
      this.initializeChart();
      console.log("Dati ricevuti: ", data);
    });
  }

  // Inizializza il grafico con i dati del giorno selezionato
initializeChart() {
  if (this.selectedDayIndex !== null) {
      const selectedDayData = this.dailyWeatherData[this.selectedDayIndex];
      const labels = selectedDayData.hourlyData.map((_, index) => `${index}:00`);
      const data = selectedDayData.hourlyData.map(hour => this.getDataByType(hour));

      this.lineChart = {
          labels: labels,
          datasets: [{
              label: `${this.getLabelForSelectedDataType()} Giornaliera`,
              data: data,
              fill: true,
              backgroundColor: 'rgba(31, 70, 82, 0.2)', // Colore di riempimento con trasparenza
              borderColor: 'rgb(31, 70, 82)', // Colore della linea
              tension: 0.15
          }]
      };

      this.lineChartOptions = {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
                  labels: {
                      color: 'black', // Colore del testo della legenda in nero
                      font: {
                          size: 16, // Aumenta la dimensione del font della legenda
                          weight: 'bold' // Imposta il font a grassetto
                      }
                  }
              },
              // Configura le etichette sui punti del grafico
              datalabels: {
                  align: 'end',
                  anchor: 'end',
                  color: 'black',
                  font: {
                      weight: 'bold',
                      size: 12
                  },
                  formatter: function (value: any) {
                      return value
                  }
              }
          },
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Ora del Giorno',
                      color: 'black', // Colore del testo dell'asse x in nero
                      font: {
                          size: 16, // Aumenta la dimensione del font del titolo dell'asse x
                          weight: 'bold' // Imposta il font a grassetto per il titolo dell'asse x
                      }
                  },
                  ticks: {
                      color: 'black', // Colore dei tick dell'asse x in nero
                      font: {
                          size: 14, // Aumenta la dimensione del font per i tick dell'asse x
                          weight: 'bold' // Imposta il font a grassetto per i tick dell'asse x
                      }
                  },
              },
              y: {
                  title: {
                      display: false, // Disabilita il titolo dell'asse y
                  },
                  ticks: {
                      color: '#f9f9f9', // Colore dei tick dell'asse y identico allo sfondo per far sparire i ticks che sono ridondanti
                      font: {
                          size: 14, // Aumenta la dimensione del font per i tick dell'asse y
                          weight: 'bold' // Imposta il font a grassetto per i tick dell'asse y
                      }
                  },
                  beginAtZero: false
              }
          }
      };
  }
}

  selectDay(index: number) {
    this.selectedDayIndex = index === this.selectedDayIndex ? null : index;
    this.initializeChart();
  }

  updateChart() {
    this.initializeChart();
  }

  getDataByType(hour: HourlyWeatherData): number {
    switch (this.selectedDataType) {
      case 'temperature2m':
        return hour.temperature2m;
      case 'humidity':
        return hour.relativeHumidity2m;
      case 'windSpeed':
        return hour.windSpeed10m;
      case 'apparentTemperature':
        return hour.apparentTemperature;
      case 'rainProbability':
        return hour.precipitationProbability;
      default:
        return 0;
    }
  }

  getLabelForSelectedDataType(): string {
    switch (this.selectedDataType) {
      case 'temperature2m':
        return 'Temperatura (ºC)';
      case 'humidity':
        return 'Umiditá (%)';
      case 'windSpeed':
        return 'Velocitá del vento (km/h)';
      case 'apparentTemperature':
        return 'Temperatura Percepita (ºC)';
      case 'rainProbability':
        return 'Probabilitá di pioggia (%)';
      default:
        return 'Dati';
    }
  }

  getDailyMaxMin() {
    this.maxMin = [];
    for (var i = 0; i < this.dailyWeatherData.length; i++) {
      const hourlyData = this.dailyWeatherData[i].hourlyData;
      const temperatures = hourlyData.map(hour => hour.temperature2m);
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);
      this.maxMin.push(`${maxTemp.toFixed(1)} / ${minTemp.toFixed(1)}º`);
    }
    console.log("Temperatura massima e minima per giorno: ", this.maxMin);
  }

  mapWmoToCssClass(code: number): string {
    if (code === 0 || code === 1) return 'wi-day-sunny';
    if (code === 2) return 'wi-day-cloudy';
    if (code === 3) return 'wi-cloudy';
    if (code === 45 || code === 48) return 'wi-fog';
    if (code >= 51 && code <= 55) return 'wi-showers';
    if (code >= 56 && code <= 57) return 'wi-rain-mix';
    if (code >= 61 && code <= 65) return 'wi-rain';
    if (code >= 66 && code <= 67) return 'wi-rain-mix';
    if (code >= 71 && code <= 77) return 'wi-snow';
    if (code >= 80 && code <= 82) return 'wi-showers';
    if (code >= 85 && code <= 86) return 'wi-snow';
    if (code >= 95 && code <= 99) return 'wi-thunderstorm';
    return '';
  }

  processWeatherCodes() {
    this.dailyWeatherClasses = [];
    this.severeWeatherClass = [];

    for (let i = 0; i < this.dailyWeatherData.length; i++) {
      const hourlyData = this.dailyWeatherData[i].hourlyData;
      const weatherClassesForDay = hourlyData.map(hour => this.mapWmoToCssClass(hour.weather_code));
      this.dailyWeatherClasses.push(weatherClassesForDay);

      const maxWeatherCode = Math.max(...hourlyData.map(hour => hour.weather_code));
      this.severeWeatherClass.push(this.mapWmoToCssClass(maxWeatherCode));
    }

    console.log("Classi CSS giornaliere: ", this.dailyWeatherClasses);
    console.log("Classe CSS più severa per giorno: ", this.severeWeatherClass);
  }
}
