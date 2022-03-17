import { CancelOrderPayload } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { useGetCancellationInfo } from '../../../common/store/api/order/hooks/useGetCancellationInfo';
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
import { acceptStatuses, cancellableStatuses } from '../helpers';

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
  const order = useObserveOrder(orderId)!;
  const { status, dispatchingState } = order;
  const cancellationInfo = useGetCancellationInfo(orderId);
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
  const [cookingModalVisible, setCookingModalVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  // tracking
  useSegmentScreen('OrderDetail');
  // handlers
  const cancelOrderHandler = () => {
    (async () => {
      Keyboard.dismiss();
      try {
        setLoading(true);
        if (!cancellationInfo) {
          dispatch(showToast('Não foi possível efetuar o cancelamento. Tente novamente', 'error'));
          return;
        }
        // TODO: what about the issues? italo didn't include them in the interface
        const cancellationData = {
          orderId,
          acknowledgedCosts: cancellationInfo.costs,
        } as CancelOrderPayload;
        await api.order().cancelBusinessOrder(cancellationData);
        dispatch(showToast('Pedido cancelado com sucesso', 'success'));
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        setLoading(false);
        dispatch(showToast('Não foi possível efetuar o cancelamento. Tente novamente', 'error'));
      }
    })();
  };
  const actionHandler = async () => {
    setLoading(true);
    try {
      if (status === 'confirmed') {
        setCookingModalVisible(true);
      }
      if (status === 'preparing') {
        await api.order().updateOrder(order.id, { status: 'ready' });
      }
      if (status === 'ready') {
        if (dispatchingState !== 'arrived-pickup') return;
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
            <Text style={{ ...texts.md, marginBottom: halfPadding }}>
              {t('Tempo de preparo: ')}
              <Text style={texts.bold}>{formatDuration(order.cookingTime!)}</Text>
            </Text>
            {status === 'preparing' ? (
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
        {status.includes(cancellableStatuses) ? (
          <View style={{ width: '60%', paddingHorizontal: padding, marginBottom: 32 }}>
            <DefaultButton
              title={t('Cancelar pedido')}
              secondary
              onPress={() => setCancelModalVisible(true)}
            />
          </View>
        ) : null}
      </ScrollView>
      {status.includes(acceptStatuses) ? (
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
              disabled={status === 'ready' && dispatchingState !== 'arrived-pickup'}
            />
          </View>
        </View>
      ) : null}
      <CancelOrderModal
        modalVisible={cancelModalVisible}
        onModalClose={() => setCancelModalVisible(false)}
        onCancelOrder={() => {
          cancelOrderHandler();
          setCancelModalVisible(false);
        }}
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
