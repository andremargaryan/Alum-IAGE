import { Injectable, computed, signal } from '@angular/core';
import { Session } from '../modeles/session';

const CLE = 'sillage.session';

// Garde la session (le jeton et l'utilisateur connecté) partagée entre toutes les pages.
// Elle est recopiée dans le localStorage pour survivre à un rafraîchissement de la page.
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly utilisateur = signal<Session | null>(this.lireSessionEnregistree());

  readonly estConnecte = computed(() => this.utilisateur() !== null);

  // Seuls les organisateurs et les admins peuvent créer un événement (règle du backend).
  readonly peutCreerEvenement = computed(() => {
    const role = this.utilisateur()?.role;
    return role === 'ORGANISATEUR' || role === 'ADMIN';
  });

  ouvrir(session: Session): void {
    localStorage.setItem(CLE, JSON.stringify(session));
    this.utilisateur.set(session);
  }

  fermer(): void {
    localStorage.removeItem(CLE);
    this.utilisateur.set(null);
  }

  jeton(): string | null {
    return this.utilisateur()?.token ?? null;
  }

  private lireSessionEnregistree(): Session | null {
    try {
      const texte = localStorage.getItem(CLE);
      return texte ? (JSON.parse(texte) as Session) : null;
    } catch {
      return null;
    }
  }
}
