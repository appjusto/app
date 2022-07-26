import { FetchAccountInformationResponse } from '@appjusto/types';
import { ChatParamList } from '../../../../common/screens/Chat';

export type DeliveriesNavigatorParamList = {
  DeliveryHistoryByMonth: undefined;
  DeliverySummary: {
    orderId: string;
  };
  Receivables: {
    receivableBalance: string;
  };
  AdvanceReceivables: {
    ids: number[];
  };
  Withdraws: {
    info?: FetchAccountInformationResponse;
  };
  RequestWithdrawFeedback: {
    header: string;
    description: string;
  };
  AdvanceReceivablesFeedback: {
    header: string;
    description: string;
  };
} & ChatParamList;
