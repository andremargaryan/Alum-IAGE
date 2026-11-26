import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Session } from '../modeles/session';
import { NouvelUtilisateur, Utilisateur } from '../modeles/utilisateur';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private session = inject(SessionService);

  // POST /api/auth/login : si la connexion réussit, on garde la session.
  connecter(email: string, motDePasse: string): Observable<Session> {
    return this.http
      .post<Session>('/api/auth/login', { email, motDePasse })
      .pipe(tap((session) => this.session.ouvrir(session)));
  }

  // POST /users : crée le compte (route publique).
  inscrire(compte: NouvelUtilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>('/users', compte);
  }

  deconnecter(): void {
    this.session.fermer();
  }
}
