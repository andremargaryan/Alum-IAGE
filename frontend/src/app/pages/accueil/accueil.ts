import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnTete } from '../../composants/en-tete/en-tete';
import { LogoSillage } from '../../composants/logo-sillage/logo-sillage';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink, LogoSillage, EnTete],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {}
