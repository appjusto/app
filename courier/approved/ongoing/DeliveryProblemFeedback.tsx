import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
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

  const ongoingDelivery =
    issueType === 'courier-pickup-food-delivery' ||
    issueType === 'courier-pickup-p2p-delivery' ||
    issueType === 'courier-delivering-food-order' ||
    issueType === 'courier-delivering-p2p-order' ||
    issueType === 'courier-destination-food' ||
    issueType === 'courier-destination-p2p';

  const ongoingOrder =
    issueType === 'consumer-delivered-food-order' ||
    'consumer-going-pickup-food' ||
    'consumer-ongoing-food' ||
    'consumer-arrived-food-order' ||
    'consumer-delivered-p2p-order' ||
    'consumer-going-pickup-p2p' ||
    'consumer-ongoing-p2p' ||
    'consumer-arrived-p2p-order';

  // handlers
  const finishHandler = () => {
    if (ongoingDelivery) {
      navigation.replace('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: { orderId },
      });
    } else if (ongoingOrder) {
      navigation.replace('OngoingOrder', { orderId });
    }
  };
  console.log(issueType);
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
