import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LogoSillage } from '../logo-sillage/logo-sillage';

@Component({
  selector: 'app-chargement',
  imports: [LogoSillage],
  templateUrl: './chargement.html',
  styleUrl: './chargement.scss',
})
export class Chargement implements OnInit, OnDestroy {
  // Prévient le parent (App) que l'écran de chargement est terminé.
  @Output() termine = new EventEmitter<void>();

  // Passe à true quand le mot est construit : l'écran s'efface en fondu.
  disparait = false;

  private minuteurs: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    // Le mot est construit en 2 s environ. On le laisse affiché un instant,
    // puis on lance le fondu et on prévient le parent à la fin du fondu.
    this.minuteurs.push(setTimeout(() => (this.disparait = true), 2600));
    this.minuteurs.push(setTimeout(() => this.termine.emit(), 3200));
  }

  ngOnDestroy(): void {
    this.minuteurs.forEach((minuteur) => clearTimeout(minuteur));
  }
}
