import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Page provisoire : le formulaire de connexion (POST /api/auth/login) viendra ici.
@Component({
  selector: 'app-connexion',
  imports: [RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {}
