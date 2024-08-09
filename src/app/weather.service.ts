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

  setCoordinates(latitude: number, longitude: number): void {
    this.coordinates.next({ latitude, longitude });
  }

  getWeatherData(): Observable<DailyWeatherData[]> {
    return this.coordinates.asObservable().pipe(
      switchMap(coords => {
        if (coords) {
          const { latitude, longitude } = coords;
          return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m`).pipe(
            map(response => this.transformWeatherData(response))
          );
        }
        return EMPTY;
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
            temperature2m: hourly.temperature_2m[j].toFixed(1), //toFixed(1) per fissare i dati ad 1 cifra decimale anche se é zero
            relativeHumidity2m: hourly.relative_humidity_2m[j].toFixed(1),
            apparentTemperature: hourly.apparent_temperature[j].toFixed(1),
            precipitationProbability: hourly.precipitation_probability[j].toFixed(1),
            windSpeed10m: hourly.wind_speed_10m[j].toFixed(1)
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
