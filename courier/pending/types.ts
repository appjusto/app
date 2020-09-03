export type PendingParamList = {
  PendingChecklist: undefined;
  ProfileEdit?: {
    hideDeleteAccount?: boolean;
    allowPartialSave?: boolean;
  };
  ProfilePhotos: undefined;
  ProfileFeedback: undefined;
  ProfileBank?: {
    bank: {
      bankId: string;
      bankName: string;
    };
  };
  SelectBank: undefined;
};
