import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnTete } from '../../composants/en-tete/en-tete';
import { messageErreur } from '../../outils/format';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink, EnTete],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  formulaire = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  envoiEnCours = signal(false);
  erreur = signal('');

  // Le formulaire est valide : on appelle POST /api/auth/login puis on va au tableau de bord.
  seConnecter(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.envoiEnCours.set(true);
    this.erreur.set('');

    const { email, motDePasse } = this.formulaire.getRawValue();
    this.auth.connecter(email, motDePasse).subscribe({
      next: () => this.router.navigate(['/tableau-de-bord']),
      error: (erreur) => {
        this.erreur.set(messageErreur(erreur, 'Email ou mot de passe incorrect.'));
        this.envoiEnCours.set(false);
      },
    });
  }

  // Affiche l'erreur d'un champ seulement après que l'utilisateur l'a touché.
  champInvalide(nom: 'email' | 'motDePasse'): boolean {
    const champ = this.formulaire.controls[nom];
    return champ.invalid && champ.touched;
  }
}
