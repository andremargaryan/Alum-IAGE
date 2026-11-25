import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES_FORUM } from '../../modeles/categories';
import { messageErreur } from '../../outils/format';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-forum-nouveau',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forum-nouveau.html',
  styleUrl: './forum-nouveau.scss',
})
export class ForumNouveau {
  private fb = inject(FormBuilder);
  private forumService = inject(ForumService);
  private router = inject(Router);

  categories = CATEGORIES_FORUM;

  formulaire = this.fb.nonNullable.group({
    titre: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.required],
    categorieId: [CATEGORIES_FORUM[0].id, Validators.required],
  });

  envoiEnCours = signal(false);
  erreur = signal('');

  // POST /api/posts, puis on ouvre directement le sujet créé.
  publier(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.envoiEnCours.set(true);
    this.erreur.set('');

    const valeurs = this.formulaire.getRawValue();
    this.forumService.publier({ ...valeurs, categorieId: Number(valeurs.categorieId) }).subscribe({
      next: (sujet) => this.router.navigate(['/forum', sujet.id]),
      error: (erreur) => {
        this.erreur.set(messageErreur(erreur, "Le sujet n'a pas pu être publié."));
        this.envoiEnCours.set(false);
      },
    });
  }

  champInvalide(nom: 'titre' | 'description'): boolean {
    const champ = this.formulaire.controls[nom];
    return champ.invalid && champ.touched;
  }
}
