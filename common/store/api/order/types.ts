import { OrderStatus } from 'appjusto-types';

export type ObserveOrdersOptions = {
  createdBy?: string;
  deliveredBy?: string;
  statuses?: OrderStatus[];
};
