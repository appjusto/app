import { IssueType } from '@appjusto/types';
import { OngoingOrderNavigatorParamList } from '../../../../consumer/v2/ongoing/types';
import { OngoingDeliveryNavigatorParamList } from '../types';

export type DeliveryProblemNavigatorParamList = {
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  } & OngoingDeliveryNavigatorParamList &
    OngoingOrderNavigatorParamList;
};
