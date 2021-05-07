import { Bank } from '@appjusto/types';

type FinancialOperation = 'withdraw' | 'antecipate';

export type PaymentNavigatorParamList = {
  Payment: {
    operation: FinancialOperation;
  };
  ProfileBank?: {
    bank: Bank;
  };
  PaymentRequestedFeedback: undefined;
};
