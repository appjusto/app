import { ConsumerProfile } from '@appjusto/types';

export const getPaymentMethodById = (
  consumer: ConsumerProfile | undefined,
  id: string | undefined
) => consumer?.paymentChannel?.methods?.find((method) => method.id === id);
