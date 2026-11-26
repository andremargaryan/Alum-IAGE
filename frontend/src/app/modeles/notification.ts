// GET /users/{id}/notifications
export interface Notification {
  notifId: number;
  titre: string;
  message: string;
  postId: number | null;
  createdAt: string;
  isRead: boolean;
}
