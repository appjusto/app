import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import { View, Text, Image } from 'react-native';
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
import OrderFeedbackControl from './common/OrderFeedbackControl';
import TipControl from './common/TipControl';
import PlaceSummary from './p2p-order/PlaceSummary';

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
  const paddingTop = Constants.statusBarHeight;
  return (
    <View style={{ flex: 1 }}>
      <PaddedView style={{ ...screens.default, paddingTop }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[texts.big]}>{t('Pedido\nentregue')}</Text>
          <Image source={icons.motocycle} />
        </View>
        <PlaceSummary place={order.origin} title={t('Retirada')} />
        <PlaceSummary place={order.destination} title={t('Entrega')} />
        <HR height={padding} />
        <OrderFeedbackControl orderId={orderId} />
        <HR height={padding} />
        <TipControl
          orderId={order.id}
          orderTip={order.tip?.value ?? 0}
          courierId={order.courier!.id}
          courierName={order.courier!.name}
        />
        <HR height={padding} />
        <View style={{ marginTop: padding }}>
          <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
        </View>
      </PaddedView>
    </View>
  );
};
