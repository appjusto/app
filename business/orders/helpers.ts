import { OrderStatus } from '@appjusto/types';

export const acceptStatuses = ('confirmed' || 'preparing' || 'ready') as OrderStatus;
export const cancellableStatuses = ('preparing' || 'ready') as OrderStatus;
export const cookingTimeStatuses = ('confirmed' || 'preparing') as OrderStatus;
