import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import { getOrderById } from '../../../common/store/order/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
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
      <KeyboardAwareScrollView>
        {/* header */}
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 32,
              alignItems: 'center',
            }}
          >
            <Text style={[texts.big]}>{t('Pedido\nentregue')}</Text>
            <View style={{ height: 112, width: 160 }}>
              <Image
                source={icons.illustration}
                style={{ overflow: 'hidden', height: 112, width: 160 }}
              />
            </View>
          </View>
        </PaddedView>
        <HR height={padding} />
        {/* tip */}
        <TipControl
          orderId={order.id}
          orderTip={order.tip?.value ?? 0}
          courierId={order.courier!.id}
          courierName={order.courier!.name}
        />
        <HR />
        {/* actions */}
        <PaddedView>
          <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: padding,
            }}
          >
            <DefaultButton title={t('Relatar um problema')} secondary onPress={() => null} />
            <DefaultButton
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
      </KeyboardAwareScrollView>
    </View>
  );
};
