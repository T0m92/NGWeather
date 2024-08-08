// geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationInfo } from './models/geocoding.model';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }

  getGeocodingInfo(name: string): Observable<LocationInfo[]> {
    return this.http.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=it&format=json`)
      .pipe(
        map(response => this.transformGeocodingInfo(response))
      );
  }

  transformGeocodingInfo(data: any): LocationInfo[] {
    const geocodingInfoCities: LocationInfo[] = [];
    const results = data.results;
    const numberOfResults = results.length;

    if (data) {
      for (let i = 0; i < numberOfResults; i++) {
        geocodingInfoCities.push({
          name: results[i].name,
          latitude: results[i].latitude,
          longitude: results[i].longitude,
          admin1: results[i].admin1, // regione (o simili) [più ampio]
          admin2: results[i].admin2, // provincia (o simili) [più stretto]
          admin3: results[i].admin3, // nome città (a volte diverso da name)
          country_code: results[i].country_code // sigla nazione
        });
      }
    }
    console.log("Transformed geocoding data: ", geocodingInfoCities);
    return geocodingInfoCities;
  }
}
