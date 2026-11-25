import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../../modeles/notification';
import { NotificationService } from '../../services/notification.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-cloche-notifications',
  imports: [DatePipe],
  templateUrl: './cloche-notifications.html',
  styleUrl: './cloche-notifications.scss',
})
export class ClocheNotifications implements OnInit {
  private notificationService = inject(NotificationService);
  private session = inject(SessionService);
  private router = inject(Router);

  nonLues = signal(0);
  notifications = signal<Notification[]>([]);
  ouvert = signal(false);
  chargement = signal(false);

  ngOnInit(): void {
    this.chargerCompteur();
  }

  basculer(): void {
    this.ouvert.set(!this.ouvert());
    if (this.ouvert()) {
      this.chargerListe();
    }
  }

  fermer(): void {
    this.ouvert.set(false);
  }

  toutMarquerLu(): void {
    this.notificationService.toutMarquerLu(this.userId()).subscribe(() => {
      this.nonLues.set(0);
      this.notifications.set(this.notifications().map((notif) => ({ ...notif, isRead: true })));
    });
  }

  ouvrir(notification: Notification): void {
    this.fermer();
    if (notification.postId) {
      this.router.navigate(['/forum', notification.postId]);
    }
  }

  private chargerCompteur(): void {
    this.notificationService.nombreNonLues(this.userId()).subscribe({
      next: (nombre) => this.nonLues.set(nombre),
      error: () => this.nonLues.set(0),
    });
  }

  private chargerListe(): void {
    this.chargement.set(true);
    this.notificationService.lister(this.userId()).subscribe({
      next: (liste) => {
        this.notifications.set(liste);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false),
    });
  }

  private userId(): number {
    return this.session.utilisateur()!.userId;
  }
}
