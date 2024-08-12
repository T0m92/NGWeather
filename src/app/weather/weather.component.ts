// weather.component.ts
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { DailyWeatherData } from '../models/weather-data.model';
import { BaseChartDirective } from 'ng2-charts'; //per i grafici
import { noop } from 'rxjs';

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

  dailyWeatherData: DailyWeatherData[]=[];
  selectedDayIndex: number|null = null; //cioé la variabile puó essere di tipo string OR null ed é attualmente uguale a null

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.dailyWeatherData = data;
      console.log("Dati ricevuti: ", data);  // Stampa i dati ricevuti in console
    });
  }

  selectDay(index:number){
    this.selectedDayIndex = index === this.selectedDayIndex ? null : index; // Seleziona o deseleziona il giorno
  }

}