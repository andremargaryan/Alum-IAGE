import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ClocheNotifications } from '../cloche-notifications/cloche-notifications';
import { MenuProfil } from '../menu-profil/menu-profil';

// Mise en page de toutes les pages réservées aux membres :
// la barre latérale à gauche, la barre du haut, et la page courante au centre.
@Component({
  selector: 'app-espace-membre',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ClocheNotifications, MenuProfil],
  templateUrl: './espace-membre.html',
  styleUrl: './espace-membre.scss',
})
export class EspaceMembre implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Titre affiché dans la barre du haut, lu dans le "data" de la route (app.routes.ts).
  titre = signal('');

  liens = [
    { chemin: '/tableau-de-bord', libelle: 'Tableau de bord', icone: 'grille' },
    { chemin: '/evenements', libelle: 'Événements', icone: 'calendrier' },
    { chemin: '/annuaire', libelle: 'Annuaire', icone: 'personnes' },
    { chemin: '/forum', libelle: 'Forum', icone: 'bulle' },
  ];

  ngOnInit(): void {
    this.mettreAJourTitre();
    this.router.events
      .pipe(filter((evenement) => evenement instanceof NavigationEnd))
      .subscribe(() => this.mettreAJourTitre());
  }

  private mettreAJourTitre(): void {
    let enfant = this.route.firstChild;
    while (enfant?.firstChild) {
      enfant = enfant.firstChild;
    }
    this.titre.set(enfant?.snapshot.data['titre'] ?? '');
  }
}
