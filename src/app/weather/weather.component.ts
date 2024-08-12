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

  //creo un vettore max/min che per ogni elemento contiene la stringa [temperatura_massima_giornaliera/temperatura_minima_giornaliera]
  maxMin: string[] = []; //inizializzato vuoto

  hourlyWeatherCodes: number[] = []; //vettore dei weather_code ora per ora di un giorno intero
  dailyWeatherCodes: number[][] = []; /*vettore di vettori per raggruppare i weather code ora per ora di ogni giorno
 quindi una matrice che ha per indice di riga l'ora e per indice di colonna il giorno*/

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.dailyWeatherData = data;
      this.getDailyMaxMin(); //richiamo in init la funzione per popolare il vettore maxMin subito dopo aver recuperato i dati completi dal service
      this.getWeatherCodes(); //richiamo in init la funzione per ottenere tutti i weather_code
      console.log("Dati ricevuti: ", data);  // Stampa i dati ricevuti in console
    });
  }

  selectDay(index: number) {
    this.selectedDayIndex = index === this.selectedDayIndex ? null : index; // Seleziona o deseleziona il giorno
  }

  getDailyMaxMin() {
    this.maxMin = []; //resetto il vettore maxMin in caso venga chiamato piú volte
    //prende i dati dal WeatherService tramite il metodo getWeatherData e costruisce il vettore di stringhe
    for (var i = 0; i < this.dailyWeatherData.length; i++) {
      //creo una variabile che contiene ora per ora i dati del singolo giorno
      //dailyWeatherData contiene tutti i dati di tutti i giorni ma non si puó accedere direttamente al dato del singolo giorno
      const hourlyData = this.dailyWeatherData[i].hourlyData;

      //estraggo le temp del giorno corrente (cioé tutte le temp di un dato giorno dalle 00 alle 23)
      const temperatures = hourlyData.map(hour => hour.temperature2m);
      //trovo la massima e la minima
      // i tre punti di sospensione sono l'OPERATORE DI SPREAD che in javascript serve ad espandere nei singoli elementi un vettore molto grande o di cui non si conosce la dimensione
      // il vantaggio risiede nel realizzare codice conciso e molto pratico
      //Si puó usare l'operatore di spread per unire array, copiare array, passare array come argomenti, ecc.
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);
      // creo la stringa formattata e la aggiungo al vettore maxMin
      this.maxMin.push(`${maxTemp.toFixed(1)}/${minTemp.toFixed(1)}ºC`);
    }
    //print di controllo
    console.log("Temperatura massima e minima per giorno: ", this.maxMin);
  }

  getWeatherCodes() {
    //resetto i vettori in caso di riutilizzo
    this.hourlyWeatherCodes = [];
    this.dailyWeatherCodes = [];

    //itero sui giorni presenti in dailyWeatherData
    for (let i = 0; i < this.dailyWeatherData.length; i++) {
      const hourlyData = this.dailyWeatherData[i].hourlyData;
      // Creo un vettore temporaneo per contenere i weather_code di ogni ora del giorno corrente
      const weatherCodesForDay: number[] = hourlyData.map(hour => hour.weather_code);
      //aggiungo i weather_code del giorno corrente al vettore dailyWeatherCodes
      this.dailyWeatherCodes.push(weatherCodesForDay);
    }
    console.log("Weather codes giornalieri: ",this.dailyWeatherCodes);
  }

}