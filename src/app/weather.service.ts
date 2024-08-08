// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DailyWeatherData, HourlyWeatherData } from './models/weather-data.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(lat: string, long: string): Observable<DailyWeatherData[]> {
    return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m`)
      .pipe(
        map(response => {
          console.log("Raw response: ", response);  // Aggiungi questo log per vedere la risposta grezza
          return this.transformWeatherData(response);
        })
      );
  }

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
            temperature2m: hourly.temperature_2m[j],
            relativeHumidity2m: hourly.relative_humidity_2m[j],
            apparentTemperature: hourly.apparent_temperature[j],
            precipitationProbability: hourly.precipitation_probability[j],
            windSpeed10m: hourly.wind_speed_10m[j]
          });
        }

        dailyWeatherData.push({
          date: new Date(hourly.time[i]),
          hourlyData: dailyData
        });
      }
    }

    console.log("Transformed data: ", dailyWeatherData);  // Aggiungi questo log per vedere i dati trasformati
    return dailyWeatherData;
  }
}
