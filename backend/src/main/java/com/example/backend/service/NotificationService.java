package com.example.backend.service;

import com.example.backend.dto.NotificationResponseDto;
import com.example.backend.entity.LiaisonNotification;
import com.example.backend.entity.LiaisonNotificationId;
import com.example.backend.entity.Notification;
import com.example.backend.entity.Post;
import com.example.backend.entity.PostEvenement;
import com.example.backend.entity.PostFavori;
import com.example.backend.entity.StatutUser;
import com.example.backend.entity.User;
import com.example.backend.repository.LiaisonNotificationRepository;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.PostFavoriRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.UtilisateurConnecte;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final LiaisonNotificationRepository liaisonNotificationRepository;
    private final PostFavoriRepository postFavoriRepository;
    private final UserRepository userRepository;

    // ------------------------------------------------------------ Consultation & lecture

    /**
     * Récupère les notifications d'un utilisateur (toutes ou uniquement les non lues)
     */
    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getUserNotifications(UtilisateurConnecte moi, Integer userId, boolean unreadOnly) {
        verifierAccesEtUtilisateur(moi, userId);

        List<LiaisonNotification> liaisons = unreadOnly
                ? liaisonNotificationRepository.findUnreadByUserIdWithNotificationOrderByCreatedAtDesc(userId)
                : liaisonNotificationRepository.findByUserIdWithNotificationOrderByCreatedAtDesc(userId);

        return liaisons.stream()
                .map(NotificationResponseDto::from)
                .toList();
    }

    /**
     * Récupère le nombre de notifications non lues (pour la cloche)
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(UtilisateurConnecte moi, Integer userId) {
        verifierAccesEtUtilisateur(moi, userId);
        return liaisonNotificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * Marque une notification spécifique comme lue pour un utilisateur
     */
    @Transactional
    public void markAsRead(UtilisateurConnecte moi, Integer userId, Integer notifId) {
        verifierAccesEtUtilisateur(moi, userId);

        LiaisonNotificationId id = new LiaisonNotificationId(notifId, userId);
        LiaisonNotification liaison = liaisonNotificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification introuvable pour cet utilisateur."));

        if (!liaison.isRead()) {
            liaison.setRead(true);
            liaisonNotificationRepository.save(liaison);
        }
    }

    /**
     * Marque TOUTES les notifications d'un utilisateur comme lues
     */
    @Transactional
    public void markAllAsRead(UtilisateurConnecte moi, Integer userId) {
        verifierAccesEtUtilisateur(moi, userId);
        liaisonNotificationRepository.markAllAsReadByUserId(userId);
    }

    // ------------------------------------------------------------ Création des alertes métier

    /**
     * À appeler lors d'une inscription confirmée à un événement :
     * - notifie l'organisateur de la nouvelle inscription
     * - si la capacité maximale est atteinte, notifie l'organisateur et les utilisateurs ayant mis l'événement en favori
     */
    @Transactional
    public void notifierInscriptionEvenement(PostEvenement evenement, User inscrit, long nombreInscrits) {
        User organisateur = evenement.getUser();
        if (!organisateur.getId().equals(inscrit.getId())) {
            creerNotification(
                    "Nouvelle inscription",
                    inscrit.getPrenom() + " " + inscrit.getNom() + " s'est inscrit(e) à votre événement \"" + evenement.getTitre() + "\".",
                    evenement,
                    List.of(organisateur)
            );
        }

        if (evenement.getCapaciteMax() != null && nombreInscrits >= evenement.getCapaciteMax()) {
            creerNotification(
                    "Événement complet",
                    "Votre événement \"" + evenement.getTitre() + "\" a atteint sa capacité maximale (" + evenement.getCapaciteMax() + " places).",
                    evenement,
                    List.of(organisateur)
            );
            notifierFavorisEvenementComplet(evenement, Set.of(organisateur.getId(), inscrit.getId()));
        }
    }

    /**
     * À appeler lorsqu'une place se libère et qu'un utilisateur en liste d'attente est promu INSCRIT.
     */
    @Transactional
    public void notifierPlaceLiberee(PostEvenement evenement, User promu) {
        creerNotification(
                "Place libérée",
                "Une place s'est libérée : vous êtes maintenant inscrit(e) à l'événement \"" + evenement.getTitre() + "\".",
                evenement,
                List.of(promu)
        );
    }

    /**
     * À appeler lorsqu'un événement devient complet pour prévenir les utilisateurs qui l'ont mis en favori.
     */
    @Transactional
    public void notifierFavorisEvenementComplet(PostEvenement evenement, Set<Integer> userIdsExclus) {
        List<User> destinataires = postFavoriRepository.findByPostIdWithUser(evenement.getId()).stream()
                .map(PostFavori::getUser)
                .filter(u -> userIdsExclus == null || !userIdsExclus.contains(u.getId()))
                .toList();

        creerNotification(
                "Événement complet",
                "L'événement \"" + evenement.getTitre() + "\" que vous avez mis en favori est désormais complet.",
                evenement,
                destinataires
        );
    }

    /**
     * À appeler lorsqu'un commentaire est publié sur un post (forum ou événement) :
     * notifie l'auteur du post et les utilisateurs qui ont mis ce post en favori (hors auteur du commentaire).
     */
    @Transactional
    public void notifierNouveauCommentaire(Post post, User auteurCommentaire) {
        List<User> destinataires = new ArrayList<>();
        destinataires.add(post.getUser());
        postFavoriRepository.findByPostIdWithUser(post.getId()).stream()
                .map(PostFavori::getUser)
                .forEach(destinataires::add);

        List<User> destinatairesFiltres = destinataires.stream()
                .filter(u -> !u.getId().equals(auteurCommentaire.getId()))
                .toList();

        creerNotification(
                "Nouveau commentaire",
                auteurCommentaire.getPrenom() + " " + auteurCommentaire.getNom() + " a commenté le post \"" + post.getTitre() + "\".",
                post,
                destinatairesFiltres
        );
    }

    // ------------------------------------------------------------ Outils

    private void creerNotification(String titre, String message, Post post, Collection<User> destinataires) {
        Map<Integer, User> uniquesActifs = new LinkedHashMap<>();
        for (User u : destinataires) {
            if (u != null && u.getStatut() == StatutUser.ACTIF && u.isNotificationsActives()) {
                uniquesActifs.putIfAbsent(u.getId(), u);
            }
        }
        if (uniquesActifs.isEmpty()) {
            return;
        }

        Notification notif = new Notification();
        notif.setTitre(tronquer(titre, 150));
        notif.setMessage(tronquer(message, 500));
        notif.setPost(post);
        Notification saved = notificationRepository.save(notif);

        List<LiaisonNotification> liaisons = uniquesActifs.values().stream()
                .map(user -> new LiaisonNotification(saved, user, false))
                .toList();
        liaisonNotificationRepository.saveAll(liaisons);
    }

    private String tronquer(String texte, int max) {
        if (texte == null || texte.length() <= max) {
            return texte;
        }
        return texte.substring(0, max - 3) + "...";
    }

    private void verifierAccesEtUtilisateur(UtilisateurConnecte moi, Integer userId) {
        if (!moi.userId().equals(userId) && !moi.estAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Accès refusé : vous ne pouvez consulter ou modifier que vos propres notifications.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable : " + userId));
        if (user.getStatut() == StatutUser.SUPPRIME) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Utilisateur introuvable : " + userId);
        }
    }
}