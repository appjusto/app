export interface UserState {
  user?: firebase.User | null;
}

export type ProfileSituation = 'pending' | 'submitted' | 'approved' | 'rejected' | 'blocked';

export interface ProfileInfo {
  situation?: ProfileSituation;
}

export interface UserProfile {
  id?: string;
  name?: string;
  surname?: string;
  cpf?: string;
  phone?: {
    ddd: string;
    number: string;
  };
  notificationToken?: string | null;
  info?: ProfileInfo;
}

export interface DeleteAccountSurvey {
  notWorkingOnMyRegion: boolean;
  didntFindWhatINeeded: boolean;
  pricesHigherThanAlternatives: boolean;
  didntLikeApp: boolean;
  didntFeelSafe: boolean;
  ratherUseAnotherApp: boolean;
}
