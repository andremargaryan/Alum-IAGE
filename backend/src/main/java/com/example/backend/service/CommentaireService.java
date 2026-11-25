package com.example.backend.service;

import com.example.backend.dto.request.CommentaireCreateDto;
import com.example.backend.dto.response.CommentaireResponseDto;
import com.example.backend.entity.Commentaire;
import com.example.backend.entity.Post;
import com.example.backend.entity.StatutPost;
import com.example.backend.entity.StatutUser;
import com.example.backend.entity.User;
import com.example.backend.repository.CommentaireRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Ajouter un commentaire sur un post (Forum ou Événement)
    @Transactional
    public CommentaireResponseDto ajouterCommentaire(Integer auteurId, Integer postId, CommentaireCreateDto dto) {
        User auteur = trouverUtilisateurActif(auteurId);
        Post post = trouverPostPublie(postId);

        Commentaire commentaire = new Commentaire();
        commentaire.setUser(auteur);
        commentaire.setPost(post);
        commentaire.setTexte(dto.getTexte().trim());

        Commentaire enregistre = commentaireRepository.save(commentaire);
        return CommentaireResponseDto.from(enregistre);
    }

    // Lister les commentaires d'un post
    @Transactional(readOnly = true)
    public List<CommentaireResponseDto> listerParPost(Integer postId) {
        trouverPostPublie(postId); // Renvoie 404 si le post n'existe pas ou est archivé
        return commentaireRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentaireResponseDto::from)
                .toList();
    }

    // Supprimer son propre commentaire (ou suppression par un ADMIN)
    @Transactional
    public void supprimerCommentaire(Integer moiId, Integer commentaireId) {
        User moi = trouverUtilisateurActif(moiId);
        Commentaire commentaire = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Commentaire introuvable : " + commentaireId));

        boolean estAuteur = commentaire.getUser().getId().equals(moi.getId());
        boolean estAdmin = moi.getRole().name().equals("ADMIN");

        if (!estAuteur && !estAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous ne pouvez supprimer que vos propres commentaires");
        }

        commentaireRepository.delete(commentaire);
    }

    // --- Outils ---

    private Post trouverPostPublie(Integer postId) {
        return postRepository.findById(postId)
                .filter(post -> post.getStatut() == StatutPost.PUBLIE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Post introuvable ou non publié : " + postId));
    }

    private User trouverUtilisateurActif(Integer userId) {
        return userRepository.findById(userId)
                .filter(user -> user.getStatut() == StatutUser.ACTIF)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Utilisateur inconnu ou inactif : " + userId));
    }
}