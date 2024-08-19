/* Interfaccia che rappresenta la singola "tupla" 
corrispondente ai dati completi di un'ora specifica di un giorno */
export interface HourlyWeatherData {
    dateTime: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    precipitationProbability: number;
    windSpeed10m: number;
    weather_code: number; 
  }
  /* Interfaccia che rappresenta invece un intero giorno di dati metereologici.
  Infatti l'interfaccia é composta da una data di riferimento e un vettore di dati meteo per singola ora
  che infatti é stato definito di tipo HourlyWeatherData */
  export interface DailyWeatherData {
    date: Date;
    hourlyData: HourlyWeatherData[];
  }
  