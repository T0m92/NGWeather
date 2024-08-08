import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DailyWeatherData } from '../models/weather-data.model';

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  imports: [
    CommonModule, // Questo modulo fornisce la pipe 'date'
    HttpClientModule
  ],
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  dailyWeatherData: DailyWeatherData[]=[];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeather('52.52', '13.41').subscribe(data => {
      this.dailyWeatherData = data;
      console.log("Dati ricevuti: ", data);  // Stampa i dati ricevuti in console
    });
  }
}