import { Business, Order, OrderStatus, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { ApiContext } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { useSegmentScreen } from '../../../common/store/api/track';
import { filterOrdersByStatus, summarizeOrders2 } from '../../../common/store/order/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
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
  // route params
  const { businessId } = route.params ?? {};
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  const { business, orders, activeOrders, scheduledOrders } = React.useContext(BusinessAppContext);
  // screen state
  const ordersSummary = summarizeOrders2(orders);
  const [kanbanOrders, setKanbanOrders] = React.useState<WithId<Order>[]>();
  const [selectedFilter, setSelectedFilter] = React.useState<OrderStatus>();
  const [selectedBusiness, setSelectedBusiness] = React.useState<WithId<Business> | undefined>(
    business
  );
  // side-effects
  React.useEffect(() => {
    if (!orders?.length) setKanbanOrders([]);
    if (!selectedFilter) setKanbanOrders(activeOrders);
    if (selectedFilter === 'scheduled') setKanbanOrders(scheduledOrders);
    else setKanbanOrders(filterOrdersByStatus(orders, selectedFilter!));
  }, [orders, selectedFilter, scheduledOrders, activeOrders]);
  // setting business status to open whenever a manager logs in during business hours
  React.useEffect(() => {
    (async () => {
      if (!business?.enabled) return;
      if (!business?.schedules) return;
      if (!business?.status) return;
      if (!getServerTime) return;
      const today = getServerTime();
      const shouldBeOpen =
        businessShouldBeOpen(today, business.schedules) && business.enabled === true;
      if (shouldBeOpen && business.status === 'closed') {
        await api.business().updateBusiness(business.id, { status: 'open' });
      }
      if (!shouldBeOpen && business.status === 'open') {
        await api.business().updateBusiness(business.id, { status: 'closed' });
      }
    })();
  }, [business?.enabled, business?.schedules, business?.id, business?.status, getServerTime, api]);
  // getting business from SelectBusiness screen
  React.useEffect(() => {
    if (businessId?.length) {
      // setSelectedBusiness(undefined);
      return api.business().observeBusiness(businessId, setSelectedBusiness);
    }
  }, [businessId]);
  // tracking
  useSegmentScreen('BusinessOrders');
  //UI
  if (selectedBusiness === undefined || kanbanOrders === undefined) {
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
    <View style={screens.config}>
      <PaddedView style={{ backgroundColor: colors.white }}>
        <BusinessOrdersHeader
          onSwitchBusiness={() =>
            navigation.navigate('SelectBusiness', { businessId: selectedBusiness.id })
          }
        />
      </PaddedView>
      <View style={{ backgroundColor: colors.grey50 }}>
        <DoubleHeader title={t('Pedidos')} subtitle={t('Gerencie os pedidos do seu restaurante')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: padding, paddingLeft: padding }}
        >
          <ListFilterButton
            title={t('Agendados')}
            selected={selectedFilter === 'scheduled'}
            onPress={() => setSelectedFilter('scheduled')}
            style={{ marginRight: halfPadding }}
            total={ordersSummary.scheduled ?? 0}
          />
          <ListFilterButton
            title={t('Ativos')}
            selected={selectedFilter === undefined}
            onPress={() => {
              setSelectedFilter(undefined);
            }}
            style={{ marginRight: halfPadding }}
          />
          <ListFilterButton
            title={t('A confirmar')}
            selected={selectedFilter === 'confirmed'}
            onPress={() => setSelectedFilter('confirmed')}
            total={ordersSummary.confirmed ?? 0}
            numberColor={ordersSummary.confirmed ? colors.white : colors.black}
            numberBgColor={ordersSummary.confirmed ? colors.red : colors.grey50}
            style={{ marginRight: halfPadding }}
          />
          <ListFilterButton
            title={t('Preparação')}
            selected={selectedFilter === 'preparing'}
            onPress={() => setSelectedFilter('preparing')}
            total={ordersSummary.preparing ?? 0}
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          <ListFilterButton
            title={t('Retirada')}
            selected={selectedFilter === 'ready'}
            onPress={() => setSelectedFilter('ready')}
            total={ordersSummary.ready ?? 0}
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
            numberBgColor={ordersSummary.ready ? colors.darkYellow : colors.grey50}
          />
          <ListFilterButton
            title={t('Despachado')}
            selected={selectedFilter === 'dispatching'}
            onPress={() => setSelectedFilter('dispatching')}
            total={ordersSummary.dispatching ?? 0}
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          <ListFilterButton
            title={t('Concluído')}
            selected={selectedFilter === 'delivered'}
            onPress={() => setSelectedFilter('delivered')}
            total={ordersSummary.delivered ?? 0}
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          <ListFilterButton
            title={t('Cancelados')}
            selected={selectedFilter === 'canceled'}
            onPress={() => setSelectedFilter('canceled')}
            total={ordersSummary.canceled ?? 0}
            style={{ marginRight: 32 }}
          />
        </ScrollView>
        <ScrollView style={{ marginBottom: 32 }}>
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
                  {t('Não há pedidos ativos nesse momento.')}
                </Text>
              </View>
            ) : (
              kanbanOrders?.map((order) => (
                <View style={{ marginBottom: padding }} key={order.id}>
                  <OrdersKanbanItem
                    onCheckOrder={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                    orderId={order.id}
                  />
                </View>
              ))
            )}
          </PaddedView>
        </ScrollView>
      </View>
    </View>
  );
};
