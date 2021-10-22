import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { padding } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'OrderNull'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const OrderNull = ({ navigation }: Props) => {
  // tracking
  useSegmentScreen('OrderNull');
  return (
    <FeedbackView header={t('Esse pedido foi cancelado')} icon={<IconConeYellow />}>
      <View style={{ marginBottom: padding }}>
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => {
            track('navigating Home');
            navigation.replace('MainNavigator', { screen: 'Home' });
          }}
          secondary
        />
      </View>
    </FeedbackView>
  );
};
