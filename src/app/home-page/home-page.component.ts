import { Component } from '@angular/core';

import { SearchBarComponent } from '../search-bar/search-bar.component';
import { WeatherComponent } from '../weather/weather.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchBarComponent,WeatherComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
