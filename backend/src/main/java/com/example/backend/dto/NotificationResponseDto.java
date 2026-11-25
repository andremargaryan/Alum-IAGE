package com.example.backend.dto;

import com.example.backend.entity.LiaisonNotification;
import com.example.backend.entity.Notification;

import java.time.LocalDateTime;

public record NotificationResponseDto(
    Integer notifId,
    String titre,
    String message,
    Integer postId,
    LocalDateTime createdAt,
    boolean isRead
) {
    public static NotificationResponseDto from(LiaisonNotification liaison) {
        Notification notification = liaison.getNotification();
        return new NotificationResponseDto(
                notification.getId(),
                notification.getTitre(),
                notification.getMessage(),
                notification.getPost() != null ? notification.getPost().getId() : null,
                notification.getCreatedAt(),
                liaison.isRead()
        );
    }
}