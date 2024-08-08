// app.component.ts
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { WeatherService } from './weather.service'; // Assicurati che il percorso sia corretto
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from "./weather/weather.component";
//importazioni per la localizzazione italiana
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeIt,'it');//registro i dati della localizz. per poter usare la localitá italiana (mesi ecc.. in it)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    WeatherComponent,
    
],
  providers: [WeatherService,
    { provide: LOCALE_ID, useValue: 'it' } // aggiunto per le impostazioni di data (nomi di mesi e gg settimana in italiano)
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // weatherData: any;

  // constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
  //   this.weatherService.getWeather('52.52', '13.41').subscribe(data => {
  //     this.processWeatherData(data);
  //     console.log('sono nell init dei APP COMPONENT');
  //   });
  // }

  // processWeatherData(data: any): void {
  //   const utcOffsetSeconds = data.utc_offset_seconds;
  //   const hourly = data.hourly;

  //   this.weatherData = {
  //     time: hourly.time.map((t: number) => new Date((t + utcOffsetSeconds) * 1000)),
  //     temperature2m: hourly.temperature_2m
  //   };
  //   console.log('Sono in processWeatherData di APP COMPONENT ts e i dati sono:' + this.weatherData);
  // }
}
}
