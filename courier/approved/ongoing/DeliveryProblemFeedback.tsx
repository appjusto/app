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
    } else if (issueType === 'courier-delivery-problem') {
      return t('Aguarde enquanto estamos analisando o seu problema.');
    }
  })();
  const feedbackDescription = (() => {
    if (issueType === 'courier-refuse') {
      return t('Como o pedido não foi retirado, você não receberá nada do valor da entrega.');
    } else if (issueType === 'courier-delivery-problem') {
      return t('Em breve entraremos em contato com você para relatar a resolução do seu problema.');
    }
  })();
  // handlers
  const finishHandler = () => {
    navigation.replace('MainNavigator', { screen: 'Home' });
  };
  return (
    <FeedbackView
      header={feedbackHeaderTitle}
      icon={issueType === 'courier-drops-delivery' ? <IconConeYellow /> : <IconMotocycle />}
      background={colors.grey50}
      description={feedbackDescription}
    >
      <DefaultButton title={t('Voltar para o início')} onPress={finishHandler} />
    </FeedbackView>
  );
};
