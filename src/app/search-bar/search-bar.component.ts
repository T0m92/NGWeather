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
  searchForm!: FormGroup;
  cities: LocationInfo[] = [];
  selectedCity!: LocationInfo;

  constructor(
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private weatherService: WeatherService
  ) { }

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

  onSelectCity(city: LocationInfo): void {
    this.selectedCity = city;
    this.cities = [];
    const { latitude, longitude } = city;
    this.weatherService.setCoordinates(latitude, longitude);
  }
}

/*ASSERZIONE DEFINITIVA
In caso di proprietá che sollevano problemi per mancata assegnazione, cioé dove c'é il rischio che un valore possa essere null
si puó usare il punto esclamativo alla fine del nome nella dichiarazione.
In questo modo diciamo a TypeScript che queste proprietà verranno sicuramente inizializzate prima di essere utilizzate.
In pretica "ce ne assumiamo la responsabilitá" e facciamo quello che vogliamo fare. Peró le proprietá poi vanno inizializzate onde evitare errori
esempio:

searchForm!: FormGroup;
selectedCity!: LocationInfo;

potrei fare lo stesso con 
this.searchForm.get('cityName')!.valueChanges.pipe(
ma la gestisco con una semplice if

quindi cityNameControl accoglie il valore dato in input dal form e i dati vengono passati al service solo se cityName é diverso da null
*/
