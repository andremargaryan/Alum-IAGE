export type Role = 'ETUDIANT' | 'ORGANISATEUR' | 'ADMIN';

// Réponse de POST /api/auth/login (AuthResponseDto côté Spring)
export interface Session {
  token: string;
  expireDansMinutes: number;
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  ville: string | null;
}
