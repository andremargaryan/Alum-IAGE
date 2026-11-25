import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chargement } from './composants/chargement/chargement';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chargement],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // L'écran de chargement s'affiche à chaque ouverture du site.
  chargementTermine = signal(false);

  // Appelée quand le composant Chargement émet son événement "termine".
  finDuChargement(): void {
    this.chargementTermine.set(true);
  }
}
