import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
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

  const feedbackHeaderTitle = (() => {
    if (issueType === 'courier-drops-delivery') {
      return t('O pedido foi cancelado');
    } else if (
      issueType === 'courier-delivery-problem' ||
      issueType === 'consumer-delivery-problem'
    ) {
      return t('Aguarde enquanto estamos analisando o seu problema.');
    }
  })();
  const feedbackDescription = (() => {
    if (issueType === 'courier-drops-delivery') {
      return t('Como o pedido não foi retirado, você não receberá nada do valor da entrega.');
    } else if (
      issueType === 'courier-delivery-problem' ||
      issueType === 'consumer-delivery-problem'
    ) {
      return t('Em breve entraremos em contato com você para relatar a resolução do seu problema.');
    }
  })();
  // handlers
  const finishHandler = () => {
    if (issueType === 'courier-delivery-problem') {
      navigation.replace('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: { orderId },
      });
    } else if (issueType === 'consumer-delivery-problem') {
      navigation.replace('OngoingOrder', { orderId });
    } else {
      navigation.replace('MainNavigator', { screen: 'Home' });
    }
  };
  console.log(issueType);
  return (
    <FeedbackView
      header={feedbackHeaderTitle}
      icon={issueType === 'courier-drops-delivery' ? <IconConeYellow /> : <IconMotocycle />}
      background={colors.grey50}
      description={feedbackDescription}
    >
      <DefaultButton
        title={t('Voltar')}
        onPress={finishHandler}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
