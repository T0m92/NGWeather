// weather.component.ts
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { DailyWeatherData } from '../models/weather-data.model';
import { BaseChartDirective } from 'ng2-charts'; //per i grafici

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  imports: [
    CommonModule, // Questo modulo fornisce la pipe 'date'
    BaseChartDirective //per i grafici 
  ],
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  dailyWeatherData: DailyWeatherData[] = [];
  selectedDayIndex: number | null = null; //cioé la variabile puó essere di tipo string OR null ed é attualmente uguale a null

  maxMin: string[] = []; //inizializzato vuoto
  dailyWeatherClasses: string[][] = []; //Vettore di vettori per le classi CSS di ogni ora di ogni giorno
  severeWeatherClass: string[] = []; // Vettore per la classe CSS più severa di ogni giorno

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.dailyWeatherData = data;
      this.getDailyMaxMin(); // Popolare il vettore maxMin
      this.processWeatherCodes(); // Popolare i vettori delle classi CSS
      console.log("Dati ricevuti: ", data);  // Stampa i dati ricevuti in console
    });
  }

  selectDay(index: number) {
    this.selectedDayIndex = index === this.selectedDayIndex ? null : index; // Seleziona o deseleziona il giorno
  }

  getDailyMaxMin() {
    this.maxMin = []; // Resetto il vettore maxMin in caso venga chiamato più volte
    for (var i = 0; i < this.dailyWeatherData.length; i++) {
      const hourlyData = this.dailyWeatherData[i].hourlyData;
      const temperatures = hourlyData.map(hour => hour.temperature2m);
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);
      this.maxMin.push(`${maxTemp.toFixed(1)}/${minTemp.toFixed(1)}ºC`);
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
