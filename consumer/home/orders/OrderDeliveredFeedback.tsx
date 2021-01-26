import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
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
  // params
  const { orderId } = route.params;
  // screen state
  const { order } = useObserveOrder(orderId);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  return (
    <View style={screens.default}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
          <DefaultButton
            title={t('Finalizar')}
            onPress={() => navigation.popToTop()}
            style={{ marginTop: padding }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: padding,
            }}
          >
            <View style={{ flex: 7 }}>
              <DefaultButton
                title={t('Relatar um problema')}
                secondary
                onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
              />
            </View>
            <View style={{ flex: 7, marginLeft: halfPadding }}>
              <DefaultButton
                title={t('Detalhes da corrida')}
                onPress={() =>
                  navigation.navigate('HistoryNavigator', {
                    screen: 'OrderDetail',
                    params: { orderId },
                  })
                }
                secondary
              />
            </View>
          </View>
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
};
