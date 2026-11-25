import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

// Ajoute "Authorization: Bearer <jeton>" à chaque requête quand on est connecté.
// Si le backend répond 401 (jeton expiré ou invalide), on ferme la session et on renvoie vers la connexion.
export const jetonInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const jeton = session.jeton();

  const requeteAEnvoyer = jeton
    ? requete.clone({ setHeaders: { Authorization: `Bearer ${jeton}` } })
    : requete;

  return suivant(requeteAEnvoyer).pipe(
    catchError((erreur: HttpErrorResponse) => {
      if (erreur.status === 401 && jeton) {
        session.fermer();
        router.navigate(['/connexion']);
      }
      return throwError(() => erreur);
    }),
  );
};
