// L'API n'a pas de route pour lister les catégories : on reprend celles du seed (db/init/02_seed.sql).
export interface Categorie {
  id: number;
  libelle: string;
  teinte: string; // nom de la couleur du badge, défini dans styles.scss
}

export const CATEGORIES_EVENEMENT: Categorie[] = [
  { id: 1, libelle: 'Soirée', teinte: 'violet' },
  { id: 2, libelle: 'Conférence', teinte: 'bleu' },
  { id: 3, libelle: 'Sport', teinte: 'vert' },
  { id: 4, libelle: 'Atelier', teinte: 'ambre' },
];

export const CATEGORIES_FORUM: Categorie[] = [
  { id: 5, libelle: 'Emploi', teinte: 'bleu' },
  { id: 6, libelle: 'Entraide', teinte: 'vert' },
  { id: 7, libelle: 'Discussion', teinte: 'violet' },
];

// Retrouve la teinte d'une catégorie à partir de son identifiant.
export function teinteCategorie(categorieId: number): string {
  const toutes = [...CATEGORIES_EVENEMENT, ...CATEGORIES_FORUM];
  const trouvee = toutes.find((categorie) => categorie.id === categorieId);
  return trouvee ? trouvee.teinte : 'gris';
}
