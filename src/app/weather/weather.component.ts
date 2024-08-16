// weather.component.ts
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { DailyWeatherData, HourlyWeatherData } from '../models/weather-data.model';
import { BaseChartDirective } from 'ng2-charts'; //per i grafici
import { FormsModule } from '@angular/forms'; // modulo necessario per eseguire two-way binding per la select del tipo dati del grafico


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
  selectedDayIndex: number | null = null; //cioé la variabile puó essere di tipo string OR null ed é attualmente uguale a null

  maxMin: string[] = []; //inizializzato vuoto
  dailyWeatherClasses: string[][] = []; //Vettore di vettori per le classi CSS di ogni ora di ogni giorno
  severeWeatherClass: string[] = []; // Vettore per la classe CSS più severa di ogni giorno

  selectedDataType: string = 'temperature2m'; // tipo di dato selezionato per la visulaizzazione del grafico
  // Proprietà per il grafico
  lineChart: any;
  lineChartOptions: any;
  chartColor: string = 'rgb(31,70,82)'; // COLORE LINEA fisso per il GRAFICO

  //selectedDataType: string = 'temperature_2m'; //tipo di dato selezionato per il grafico
  /* La dichiarazione di variabile commentata sopra produce un errore scomodo.. in initializeChart() alla riga:
  const data = selectedDayData.hourlyData.map(hour => hour[this.selectedDataType]);

  L'errore é dovuto al fatto che TypeScript non permette l'indicizzazione dinamica con una stringa 
  su un tipo che non ha una firma di indice (index signature) per quella chiave.
  Per risolvere questo problema, ci sono un paio di modi:
  1. Usare un tipo keyof per assicurarsi che this.selectedDataType sia una delle chiavi effettive di HourlyWeatherData
      definire selectedDataType come una chiave effettiva di HourlyWeatherData usando keyof:
      selectedDataType: keyof HourlyWeatherData = 'temperature2m'; // Tipo di dato selezionato
  2. Utilizzare una mappa con le proprietà disponibili.*/
  // scelgo la 2, piú lunga ed esplicita ma permette di avere piú flessibilitá in caso di tipi di dato differenti da aggiungere alle visualizzazione del grafico


  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.dailyWeatherData = data;
      this.getDailyMaxMin(); // Popolare il vettore maxMin
      this.processWeatherCodes(); // Popolare i vettori delle classi CSS
      this.initializeChart(); // Inizializza il grafico con i dati
      console.log("Dati ricevuti: ", data);  // Stampa i dati ricevuti in console
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
              display: true,
              text: `${this.getLabelForSelectedDataType()}`,
              color: 'black', // Colore del testo dell'asse y in nero
              font: {
                size: 16, // Aumenta la dimensione del font del titolo dell'asse y
                weight: 'bold' // Imposta il font a grassetto per il titolo dell'asse y
              }
            },
            ticks: {
              color: 'black', // Colore dei tick dell'asse y in nero
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
    this.selectedDayIndex = index === this.selectedDayIndex ? null : index; // Seleziona o deseleziona il giorno
    this.initializeChart(); //Aggiorna il grafico quando viene selezionato un giorno
  }

  updateChart() {
    this.initializeChart(); // aggiorna il grafico quando cambia il tipo di dato
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
    this.maxMin = []; // Resetto il vettore maxMin in caso venga chiamato più volte
    for (var i = 0; i < this.dailyWeatherData.length; i++) {
      const hourlyData = this.dailyWeatherData[i].hourlyData;
      const temperatures = hourlyData.map(hour => hour.temperature2m);
      const maxTemp = Math.max(...temperatures); //usato operatore di spread per iterare in maniera compatta max su tutti gli elementi del vettore
      const minTemp = Math.min(...temperatures);
      this.maxMin.push(`${maxTemp.toFixed(1)} / ${minTemp.toFixed(1)}º`);
    }
    console.log("Temperatura massima e minima per giorno: ", this.maxMin);
  }

  // Mappa i codici WMO alle classi CSS delle icone
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
    return ''; // Classe di default se non c'è una corrispondenza
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
