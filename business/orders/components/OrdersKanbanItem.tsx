import { Order, WithId } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CookingTimeModal } from './CookingTimeModal';
import { CustomButton } from './CustomButton';
import { OrderLabel } from './OrderLabel';

type Props = {
  onCheckOrder: () => void;
  order: WithId<Order>;
};

export const OrdersKanbanItem = ({ onCheckOrder, order }: Props) => {
  const { status, dispatchingState, timestamps, dispatchingStatus } = order;
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // update status to 'ready' if the cooking time interval has passed
  React.useEffect(() => {
    if (status === 'preparing') {
      if (!getServerTime) return;
      if (!order.cookingTime) return;
      const now = getServerTime().getTime();
      const cookingTime = order.cookingTime * 1000;
      const startedPreparing = (timestamps.preparing as Timestamp).toDate().getTime();
      if (now - startedPreparing >= cookingTime) {
        api.order().updateOrder(order.id, { status: 'ready' });
      }
    }
  }, [api, order.cookingTime, getServerTime, status, timestamps.preparing, order.id]);
  // failsafe: no component if order is not loaded
  if (!order) return null;
  // handlers
  const actionHandler = async () => {
    setLoading(true);
    try {
      if (status === 'confirmed') {
        setModalVisible(true); // can change status to preparing from within the modal
      }
      if (status === 'preparing') {
        // show no button and "trust the label"?
        // dispatchingStatus can become matching
        if (dispatchingStatus === 'matching') {
          // button should be disabled or show toast
          return;
        }
        // dispatchingStatus can become matched
        if (dispatchingStatus === 'matched') {
          // courier can arrive at pickup... dispatchingState arrived-pickup
          if (dispatchingState === 'arrived-pickup') {
          } else {
            // button should be disabled or show toast
            return;
          }
        }
        // dispatchingStatus can become no-match
        if (dispatchingStatus === 'no-match') {
          // wait for back office reply?
        }
        // preparing could end before cooking time. can advance to status 'ready'
        else await api.order().updateOrder(order.id, { status: 'ready' });
      }
      if (status === 'ready') {
        // if advanced to ready clicking the button (ready before cooking time)
        // dispatchingStatus can become matching
        if (dispatchingStatus === 'matching') {
          // button should be disabled or show toast
          return;
        }
        // dispatchingStatus can become matched
        if (dispatchingStatus === 'matched') {
          // courier can arrive at pickup... dispatchingState arrived-pickup
          if (dispatchingState === 'arrived-pickup') {
            await api.order().updateOrder(order.id, { status: 'dispatching' });
          } else {
            // button should be disabled or show toast
            return;
          }
        }
        // dispatchingStatus can become no-match
        if (dispatchingStatus === 'no-match') {
          // wait for back office reply?
          return;
        }
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
        {status === 'preparing' ? (
          <View>
            <Text>Tempo de preparo</Text>
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
        onModalClose={() => setModalVisible(false)}
      />
    </View>
  );
};
