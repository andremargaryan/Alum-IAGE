import { TestBed } from '@angular/core/testing';
import { Session } from '../modeles/session';
import { SessionService } from './session.service';

const lea: Session = {
  token: 'jeton',
  expireDansMinutes: 120,
  userId: 2,
  nom: 'Martin',
  prenom: 'Léa',
  email: 'lea@alumni.test',
  role: 'ORGANISATEUR',
  ville: 'Paris',
};

describe('SessionService', () => {
  beforeEach(() => localStorage.clear());

  it('ouvre puis ferme la session', () => {
    const session = TestBed.inject(SessionService);
    expect(session.estConnecte()).toBe(false);

    session.ouvrir(lea);
    expect(session.estConnecte()).toBe(true);
    expect(session.jeton()).toBe('jeton');

    session.fermer();
    expect(session.estConnecte()).toBe(false);
    expect(localStorage.getItem('sillage.session')).toBeNull();
  });

  it('autorise la création d’événement seulement aux organisateurs et admins', () => {
    const session = TestBed.inject(SessionService);
    session.ouvrir(lea);
    expect(session.peutCreerEvenement()).toBe(true);

    session.ouvrir({ ...lea, role: 'ETUDIANT' });
    expect(session.peutCreerEvenement()).toBe(false);
  });
});
