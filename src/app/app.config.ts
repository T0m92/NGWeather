// app.config.ts utilizzato per configurare i provider e altre impostazioni globali per la tua applicazione

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
//import { importProvidersFrom } from '@angular/core';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


//appConfig ora è un array di provider, 
//come richiesto da bootstrapApplication.
//Questo array include tutti i provider che ci servono
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideClientHydration(),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables())
  ]
};



// utilizzati per le rotte
//provideRouter(appRoutes)
//import { appRoutes } from './app.routes';
//import { provideRouter } from '@angular/router';