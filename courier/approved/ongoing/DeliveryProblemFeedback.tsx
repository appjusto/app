import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding } from '../../../common/styles';
import { OngoingOrderNavigatorParamList } from '../../../consumer/v2/ongoing/types';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { DeliveryProblemNavigatorParamList } from './delivery-problem/types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    DeliveryProblemNavigatorParamList &
      OngoingDeliveryNavigatorParamList &
      OngoingOrderNavigatorParamList,
    'DeliveryProblemFeedback'
  >,
  StackNavigationProp<ApprovedParamList & LoggedNavigatorParamList & OngoingOrderNavigatorParamList>
>;
type ScreenRoute = RouteProp<
  DeliveryProblemNavigatorParamList & OngoingDeliveryNavigatorParamList,
  'DeliveryProblemFeedback'
>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveryProblemFeedback = ({ navigation, route }: Props) => {
  // params
  const { issueType, orderId } = route.params;
  // tracking
  useSegmentScreen('DeliveryProblemFeedback');
  // handlers
  const finishHandler = () => {
    navigation.replace('OngoingDeliveryNavigator', {
      screen: 'OngoingDelivery',
      params: { orderId },
    });
  };
  // UI
  return (
    <FeedbackView
      header={t('Aguarde enquanto estamos analisando o seu problema.')}
      icon={<IconMotocycle />}
      background={colors.grey50}
      description={t(
        'Em breve entraremos em contato com você para relatar a resolução do seu problema.'
      )}
    >
      <DefaultButton
        title={t('Voltar')}
        onPress={finishHandler}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
