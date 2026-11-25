package com.example.backend.repository;

import com.example.backend.entity.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Integer> {
    // Récupère les commentaires d'un post du plus ancien au plus récent (ordre chronologique d'un fil)
    List<Commentaire> findByPostIdOrderByCreatedAtAsc(Integer postId);
}