import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GeocodingService } from '../geocoding.service';
import { WeatherService } from '../weather.service';
import { LocationInfo } from '../models/geocoding.model';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchForm!: FormGroup; // ASSERZIONE DEFINITIVA
  cities: LocationInfo[] = [];
  selectedCity!: LocationInfo;

  constructor(
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private weatherService: WeatherService
  ) { }

  //inizializza reactive form , gestisce cambiamento del valore con funzione di debounce
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      cityName: ['']
    });
    const cityNameControl = this.searchForm.get('cityName');
    if(cityNameControl){
    cityNameControl.valueChanges.pipe(
      debounceTime(300), // Ritarda di 300ms
      distinctUntilChanged(), // Emette solo valori distinti
      switchMap(value => this.geocodingService.getGeocodingInfo(value))
    ).subscribe(cities => {
      this.cities = cities;
    });
  }
  }

//   switchMap: Per ogni nuovo valore del campo cityName, switchMap:
// Cancella qualsiasi richiesta di geocodifica in corso (se esiste) e ne avvia una nuova con il valore corrente.
// Chiama il metodo getGeocodingInfo del servizio geocodingService, che presumibilmente restituisce un observable.
// switchMap restituisce un nuovo observable che viene sottoscritto,
//i risultati di questa chiamata (le città trovate) vengono assegnati alla variabile this.cities.

  //scelta la cittá passa le coordinate al service
  onSelectCity(city: LocationInfo): void {
    this.selectedCity = city;
    this.cities = [];
  
    const { latitude, longitude } = city;
    this.weatherService.setCoordinates(latitude, longitude);
  
    // Aggiorna il campo di input con il nome della città selezionata
    this.searchForm.patchValue({
      cityName: `${city.name}, ${city.country_code}, ${city.admin1}`
    });
  }
  
}
