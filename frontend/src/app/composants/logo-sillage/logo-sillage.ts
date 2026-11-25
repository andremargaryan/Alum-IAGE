import { Component, Input } from '@angular/core';

// Une barre du logo : un trait entre deux points, qui arrive depuis une direction.
interface Barre {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depuis: 'haut' | 'bas' | 'gauche' | 'droite';
}

// Une lettre : sa position horizontale dans le mot et les barres qui la construisent.
interface Lettre {
  x: number;
  barres: Barre[];
}

@Component({
  selector: 'app-logo-sillage',
  templateUrl: './logo-sillage.html',
  styleUrl: './logo-sillage.scss',
})
export class LogoSillage {
  // true : chaque barre arrive en glissant (page de chargement).
  // false : le mot est affiché directement (page d'accueil).
  @Input() anime = false;

  // Chaque lettre est dessinée dans une case de 100 de haut.
  // Les coordonnées sont celles du milieu de chaque barre.
  lettres: Lettre[] = [
    {
      // S
      x: 0,
      barres: [
        { x1: 6, y1: 6, x2: 54, y2: 6, depuis: 'gauche' },
        { x1: 6, y1: 6, x2: 6, y2: 50, depuis: 'haut' },
        { x1: 6, y1: 50, x2: 54, y2: 50, depuis: 'droite' },
        { x1: 54, y1: 50, x2: 54, y2: 94, depuis: 'bas' },
        { x1: 54, y1: 94, x2: 6, y2: 94, depuis: 'gauche' },
      ],
    },
    {
      // I
      x: 80,
      barres: [{ x1: 6, y1: 6, x2: 6, y2: 94, depuis: 'haut' }],
    },
    {
      // L
      x: 112,
      barres: [
        { x1: 6, y1: 6, x2: 6, y2: 94, depuis: 'haut' },
        { x1: 6, y1: 94, x2: 50, y2: 94, depuis: 'droite' },
      ],
    },
    {
      // L
      x: 188,
      barres: [
        { x1: 6, y1: 6, x2: 6, y2: 94, depuis: 'bas' },
        { x1: 6, y1: 94, x2: 50, y2: 94, depuis: 'droite' },
      ],
    },
    {
      // A : une barre arrive d'en haut, l'autre d'en bas, puis la barre du milieu
      x: 264,
      barres: [
        { x1: 6, y1: 94, x2: 35, y2: 6, depuis: 'haut' },
        { x1: 35, y1: 6, x2: 64, y2: 94, depuis: 'bas' },
        { x1: 18, y1: 60, x2: 52, y2: 60, depuis: 'gauche' },
      ],
    },
    {
      // G
      x: 354,
      barres: [
        { x1: 54, y1: 6, x2: 6, y2: 6, depuis: 'droite' },
        { x1: 6, y1: 6, x2: 6, y2: 94, depuis: 'haut' },
        { x1: 6, y1: 94, x2: 54, y2: 94, depuis: 'gauche' },
        { x1: 54, y1: 94, x2: 54, y2: 52, depuis: 'bas' },
        { x1: 54, y1: 52, x2: 32, y2: 52, depuis: 'droite' },
      ],
    },
    {
      // E
      x: 434,
      barres: [
        { x1: 6, y1: 6, x2: 6, y2: 94, depuis: 'bas' },
        { x1: 6, y1: 6, x2: 50, y2: 6, depuis: 'droite' },
        { x1: 6, y1: 50, x2: 42, y2: 50, depuis: 'gauche' },
        { x1: 6, y1: 94, x2: 50, y2: 94, depuis: 'droite' },
      ],
    },
  ];

  // Les lettres arrivent l'une après l'autre, et les barres d'une lettre aussi.
  delai(indexLettre: number, indexBarre: number): number {
    return indexLettre * 0.18 + indexBarre * 0.08;
  }
}
