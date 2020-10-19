export interface UserState {
  user?: firebase.User | null;
}

export interface DeleteAccountSurvey {
  notWorkingOnMyRegion: boolean;
  didntFindWhatINeeded: boolean;
  pricesHigherThanAlternatives: boolean;
  didntLikeApp: boolean;
  didntFeelSafe: boolean;
  ratherUseAnotherApp: boolean;
}

export interface OrderComplaintSurvey {
  courierDamagedOrder: boolean;
  courierDidntDeliver: boolean;
  courierHasBadManners: boolean;
  courierLateDelivery: boolean;
  didntOrderThat: boolean;
  incorrectBilling: boolean;
  other: boolean;
}
