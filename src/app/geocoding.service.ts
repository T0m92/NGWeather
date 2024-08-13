import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationInfo } from './models/geocoding.model';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) {
    console.log('GeocodingService initialized');
  }

  getGeocodingInfo(name: string): Observable<LocationInfo[]> {
    return this.http.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=it&format=json`)
      .pipe(
        map(response => this.transformGeocodingInfo(response))
      );
  }

  transformGeocodingInfo(data: any): LocationInfo[] {
    const geocodingInfoCities: LocationInfo[] = [];
    const results = data.results;
  
    if (results) {
      for (let result of results) {
        geocodingInfoCities.push({
          id: result.id,
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          elevation: result.elevation,
          feature_code: result.feature_code,
          country_code: result.country_code, //Italia = IT
          admin1: result.admin1,  // Lazio, ecc.
          admin2: result.admin2,  // Roma, ecc.
          admin3: result.admin3,  // Roma, ecc.
          timezone: result.timezone,
          population: result.population,
          postcodes: result.postcodes,
          country: result.country  // Italia, ecc.
        });
      }
    }
    console.log("Transformed geocoding data: ", geocodingInfoCities);
    return geocodingInfoCities;
  }
}
