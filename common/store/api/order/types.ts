import { OrderStatus } from 'appjusto-types';

export type ObserveOrdersOptions = {
  consumerId?: string;
  courierId?: string;
  statuses?: OrderStatus[];
  limit?: number;
  businessId?: string;
};
