// weather-data.model.ts

/*  Interfaccia vs Classe per il model:
dato che devo definire solo a livello formale i dati
e non ci sono manipolazioni da fare ne metodi da implementare, scelgo l'interfaccia
altrimenti avrei usato le classi in questo model */

/*HourlyWeatherData é un'interfaccia che rappresenta la singola "tupla" 
corrispondente ai dati completi di un giorno specifico ad un'ora specifica */
export interface HourlyWeatherData {
    dateTime: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    precipitationProbability: number;
    windSpeed10m: number;
  }
  /*DailyWeatherData é un'interfaccia che rappresenta invece un intero giorno di dati metereologici.
  Infatti l'interfaccia é composta da una data di riferimento e un vettore di dati meteo per singola ora
  che infatti é stato definito di tipo HourlyWeatherData */
  export interface DailyWeatherData {
    date: Date;
    hourlyData: HourlyWeatherData[];
  }
  