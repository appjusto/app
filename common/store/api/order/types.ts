import { OrderStatus } from '@appjusto/types';

export type ObserveOrdersOptions = {
  consumerId?: string;
  courierId?: string;
  businessId?: string;
  statuses?: OrderStatus[];
  orderField?: string;
  from?: Date;
  to?: Date;
  limit?: number;
};
