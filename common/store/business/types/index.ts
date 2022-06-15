import { Business, ManagerProfile, WithId } from '@appjusto/types';

export interface BusinessState {
  manager?: WithId<ManagerProfile>;
  business?: WithId<Business>;
}
