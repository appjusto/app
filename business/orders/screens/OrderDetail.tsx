import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, Platform, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import {
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../common/styles';
import { formatDuration } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { BusinessNavParamsList } from '../../types';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { CookingTimeModal } from '../components/CookingTimeModal';
import { CustomButton } from '../components/CustomButton';
import { DestinationAndPay } from '../components/DestinationAndPay';
import { DetailedOrderItems } from '../components/DetailedOrderItems';
import { InfoAndCPF } from '../components/InfoAndCPF';
import { OrderDetailHeader } from '../components/OrderDetailHeader';
import { OrderDispatchingMap } from '../components/OrderDispatchingMap';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'OrderDetail'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderDetail = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  // const business = useSelector(getBusiness);
  // state
  const order = useObserveOrder(orderId);
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
  const [cookingModalVisible, setCookingModalVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  // tracking
  useSegmentScreen('OrderDetail');

  // handlers
  const actionHandler = async () => {
    setLoading(true);
    if (!order) return;
    try {
      if (order.status === 'confirmed') {
        setCookingModalVisible(true);
      }
      if (order.status === 'preparing') {
        await api.order().updateOrder(order.id, { status: 'ready' });
      }
      if (order.status === 'ready') {
        if (order.dispatchingState !== 'arrived-pickup') return;
        else await api.order().updateOrder(order.id, { status: 'dispatching' });
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error.toString());
      Sentry.Native.captureException(error);
      Keyboard.dismiss();
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
      setLoading(false);
    }
  };
  const courierChatHandler = () => {
    if (!order) return;
    if (order.courier) {
      navigation.navigate('OrderChat', {
        orderId,
        counterpartId: order.courier?.id,
        counterpartFlavor: 'consumer',
      });
    }
  };
  // helpers
  const showCustomButton =
    order &&
    (order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready');

  const cancellableStatuses =
    order &&
    (order.status === 'confirmed' ||
      (order.status === 'preparing' && !order.courier) ||
      (order.status === 'ready' && !order.courier) ||
      (order.dispatchingStatus === 'outsourced' && order.outsourcedBy === 'business'));
  //UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <ScrollView
        style={{ ...screens.config }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <OrderDetailHeader
          order={order}
          onOpenOrderChat={() =>
            navigation.navigate('OrderChat', {
              orderId,
              counterpartId: order.consumer.id,
              counterpartFlavor: 'consumer',
            })
          }
        />
        {/* when status === 'dispatching' */}
        <OrderDispatchingMap
          order={order}
          style={{ marginTop: padding }}
          onChatWithCourier={courierChatHandler}
        />
        <View style={{ marginTop: padding }}>
          <SingleHeader title={t('Detalhes do pedido')} />
        </View>
        <View
          style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
        >
          <View>
            {order.cookingTime ? (
              <View>
                <Text style={{ ...texts.md, marginBottom: halfPadding }}>
                  {t('Tempo de preparo: ')}
                  <Text style={texts.bold}>{formatDuration(order.cookingTime!)}</Text>
                </Text>
              </View>
            ) : null}
          </View>
          <DetailedOrderItems order={order} style={{ marginTop: padding, marginBottom: 32 }} />
        </View>
        <DestinationAndPay order={order} />
        <View style={{ marginTop: doublePadding, flex: 1, marginBottom: 32 }}>
          <InfoAndCPF order={order} />
        </View>
        {cancellableStatuses ? (
          <View style={{ width: '100%', paddingHorizontal: padding, marginBottom: 32 }}>
            <CustomButton
              order={order}
              activityIndicator={isLoading}
              onPress={() => setCancelModalVisible(true)}
              variant="cancel"
            />
          </View>
        ) : null}
      </ScrollView>
      {showCustomButton ? (
        <View
          style={{
            paddingVertical: halfPadding,
            paddingHorizontal: padding,
            borderTopColor: colors.grey500,
            borderTopWidth: 1,
          }}
        >
          <View style={{ width: '100%', paddingBottom: Platform.OS === 'ios' ? padding : 0 }}>
            <CustomButton
              order={order}
              onPress={actionHandler}
              activityIndicator={isLoading}
              disabled={order.status === 'ready' && order.dispatchingState !== 'arrived-pickup'}
            />
          </View>
        </View>
      ) : null}
      <CancelOrderModal
        modalVisible={cancelModalVisible}
        onModalClose={() => setCancelModalVisible(false)}
        onCancelOrder={() => null}
        order={order}
      />
      {order.status === 'confirmed' ? (
        <CookingTimeModal
          order={order}
          buttonTitle={t('Aceitar pedido')}
          modalVisible={cookingModalVisible}
          onModalClose={() => setCookingModalVisible(false)}
        />
      ) : null}
    </View>
  );
};
