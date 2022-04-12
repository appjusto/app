import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
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

  // side effects
  // update status to 'ready' if the cooking time interval has passed
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'preparing') {
      if (!getServerTime) return;
      if (!order.cookingTime) return;
      if (!order.timestamps.preparing) return;
      const now = getServerTime().getTime();
      const cookingTime = order.cookingTime * 1000;
      const startedPreparing = (order.timestamps.preparing as Timestamp).toDate().getTime();
      if (now - startedPreparing >= cookingTime) {
        api.order().updateOrder(order.id, { status: 'ready' });
      }
    }
  }, [api, getServerTime, order]);
  // failsafe: no component if order is not loaded
  if (!order) return null;
  const { status, dispatchingState, dispatchingStatus } = order;
  // handlers
  const actionHandler = async () => {
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
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
      setLoading(false);
    }
  };
  // UI
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{order.consumer.name}</Text>
          <Text style={{ ...texts.sm }}>{order.code}</Text>
        </View>
        {/* TODO: "timing" component while "preparing" */}
        {/* {status === 'preparing' ? (
          <View>
            <Text>Tempo de preparo</Text>
          </View>
        ) : null} */}
        <OrderLabel order={order} />
      </View>
      <View style={{ marginTop: padding }}>
        {order.status === 'confirmed' ||
        order.status === 'preparing' ||
        order.status === 'ready' ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ width: '38%' }}>
              <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
            </View>
            <View style={{ width: '57%' }}>
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
            <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
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
    </View>
  );
};
