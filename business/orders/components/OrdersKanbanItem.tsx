import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CookingTimeModal } from './CookingTimeModal';
import { CustomButton } from './CustomButton';
import { OrderLabel } from './OrderLabel';
import { TimerDisplay } from './TimerDisplay';

type Props = {
  onCheckOrder: () => void;
  orderId: string;
};

export const OrdersKanbanItem = ({ onCheckOrder, orderId }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const order = useObserveOrder(orderId);
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  // helpers
  const now = getServerTime().getTime();

  // update status to 'ready' if the cooking time interval has passed
  React.useEffect(() => {
    if (!order?.status) return;
    if (order.status === 'preparing') {
      if (!getServerTime) return;
      if (!order.cookingTime) return;
      if (!order.timestamps.preparing) return;
      const cookingTime = order.cookingTime * 1000;
      const startedPreparing = (order.timestamps.preparing as Timestamp).toDate().getTime();
      if (now - startedPreparing >= cookingTime) {
        api.order().updateOrder(order.id, { status: 'ready' });
      }
    }
  }, [
    api,
    getServerTime,
    now,
    order?.cookingTime,
    order?.id,
    order?.status,
    order?.timestamps.preparing,
  ]);
  // handlers
  const actionHandler = async () => {
    if (!order) return;
    Keyboard.dismiss();
    const { status, dispatchingState, dispatchingStatus } = order;
    setLoading(true);
    try {
      if (status === 'confirmed') {
        setLoading(false);
        setModalVisible(true); // can change status to preparing from within the modal
      }
      if (status === 'preparing') {
        await api.order().updateOrder(order.id, { status: 'ready' });
        setLoading(false);
      }
      if (status === 'ready') {
        if (dispatchingState === 'arrived-pickup') {
          await api.order().updateOrder(order.id, { status: 'dispatching' });
          setLoading(false);
        }
        if (dispatchingState !== 'arrived-pickup') {
          setLoading(false);
          dispatch(showToast('Aguarde a chegada do entregador com o código do pedido', 'error'));
        }
        if (dispatchingStatus === 'outsourced') {
          await api.order().updateOrder(order.id, { status: 'dispatching' });
          setLoading(false);
        }
      } else {
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error.toString());
      Sentry.Native.captureException(error);
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
      setLoading(false);
    }
  };
  // UI
  if (!order) return null;
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
      onPress={onCheckOrder}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{order.consumer.name}</Text>
          <Text style={{ ...texts.sm }}>{order?.code}</Text>
        </View>
        <TimerDisplay orderId={orderId} />
        <OrderLabel order={order} />
      </View>
      <View style={{ marginTop: padding }}>
        {order.status === 'confirmed' ||
        order.status === 'preparing' ||
        order.status === 'ready' ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ width: '49%' }}>
              <DefaultButton variant="secondary" title={t('Ver pedido')} onPress={onCheckOrder} />
            </View>
            <View style={{ width: '49%', position: 'absolute', right: -2 }}>
              <CustomButton
                order={order}
                onPress={actionHandler}
                activityIndicator={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <DefaultButton variant="secondary" title={t('Ver pedido')} onPress={onCheckOrder} />
          </View>
        )}
      </View>
      <CookingTimeModal
        order={order}
        buttonTitle={t('Confirmar e aceitar pedido')}
        modalVisible={modalVisible}
        onModalClose={() => {
          setModalVisible(false);
        }}
      />
    </TouchableOpacity>
  );
};
