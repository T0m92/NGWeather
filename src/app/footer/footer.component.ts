import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule per usare routerLink

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],// Importa RouterModule per usare routerLink
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
