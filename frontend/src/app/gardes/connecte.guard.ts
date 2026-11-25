import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

// Les pages de l'espace membre demandent d'être connecté.
export const connecteGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  return session.estConnecte() ? true : inject(Router).createUrlTree(['/connexion']);
};

// L'accueil, la connexion et l'inscription renvoient vers le tableau de bord si on est déjà connecté.
export const inviteGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  return session.estConnecte() ? inject(Router).createUrlTree(['/tableau-de-bord']) : true;
};
