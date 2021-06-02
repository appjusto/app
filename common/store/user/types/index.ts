export interface UserState {
  user?: firebase.User | null;
  metadata?: { hasPendingWrites: boolean };
}
