type FinancialOperation = 'withdraw' | 'antecipate';

export type PaymentNavigatorParamList = {
  Payment: {
    operation: FinancialOperation;
  };
};
