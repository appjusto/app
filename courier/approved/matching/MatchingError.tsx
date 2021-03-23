import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { MatchingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MatchingParamList, 'MatchingError'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default ({ navigation }: Props) => {
  // UI
  return (
    <FeedbackView
      header={t('Esse pedido já foi aceito por outro entregador :(')}
      icon={icons.coneYellow}
    >
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
        secondary
      />
    </FeedbackView>
  );
};
