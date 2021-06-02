import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderCancelFeedback'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderCancelFeedback'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const OngoingOrderCancelFeedback = ({ navigation, route }: Props) => {
  return (
    <FeedbackView
      header={t('Obrigado pelas informações. Seu pedido foi cancelado.')}
      icon={<IconMotocycle />}
      background={colors.grey50}
      description=""
    >
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => navigation.navigate('MainNavigator', { screen: 'Home' })}
      />
    </FeedbackView>
  );
};
