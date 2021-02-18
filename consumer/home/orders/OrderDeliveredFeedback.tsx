import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as icons from '../../../assets/icons';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import TipControl from './common/TipControl';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'OrderDeliveredFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'OrderDeliveredFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  // screen state
  const { order } = useObserveOrder(orderId);
  const [tip, setTip] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  // UI handlers
  const tipHandler = async () => {
    setLoading(true);
    await api.order().tipCourier(order!.id, tip);
    setLoading(false);
  };
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
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
            <Text style={[texts.x2l]}>{t('Pedido\nentregue')}</Text>
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
          order={order}
          tip={tip}
          onChange={(value) => setTip(value)}
          onConfirm={() => tipHandler}
        />
        <HR />
        {/* actions */}
        <View style={{ paddingHorizontal: padding }}>
          <DefaultButton
            title={t('Finalizar')}
            onPress={() => navigation.navigate('Home')}
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
            <DefaultButton
              title={t('Relatar um problema')}
              secondary
              onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
              style={{ flex: 7 }}
            />
            <DefaultButton
              title={t('Detalhes da corrida')}
              onPress={() =>
                navigation.navigate('HistoryNavigator', {
                  screen: 'OrderDetail',
                  params: { orderId },
                })
              }
              secondary
              style={{ flex: 7 }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
