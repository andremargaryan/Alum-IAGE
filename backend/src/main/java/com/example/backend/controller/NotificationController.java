package com.example.backend.controller;

import com.example.backend.dto.NotificationResponseDto;
import com.example.backend.security.JwtInterceptor;
import com.example.backend.security.UtilisateurConnecte;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Notifications utilisateur : consultation des alertes, compteur non-lu et marquage comme lu.
// Toutes ces routes demandent le jeton JWT (vérifié par JwtInterceptor).
@RestController
@RequestMapping("/users/{userId}/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 1. Récupérer les notifications d'un utilisateur (option ?unreadOnly=true)
    @GetMapping
    public List<NotificationResponseDto> getUserNotifications(
            @RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
            @PathVariable("userId") Integer userId,
            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly) {
        return notificationService.getUserNotifications(moi, userId, unreadOnly);
    }

    // 2. Compteur pour la cloche (nombre de notifications non lues)
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
            @PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(moi, userId));
    }

    // 3. Marquer une notification précise comme lue
    @PatchMapping("/{notifId}/read")
    public ResponseEntity<Void> markAsRead(
            @RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
            @PathVariable("userId") Integer userId,
            @PathVariable("notifId") Integer notifId) {
        notificationService.markAsRead(moi, userId, notifId);
        return ResponseEntity.noContent().build();
    }

    // 4. Marquer TOUTES les notifications comme lues
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestAttribute(JwtInterceptor.UTILISATEUR) UtilisateurConnecte moi,
            @PathVariable("userId") Integer userId) {
        notificationService.markAllAsRead(moi, userId);
        return ResponseEntity.noContent().build();
    }
}