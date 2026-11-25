package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentaireCreateDto {

    @NotBlank(message = "Le commentaire ne peut pas être vide")
    @Size(max = 2000, message = "Le commentaire est trop long (2000 caractères max)")
    private String texte;
}