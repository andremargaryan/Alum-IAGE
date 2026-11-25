package com.example.backend.repository;

import com.example.backend.entity.LiaisonNotification;
import com.example.backend.entity.LiaisonNotificationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LiaisonNotificationRepository extends JpaRepository<LiaisonNotification, LiaisonNotificationId> {

    // Toutes les notifications d'un utilisateur, de la plus récente à la plus ancienne (JOIN FETCH évite le N+1)
    @Query("""
            SELECT l FROM LiaisonNotification l
            JOIN FETCH l.notification n
            LEFT JOIN FETCH n.post
            WHERE l.user.id = :userId
            ORDER BY n.createdAt DESC, n.id DESC
            """)
    List<LiaisonNotification> findByUserIdWithNotificationOrderByCreatedAtDesc(@Param("userId") Integer userId);

    // Uniquement les notifications non lues d'un utilisateur, de la plus récente à la plus ancienne
    @Query("""
            SELECT l FROM LiaisonNotification l
            JOIN FETCH l.notification n
            LEFT JOIN FETCH n.post
            WHERE l.user.id = :userId AND l.read = false
            ORDER BY n.createdAt DESC, n.id DESC
            """)
    List<LiaisonNotification> findUnreadByUserIdWithNotificationOrderByCreatedAtDesc(@Param("userId") Integer userId);

    // Compteur de la cloche : nombre de notifications non lues
    long countByUserIdAndReadFalse(Integer userId);

    // Marquer toutes les notifications non lues d'un utilisateur comme lues en une seule requête SQL
    @Modifying
    @Query("UPDATE LiaisonNotification l SET l.read = true WHERE l.user.id = :userId AND l.read = false")
    int markAllAsReadByUserId(@Param("userId") Integer userId);
}
