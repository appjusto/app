import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
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
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
      setLoading(false);
    }
  };
  // helpers
  const showCustomButton =
    order &&
    (order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready');
  const cancellableStatuses = order && (order.status === 'preparing' || order.status === 'ready');
  console.log(order?.id);
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
        <OrderDetailHeader order={order} />
        {/* when status === 'dispatching' */}
        <OrderDispatchingMap order={order} style={{ marginTop: padding }} />
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
            {order.status === 'preparing' ? (
              <View style={{ width: '60%' }}>
                <DefaultButton
                  title={t('Alterar tempo de preparo')}
                  secondary
                  onPress={() => setCookingModalVisible(true)}
                />
              </View>
            ) : null}
          </View>
          <DetailedOrderItems order={order} style={{ marginTop: padding, marginBottom: 32 }} />
        </View>
        <DestinationAndPay order={order} />
        <View style={{ marginTop: doublePadding, flex: 1, marginBottom: 32 }}>
          <InfoAndCPF order={order} />
        </View>
        {/* this button will open a CancelOrderModal  */}
        {cancellableStatuses ? (
          <View style={{ width: '60%', paddingHorizontal: padding, marginBottom: 32 }}>
            <DefaultButton
              title={t('Cancelar pedido')}
              secondary
              onPress={() => setCancelModalVisible(true)}
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
          <View style={{ width: '100%' }}>
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
        onModalClose={() => navigation.goBack()}
        onCancelOrder={() => setCancelModalVisible(false)}
        order={order}
      />
      <CookingTimeModal
        order={order}
        buttonTitle={t('Confirmar tempo de preparo')}
        modalVisible={cookingModalVisible}
        onModalClose={() => setCookingModalVisible(false)}
      />
    </View>
  );
};