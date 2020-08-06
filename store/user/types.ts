export interface UserState {
  user?: firebase.User | null;
}

export interface UserProfile {
  id: string;
  name?: string;
  surname?: string;
  cpf?: string;
  phone?: string;
  notificationToken?: string;
}

export interface ProfileInfo {
  situation?: 'pending' | 'submitted' | 'approved' | 'reject' | 'blocked';
}
