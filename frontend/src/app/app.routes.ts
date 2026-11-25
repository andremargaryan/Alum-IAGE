import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Connexion } from './pages/connexion/connexion';
import { Inscription } from './pages/inscription/inscription';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  // Route de repli : toute adresse inconnue renvoie vers l'accueil.
  { path: '**', redirectTo: '' },
];
