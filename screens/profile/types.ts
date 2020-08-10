export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit?: {
    hideDeleteAccount?: boolean;
    nextScreen?: 'ProfileCards';
    nextScreenParams?: {
      popCount?: number;
    };
  };
  ProfileErase: undefined;
  ProfilePhotos: undefined;
  ProfileCards?: {
    popCount?: number;
  };
};
