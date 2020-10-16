import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import { getOrderById } from '../../../common/store/order/selectors';
import { padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';
import TipControl from './common/TipControl';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderDeliveredFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderDeliveredFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params;
  // app state
  const order = useSelector(getOrderById)(orderId)!;
  // UI
  return (
    <View style={screens.default}>
      <ScrollView>
        <PaddedView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.big]}>{t('Pedido\nentregue')}</Text>
            <Image source={icons.motocycle} />
          </View>
        </PaddedView>
        <HR height={padding} />
        <TipControl
          orderId={order.id}
          orderTip={order.tip?.value ?? 0}
          courierId={order.courier!.id}
          courierName={order.courier!.name}
        />
        <HR height={padding} />
        <PaddedView>
          <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
          <View style={{ flexDirection: 'row' }}>
            <DefaultButton title={t('Relatar um problema')} secondary onPress={() => null} />
            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Detalhes da corrida')}
              onPress={() =>
                navigation.navigate('HistoryNavigator', {
                  screen: 'OrderSummary',
                  params: { orderId },
                })
              }
              secondary
            />
          </View>
        </PaddedView>
      </ScrollView>
    </View>
  );
};
