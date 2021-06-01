import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { DeliveryProblemNavigatorParamList } from './delivery-problem/types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DeliveryProblemNavigatorParamList, 'DeliveryProblemFeedback'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<DeliveryProblemNavigatorParamList, 'DeliveryProblemFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveryProblemFeedback = ({ navigation, route }: Props) => {
  // params
  const { issueType, orderId } = route.params;

  const feedbackHeaderTitle = (() => {
    if (issueType === 'courier-refuse') {
      return t('O pedido foi cancelado');
    } else {
      return '';
    }
  })();
  const feedbackDescription = (() => {
    if (issueType === 'courier-refuse') {
      return t('Como o pedido não foi retirado, você não receberá nada do valor da entrega.');
    } else {
      return undefined;
    }
  })();
  // handlers
  const finishHandler = () => {
    if (issueType === 'courier-refuse') {
      navigation.replace('MainNavigator', { screen: 'Home' });
    }
  };
  return (
    <FeedbackView
      header={feedbackHeaderTitle}
      icon={issueType === 'courier-refuse' ? <IconConeYellow /> : <IconMotocycle />}
      background={colors.grey50}
      description={feedbackDescription}
    >
      <DefaultButton title={t('Voltar para o início')} onPress={finishHandler} />
    </FeedbackView>
  );
};
