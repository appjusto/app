import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { MatchingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MatchingParamList, 'RejectedMatchingFeedback'>,
  StackNavigationProp<ApprovedParamList, 'MatchingNavigator'>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RejectedMatchingFeedback = ({ navigation }: Props) => {
  // tracking
  useSegmentScreen('RejectedMatchingFeedback');
  return (
    <FeedbackView
      header={t('Obrigado pelas informações')}
      icon={<IconConeYellow />}
      background={colors.grey50}
      description={t('Seu feedback serve para melhorar nossos serviços')}
    >
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
