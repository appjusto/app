import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconCall } from '../../../common/icons/icon-call';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'CallCourier'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'CallCourier'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const CallCourier = () => {
  // tracking
  useSegmentScreen('CallCourier');
  return (
    <FeedbackView
      header={t('Vamos ligar para você')}
      icon={<IconCall />}
      background={colors.grey50}
      description={t('Nosso atendende irá ligar para você. Aguarde um momento.')}
    />
  );
};
