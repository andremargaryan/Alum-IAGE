package com.example.backend.dto.response;

import com.example.backend.entity.Commentaire;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentaireResponseDto {

    private Integer id;
    private Integer postId;
    private Integer auteurId;
    private String auteurNom;
    private String auteurPrenom;
    private String texte;
    private LocalDateTime createdAt;

    public static CommentaireResponseDto from(Commentaire commentaire) {
        return new CommentaireResponseDto(
                commentaire.getId(),
                commentaire.getPost().getId(),
                commentaire.getUser().getId(),
                commentaire.getUser().getNom(),
                commentaire.getUser().getPrenom(),
                commentaire.getTexte(),
                commentaire.getCreatedAt()
        );
    }
}