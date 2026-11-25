import { Component, Input } from '@angular/core';

// Pastille ronde avec les initiales d'une personne.
@Component({
  selector: 'app-avatar',
  template: `<span class="avatar teinte-{{ teinte }} taille-{{ taille }}">{{ initiales }}</span>`,
  styleUrl: './avatar.scss',
})
export class Avatar {
  @Input() initiales = '';
  @Input() teinte = 'bleu';
  @Input() taille: 'petit' | 'moyen' | 'grand' = 'moyen';
}
