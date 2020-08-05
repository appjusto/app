export interface UserState {
  user?: firebase.User | null;
}

export interface ProfileInfo {
  situation?: 'pending' | 'approved' | 'reject' | 'blocked';
}
