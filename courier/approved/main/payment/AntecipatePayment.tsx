import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PaymentNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PaymentNavigatorParamList, 'AntecipatePayment'>;
type ScreenRoute = RouteProp<PaymentNavigatorParamList, 'AntecipatePayment'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const AntecipatePayment = ({ navigation, route }) => {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.xl }}>{t('Taxa de adiantamento')}</Text>
      </PaddedView>
    </View>
  );
};
