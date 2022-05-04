import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { formatDuration } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { getTimeUntilNow } from '../helpers';
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
  const [elapsedTime, setElapsedTime] = React.useState<number | null>(0); // time since the status turned into preparing
  // helpers
  const cookingTime = React.useMemo(
    () => (order?.cookingTime ? order?.cookingTime / 60 : null),
    [order?.cookingTime]
  );
  const cookingProgress = cookingTime && elapsedTime ? (elapsedTime / cookingTime) * 100 : 0;
  const now = getServerTime().getTime();
  const formattedTime = order?.cookingTime ? formatDuration(order.cookingTime) : '';
  const formattedInterval = elapsedTime && elapsedTime > 0 ? `${elapsedTime} min` : '';

  // side effects
  // updating the elapsed time 65
  React.useEffect(() => {
    if (!order) return;
    if (!getServerTime) return;
    const orderServerTime = (order?.timestamps.confirmed as Timestamp).toDate().getTime();
    if (now && orderServerTime) {
      const delta = getTimeUntilNow(now, orderServerTime);
      setElapsedTime(delta);
    } else setElapsedTime(null);
  }, [getServerTime, order, now]);
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
  // handlers
  const actionHandler = async () => {
    if (!order) return;
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
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
      setLoading(false);
    }
  };
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
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
        {order.status === 'preparing' ? (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text>Tempo de preparo</Text>
            <Text>{formattedInterval}</Text>
            <Text>{formattedTime}</Text>
          </View>
        ) : null}
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
