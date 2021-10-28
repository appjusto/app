import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useSegmentScreen } from '../../../common/store/api/track';
import { padding, screens } from '../../../common/styles';
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
  // side effects
  // tracking
  useSegmentScreen('MatchingError');
  // UI
  return (
    <View style={{ ...screens.default }}>
      <FeedbackView
        header={t('Esse pedido já foi aceito por outro/a entregador/a :(')}
        icon={<IconConeYellow />}
      >
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => {
            navigation.replace('MainNavigator', { screen: 'Home' });
          }}
          secondary
          style={{ marginBottom: padding }}
        />
      </FeedbackView>
    </View>
  );
};
