import { Bank } from '@appjusto/types';
import { FleetDetailParamList } from '../../../../common/screens/fleet/FleetDetail';
import { ProfileEditParamList } from '../../../../common/screens/profile/CommonProfileEdit';
import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';

export type CourierProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  RequestProfileEdit: undefined;
  ProfileCompany: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  ProfileBank?: {
    bank: Bank;
  };
  SelectBank: undefined;
  AboutApp: undefined;
  PartnersAndDiscounts: undefined;
  // fleets
  ChooseFleet?: {
    fleetId: string;
  };
  CreateFleet: undefined;
  AllFleets: undefined;
} & ProfileEraseParamList &
  FleetDetailParamList &
  ProfileEditParamList;
