import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Commentaire, EtatLike, NouveauSujet, Sujet } from '../modeles/forum';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private http = inject(HttpClient);

  // GET /api/posts?categorieId=...&motCle=... : du plus récent au plus ancien
  lister(categorieId: number | null, motCle = ''): Observable<Sujet[]> {
    let params = new HttpParams();
    if (categorieId !== null) {
      params = params.set('categorieId', categorieId);
    }
    if (motCle.trim()) {
      params = params.set('motCle', motCle.trim());
    }
    return this.http.get<Sujet[]>('/api/posts', { params });
  }

  // GET /api/posts/{id}
  detail(id: number): Observable<Sujet> {
    return this.http.get<Sujet>(`/api/posts/${id}`);
  }

  // POST /api/posts
  publier(sujet: NouveauSujet): Observable<Sujet> {
    return this.http.post<Sujet>('/api/posts', sujet);
  }

  // POST /api/posts/{id}/like : un clic like, le suivant retire le like
  basculerLike(id: number): Observable<EtatLike> {
    return this.http.post<EtatLike>(`/api/posts/${id}/like`, {});
  }

  // GET /api/posts/{id}/comments
  commentaires(postId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`/api/posts/${postId}/comments`);
  }

  // POST /api/posts/{id}/comments
  commenter(postId: number, texte: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(`/api/posts/${postId}/comments`, { texte });
  }

  // DELETE /api/posts/comments/{id} : seulement l'auteur ou un admin
  supprimerCommentaire(commentaireId: number): Observable<void> {
    return this.http.delete<void>(`/api/posts/comments/${commentaireId}`);
  }
}
