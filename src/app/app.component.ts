// app.component.ts    é il componente principale dell'applicazione
// contiene il <router-outlet> per gestire il caricamento dinamico dei componenti basato sulle rotte.
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { WeatherService } from './weather.service'; // Assicurati che il percorso sia corretto
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from "./weather/weather.component";
//importazioni per la localizzazione italiana
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

//utilizzati per le rotte sia Component che:
import { RouterOutlet } from '@angular/router';

registerLocaleData(localeIt,'it');//registro i dati della localizz. per poter usare la localitá italiana (mesi ecc.. in it)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    WeatherComponent,
    SearchBarComponent,
    HeaderComponent,
    FooterComponent,
    RouterOutlet //sempre per le rotte
],
  providers: [WeatherService,
    { provide: LOCALE_ID, useValue: 'it' } // aggiunto per le impostazioni di data (nomi di mesi e gg settimana in italiano)
  ],
  // per progetti piccoli posso mettere qui
  // template:  `<router-outlet></router-outlet>`,
  // al posto di template url
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  ngOnInit(): void {}
}
