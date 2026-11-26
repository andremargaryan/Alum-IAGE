// GET /api/posts (PostForumResponseDto)
export interface Sujet {
  id: number;
  titre: string;
  description: string;
  categorieId: number;
  categorieLibelle: string;
  auteurId: number;
  auteurNom: string;
  createdAt: string;
  nombreLikes: number;
  likeParMoi: boolean;
}

// POST /api/posts (PostForumCreateDto)
export interface NouveauSujet {
  titre: string;
  description: string;
  categorieId: number;
}

// POST /api/posts/{id}/like
export interface EtatLike {
  postId: number;
  aime: boolean;
  nombreLikes: number;
}

// GET /api/posts/{id}/comments
export interface Commentaire {
  id: number;
  postId: number;
  auteurId: number;
  auteurNom: string;
  auteurPrenom: string;
  texte: string;
  createdAt: string;
}
