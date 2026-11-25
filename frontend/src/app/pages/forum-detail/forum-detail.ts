import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Avatar } from '../../composants/avatar/avatar';
import { teinteCategorie } from '../../modeles/categories';
import { Commentaire, Sujet } from '../../modeles/forum';
import { ilYa, initiales, initialesDepuisNom, messageErreur, teinteAvatar } from '../../outils/format';
import { ForumService } from '../../services/forum.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-forum-detail',
  imports: [ReactiveFormsModule, RouterLink, Avatar],
  templateUrl: './forum-detail.html',
  styleUrl: './forum-detail.scss',
})
export class ForumDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);
  private session = inject(SessionService);
  private fb = inject(FormBuilder);

  sujet = signal<Sujet | null>(null);
  commentaires = signal<Commentaire[]>([]);
  chargement = signal(true);
  erreur = signal('');
  envoiEnCours = signal(false);
  erreurCommentaire = signal('');

  formulaire = this.fb.nonNullable.group({
    texte: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  teinte = computed(() => teinteCategorie(this.sujet()?.categorieId ?? 0));

  initiales = initiales;
  initialesDepuisNom = initialesDepuisNom;
  teinteAvatar = teinteAvatar;
  ilYa = ilYa;

  private sujetId = 0;

  ngOnInit(): void {
    // L'identifiant du sujet vient de l'adresse : /forum/:id
    this.sujetId = Number(this.route.snapshot.paramMap.get('id'));

    // GET /api/posts/{id}
    this.forumService.detail(this.sujetId).subscribe({
      next: (sujet) => {
        this.sujet.set(sujet);
        this.chargement.set(false);
      },
      error: (erreur) => {
        this.erreur.set(messageErreur(erreur, 'Ce sujet est introuvable.'));
        this.chargement.set(false);
      },
    });
    this.chargerCommentaires();
  }

  // GET /api/posts/{id}/comments
  chargerCommentaires(): void {
    this.forumService.commentaires(this.sujetId).subscribe((liste) => this.commentaires.set(liste));
  }

  // POST /api/posts/{id}/like
  aimer(): void {
    this.forumService.basculerLike(this.sujetId).subscribe((etat) => {
      const sujet = this.sujet();
      if (sujet) {
        this.sujet.set({ ...sujet, likeParMoi: etat.aime, nombreLikes: etat.nombreLikes });
      }
    });
  }

  // POST /api/posts/{id}/comments
  commenter(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.envoiEnCours.set(true);
    this.erreurCommentaire.set('');
    this.forumService.commenter(this.sujetId, this.formulaire.getRawValue().texte).subscribe({
      next: (commentaire) => {
        this.commentaires.set([...this.commentaires(), commentaire]);
        this.formulaire.reset();
        this.envoiEnCours.set(false);
      },
      error: (erreur) => {
        this.erreurCommentaire.set(messageErreur(erreur, "Le commentaire n'a pas pu être publié."));
        this.envoiEnCours.set(false);
      },
    });
  }

  // DELETE /api/posts/comments/{id}
  supprimer(commentaire: Commentaire): void {
    this.forumService.supprimerCommentaire(commentaire.id).subscribe({
      next: () => this.commentaires.set(this.commentaires().filter((c) => c.id !== commentaire.id)),
      error: (erreur) => this.erreurCommentaire.set(messageErreur(erreur, 'Suppression impossible.')),
    });
  }

  // Le backend autorise l'auteur du commentaire et les admins.
  peutSupprimer(commentaire: Commentaire): boolean {
    const moi = this.session.utilisateur();
    return !!moi && (moi.userId === commentaire.auteurId || moi.role === 'ADMIN');
  }
}
