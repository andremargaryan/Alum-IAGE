import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoSillage } from '../../composants/logo-sillage/logo-sillage';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink, LogoSillage],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {}
