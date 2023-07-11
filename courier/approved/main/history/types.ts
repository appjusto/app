import { FetchAccountInformationResponse } from '@appjusto/types';
import { ChatParamList } from '../../../../common/screens/Chat';

export type DeliveriesNavigatorParamList = {
  DeliveryHistoryByWeek: undefined;
  DeliverySummary: {
    orderId: string;
  };
  Withdraws: {
    info?: FetchAccountInformationResponse;
  };
  RequestWithdrawFeedback: {
    header: string;
    description: string;
  };
} & ChatParamList;
