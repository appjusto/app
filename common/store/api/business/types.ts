import { BusinessStatus, BusinessType } from 'appjusto-types';

export type ObserveBusinessOptions = {
  type: BusinessType;
  status?: BusinessStatus;
};
