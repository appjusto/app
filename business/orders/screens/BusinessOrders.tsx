import { Order, OrderStatus, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { useCompletedBusinessOrders } from '../../hooks/useCompletedBusinessOrders';
import { useObserveBusinessOrders } from '../../hooks/useObserveBusinessOrders';
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

const activeStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const BusinessOrders = ({ navigation, route }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  const business = React.useContext(BusinessAppContext);
  // screen state
  const activeOrders = useObserveBusinessOrders(business?.id, activeStatuses);
  const completedOrders = useCompletedBusinessOrders(business?.id);
  const allOrders = React.useMemo(() => {
    return [...activeOrders, ...completedOrders];
  }, [activeOrders, completedOrders]);
  const ordersSummary = summarizeOrders2(allOrders);
  const [kanbanOrders, setKanbanOrders] = React.useState<WithId<Order>[]>();
  const [selectedFilter, setSelectedFilter] = React.useState<OrderStatus>();
  // TODO: choose best business initially and remember last selected
  // TODO maybe:add the printing switch here
  // side-effects
  React.useEffect(() => {
    if (!allOrders?.length) setKanbanOrders([]);
    else if (!selectedFilter) setKanbanOrders(allOrders);
    else setKanbanOrders(filterOrdersByStatus(allOrders, selectedFilter));
  }, [allOrders, selectedFilter]);
  // setting business status to open whenever a manager logs in during business schedule
  React.useEffect(() => {
    (async () => {
      if (!business) return;
      if (!business.enabled) return;
      if (!business.schedules) return;
      if (!business.status) return;
      if (!getServerTime) return;
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
  if (business === undefined || kanbanOrders === undefined) {
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
          <BusinessOrdersHeader business={business} />
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
                selected={selectedFilter === undefined}
                onPress={() => {
                  setKanbanOrders(allOrders ?? []);
                  setSelectedFilter(undefined);
                }}
                style={{ marginRight: halfPadding }}
              />
              {/* confirmed orders */}
              <ListFilterButton
                title={t('A confirmar')}
                selected={selectedFilter === 'confirmed'}
                onPress={() => setSelectedFilter('confirmed')}
                total={ordersSummary.confirmed ?? 0}
                numberColor={ordersSummary.confirmed ? colors.white : colors.black}
                numberBgColor={ordersSummary.confirmed ? colors.red : colors.grey50}
                style={{ marginRight: halfPadding }}
              />
              {/* preparing orders */}
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
              {/* delivered orders */}
              <ListFilterButton
                title={t('Concluído')}
                selected={selectedFilter === 'delivered'}
                onPress={() => setSelectedFilter('delivered')}
                total={ordersSummary.delivered ?? 0}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              {/* canceled orders */}
              <ListFilterButton
                title={t('Cancelados')}
                selected={selectedFilter === 'canceled'}
                onPress={() => setSelectedFilter('canceled')}
                total={ordersSummary.canceled ?? 0}
                style={{ marginRight: 32 }}
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
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
