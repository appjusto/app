import { Order, OrderStatus, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { useNotificationToken } from '../../../common/hooks/useNotificationToken';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { useObserveBusiness } from '../../../common/store/api/business/hooks/useObserveBusiness';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getManager } from '../../../common/store/business/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { useBusinessManagedBy } from '../../hooks/useBusinessManagedBy';
import { useBusinessOrders } from '../../hooks/useBusinessOrders';
import { BusinessNavParamsList } from '../../types';
import { BusinessOrdersHeader } from '../components/BusinessOrdersHeader';
import { ListFilterButton } from '../components/ListFilterButton';
import { OrdersKanbanItem } from '../components/OrdersKanbanItem';
import { businessShouldBeOpen } from '../helpers';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessOrders'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessOrders'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const BusinessOrders = ({ navigation, route }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  // redux store
  const dispatch = useDispatch<AppDispatch>();
  const manager = useSelector(getManager);
  const business = useBusinessManagedBy();
  const observedBusiness = useObserveBusiness(business?.id);
  // screen state
  const allOrders = useBusinessOrders(business?.id);
  const [kanbanOrders, setKanbanOrders] = React.useState<WithId<Order>[]>(allOrders ?? []);
  const [selectedFilter, setSelectedFilter] = React.useState<OrderStatus>('confirmed');
  // TODO: choose best business initially and remember last selected
  // TODO maybe:add the printing switch here
  // helpers
  const ordersByStatus = React.useCallback(
    (status: OrderStatus) => {
      if (!allOrders) return [];
      return allOrders.filter((order) => order.status === status);
    },
    [allOrders]
  );

  // side-effects
  // TODO: is this the best place for the useNotificationToken?
  useNotificationToken();
  // always set kanban orders to 'confirmed' orders whenever there is a new one
  // React.useEffect(() => {
  //   if (allOrders?.length) setKanbanOrders(ordersByStatus('confirmed'));
  // }, [allOrders, ordersByStatus]);
  // setting business status to open whenever a manager logs in during business schedule
  React.useEffect(() => {
    (async () => {
      if (!business) return;
      if (!business.enabled) return;
      if (!business.schedules) return;
      if (!business.status) return;
      const today = getServerTime();
      const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
      if (shouldBeOpen && business?.status === 'closed') {
        await api.business().updateBusiness(business.id, { status: 'open' });
      }
    })();
  }, [business, getServerTime, api]);
  // tracking
  useSegmentScreen('BusinessOrders');

  //UI
  if (allOrders === undefined || business === undefined || observedBusiness === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  if (business === null) {
    // TODO: what should we do?
    return null;
  }
  return (
    <View style={screens.default}>
      <View>
        <PaddedView>
          <BusinessOrdersHeader business={observedBusiness} />
        </PaddedView>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        style={{ ...screens.config }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View>
          <DoubleHeader
            title={t('Pedidos')}
            subtitle={t('Gerencie os pedidos do seu restaurante')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: padding, paddingLeft: padding }}
            >
              {/* all orders */}

              <ListFilterButton
                title={t('Todos')}
                // total={allOrders?.length ?? 0}
                onPress={() => setKanbanOrders(allOrders ?? [])}
                style={{ marginRight: halfPadding }}
              />
              {/* confirmed orders */}
              <ListFilterButton
                title={t('A confirmar')}
                selected={selectedFilter === 'confirmed'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('confirmed'));
                  setSelectedFilter('confirmed');
                }}
                total={ordersByStatus('confirmed').length}
                numberColor={ordersByStatus('confirmed').length ? colors.white : colors.black}
                numberBgColor={ordersByStatus('confirmed').length ? colors.red : colors.grey50}
                style={{ marginRight: halfPadding }}
              />
              {/* preparing orders */}
              <ListFilterButton
                title={t('Preparação')}
                selected={selectedFilter === 'preparing'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('preparing'));
                  setSelectedFilter('preparing');
                }}
                total={ordersByStatus('preparing').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              <ListFilterButton
                title={t('Retirada')}
                selected={selectedFilter === 'ready'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('ready'));
                  setSelectedFilter('ready');
                }}
                total={ordersByStatus('ready').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
                numberBgColor={ordersByStatus('ready').length ? colors.darkYellow : colors.grey50}
              />
              <ListFilterButton
                title={t('Despachado')}
                selected={selectedFilter === 'dispatching'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('dispatching'));
                  setSelectedFilter('dispatching');
                }}
                total={ordersByStatus('dispatching').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              {/* delivered orders */}
              <ListFilterButton
                title={t('Concluído')}
                selected={selectedFilter === 'delivered'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('delivered'));
                  setSelectedFilter('delivered');
                }}
                total={ordersByStatus('delivered').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              {/* canceled orders */}
              <ListFilterButton
                title={t('Cancelados')}
                selected={selectedFilter === 'canceled'}
                onPress={() => {
                  setKanbanOrders(ordersByStatus('canceled'));
                  setSelectedFilter('canceled');
                }}
                style={{ marginRight: 32 }}
                total={ordersByStatus('canceled').length}
              />
            </ScrollView>
            <PaddedView style={{ flex: 1 }}>
              {kanbanOrders.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.grey50,
                    paddingTop: 32,
                  }}
                >
                  <IconOnboardingDelivery circleColor={colors.white} />
                  <Text
                    style={{
                      textAlign: 'center',
                      ...texts.sm,
                      color: colors.grey700,
                      paddingTop: padding,
                    }}
                  >
                    {t('Você ainda não teve pedidos hoje')}
                  </Text>
                </View>
              ) : (
                kanbanOrders.map((order) => (
                  <View style={{ marginBottom: padding }} key={order.id}>
                    <OrdersKanbanItem
                      onCheckOrder={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                      order={order}
                    />
                  </View>
                ))
              )}
            </PaddedView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
