import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DailyWeatherData, HourlyWeatherData } from './models/weather-data.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private coordinates = new BehaviorSubject<{ latitude: number, longitude: number }>({
    latitude :0,
    longitude : 0
    //fornisco come valore iniziale le coordinate 0°N 0°E che corrispondono a Null Island vd Wikipedia
  });

  constructor(private http: HttpClient) { }

  //aggiorna le coordinate utilizzate dal per le richieste meteo
  setCoordinates(latitude: number, longitude: number): void {
    this.coordinates.next({ latitude, longitude });
  }

  // Nella get alla fine &timezone=auto serve per fare si che la timezone sia calcolata automaticamente in base alla localitá richiesta
  // cioé i dati meteo ricevuti faranno riferimento a livello orario al fuso orario del luogo di cui si cercano le previsioni
  getWeatherData(): Observable<DailyWeatherData[]> {
    return this.coordinates.asObservable().pipe(
      switchMap(coords => {
        if (coords) {
          const { latitude, longitude } = coords;
          return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code&timezone=auto`).pipe(
            map(response => this.transformWeatherData(response))
          );
        }
        return EMPTY;
      })
    );
  }

  // Trasforma i dati grazzi in un formato strutturato:
  // estrae i dati orari hourly dalla risposta
  // itera su ogni giorno e su ogni ora per raccogliere dati
  // raggruppa i dati orari in oggetti giornalieri (DailyWeatherData) che contengono un array di dati orari (HourlyWeatherData)
  // restituisce un array di oggetti DailyWeatherData
  private transformWeatherData(data: any): DailyWeatherData[] {
    const hourly = data.hourly; 
    const dailyWeatherData: DailyWeatherData[] = [];

    if (hourly && hourly.time) {
      const numberOfHours = hourly.time.length;
      const hoursPerDay = 24;

      for (let i = 0; i < numberOfHours; i += hoursPerDay) {
        const dailyData: HourlyWeatherData[] = [];

        for (let j = i; j < i + hoursPerDay && j < numberOfHours; j++) {
          dailyData.push({
            dateTime: new Date(hourly.time[j]),
            temperature2m: hourly.temperature_2m[j].toFixed(1), //toFixed(1) per fissare i dati ad 1 cifra decimale anche se é zero
            relativeHumidity2m: hourly.relative_humidity_2m[j].toFixed(1),
            apparentTemperature: hourly.apparent_temperature[j].toFixed(1),
            precipitationProbability: hourly.precipitation_probability[j].toFixed(1),
            windSpeed10m: hourly.wind_speed_10m[j].toFixed(1),
            weather_code: hourly.weather_code[j]  //aggiunta per il weather code. vedere il model
          });
        }

        dailyWeatherData.push({
          date: new Date(hourly.time[i]),
          hourlyData: dailyData
        });
      }
    }

    console.log("Transformed data: ", dailyWeatherData);
    return dailyWeatherData;
  }
}
