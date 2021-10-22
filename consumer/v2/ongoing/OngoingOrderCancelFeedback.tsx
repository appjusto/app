import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<
  LoggedNavigatorParamList,
  'OngoingOrderCancelFeedback'
>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'OngoingOrderCancelFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderCancelFeedback = ({ navigation, route }: Props) => {
  // tracking
  useSegmentScreen('OngoingOrderCancelFeedback');
  return (
    <FeedbackView
      header={t('Obrigado pelas informações. Seu pedido foi cancelado.')}
      description={t('Você pode ver as informações desse pedido no seu Histórico de Pedidos.')}
      icon={<IconMotocycle />}
      background={colors.grey50}
    >
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => {
          track('navigating to home screen');
          navigation.navigate('MainNavigator', { screen: 'Home' });
        }}
      />
    </FeedbackView>
  );
};
