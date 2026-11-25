import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chargement } from './composants/chargement/chargement';
import { EnTete } from './composants/en-tete/en-tete';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chargement, EnTete],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // L'écran de chargement s'affiche à chaque ouverture du site.
  chargementTermine = false;

  // Appelée quand le composant Chargement émet son événement "termine".
  finDuChargement(): void {
    this.chargementTermine = true;
  }
}
