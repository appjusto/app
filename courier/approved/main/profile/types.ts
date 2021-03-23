import { Bank } from 'appjusto-types';
import { FleetDetailParamList } from '../../../../common/screens/fleet/FleetDetail';
import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';

export type CourierProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfileCompany: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  ProfileBank?: {
    bank: Bank;
  };
  SelectBank: undefined;
  // fleets
  ChooseFleet?: {
    fleetId: string;
  };
  CreateFleet: undefined;
  AllFleets: undefined;
} & ProfileEraseParamList &
  FleetDetailParamList;
