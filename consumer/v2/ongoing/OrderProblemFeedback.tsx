import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OrderProblemFeedback'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OrderProblemFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderProblemFeedback = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // tracking
  useSegmentScreen('OrderProblemFeedback');
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
        onPress={() => {
          track('navigating back to OngoingOrder');
          navigation.replace('OngoingOrder', { orderId });
        }}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
