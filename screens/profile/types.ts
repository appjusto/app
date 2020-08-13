export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit?: {
    hideDeleteAccount?: boolean;
    allowPartialSave?: boolean;
  };
  ProfileErase: undefined;
  ProfilePhotos: undefined;
  ProfileCards?: {
    popCount?: number;
  };
  ProfileBank?: {
    bank: {
      bankId: string;
      bankName: string;
    };
  };
  SelectBank: undefined;
  Terms: undefined;
};
