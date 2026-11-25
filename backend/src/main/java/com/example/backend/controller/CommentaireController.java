package com.example.backend.controller;

import com.example.backend.dto.request.CommentaireCreateDto;
import com.example.backend.dto.response.CommentaireResponseDto;
import com.example.backend.security.JwtInterceptor;
import com.example.backend.security.UtilisateurConnecte;
import com.example.backend.service.CommentaireService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Gestion des commentaires sur les posts (sujets de forum et événements).
// Protégé par JwtInterceptor.
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class CommentaireController {

    private final CommentaireService commentaireService;

    // Ajouter un commentaire à un post : POST /api/posts/{postId}/comments
    @PostMapping("/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentaireResponseDto ajouter(@RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
                                          @PathVariable("postId") Integer postId,
                                          @Valid @RequestBody CommentaireCreateDto dto) {
        return commentaireService.ajouterCommentaire(moi.userId(), postId, dto);
    }

    // Lire tous les commentaires d'un post : GET /api/posts/{postId}/comments
    @GetMapping("/{postId}/comments")
    public List<CommentaireResponseDto> lister(@PathVariable("postId") Integer postId) {
        return commentaireService.listerParPost(postId);
    }

    // Supprimer un commentaire : DELETE /api/posts/comments/{commentaireId}
    @DeleteMapping("/comments/{commentaireId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
                          @PathVariable("commentaireId") Integer commentaireId) {
        commentaireService.supprimerCommentaire(moi.userId(), commentaireId);
    }
}