import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES_EVENEMENT } from '../../modeles/categories';
import { messageErreur } from '../../outils/format';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-evenement-nouveau',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './evenement-nouveau.html',
  styleUrl: './evenement-nouveau.scss',
})
export class EvenementNouveau {
  private fb = inject(FormBuilder);
  private evenementService = inject(EvenementService);
  private router = inject(Router);

  categories = CATEGORIES_EVENEMENT;

  formulaire = this.fb.nonNullable.group({
    titre: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.required],
    categorieId: [CATEGORIES_EVENEMENT[0].id, Validators.required],
    dateEvenement: ['', Validators.required],
    lieu: ['', [Validators.required, Validators.maxLength(150)]],
    adresse: ['', [Validators.required, Validators.maxLength(255)]],
    capaciteMax: [null as number | null, Validators.min(1)],
  });

  envoiEnCours = signal(false);
  erreur = signal('');

  // Le formulaire est validé, le service envoie POST /api/events, puis on revient à la liste.
  creer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.envoiEnCours.set(true);
    this.erreur.set('');

    const valeurs = this.formulaire.getRawValue();
    this.evenementService
      .creer({
        ...valeurs,
        categorieId: Number(valeurs.categorieId),
        // L'input datetime-local donne "2026-12-10T18:30" : Spring attend les secondes.
        dateEvenement: valeurs.dateEvenement.length === 16 ? valeurs.dateEvenement + ':00' : valeurs.dateEvenement,
        capaciteMax: valeurs.capaciteMax ? Number(valeurs.capaciteMax) : null,
      })
      .subscribe({
        next: () => this.router.navigate(['/evenements']),
        error: (erreur) => {
          this.erreur.set(messageErreur(erreur, "L'événement n'a pas pu être créé."));
          this.envoiEnCours.set(false);
        },
      });
  }

  champInvalide(nom: 'titre' | 'description' | 'dateEvenement' | 'lieu' | 'adresse' | 'capaciteMax'): boolean {
    const champ = this.formulaire.controls[nom];
    return champ.invalid && champ.touched;
  }
}
