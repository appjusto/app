import { OrderStatus } from '@appjusto/types';

export type ObserveOrdersOptions = {
  consumerId?: string;
  courierId?: string;
  statuses?: OrderStatus[];
  limit?: number;
  businessId?: string;
};

export type ObserveBusinessOrdersOptions = {
  businessId?: string;
  statuses?: OrderStatus[];
  limit?: number;
};
