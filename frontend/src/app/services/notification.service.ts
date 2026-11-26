import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../modeles/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  // GET /users/{id}/notifications
  lister(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`/users/${userId}/notifications`, {
      params: new HttpParams().set('unreadOnly', false),
    });
  }

  // GET /users/{id}/notifications/unread-count : le chiffre sur la cloche
  nombreNonLues(userId: number): Observable<number> {
    return this.http.get<number>(`/users/${userId}/notifications/unread-count`);
  }

  // PATCH /users/{id}/notifications/read-all
  toutMarquerLu(userId: number): Observable<void> {
    return this.http.patch<void>(`/users/${userId}/notifications/read-all`, {});
  }
}
