import { Order, OrderStatus, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
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

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessOrders'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessOrders'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const BusinessOrders = ({ navigation, route }: Props) => {
  // redux store
  const manager = useSelector(getManager);
  const business = useBusinessManagedBy();
  // screen state
  const allOrders = useBusinessOrders(business?.id);
  const [kanbanOrders, setKanbanOrders] = React.useState<WithId<Order>[]>([]);
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
  React.useEffect(() => {
    if (allOrders?.length) setKanbanOrders(ordersByStatus('confirmed'));
  }, [allOrders, ordersByStatus]);
  // tracking
  useSegmentScreen('BusinessOrders');

  //UI
  if (allOrders === undefined || business === undefined) {
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
              {/* maybe we should start with confirmed orders??? */}
              {/* <ListFilterButton
                  title={t('Todos')}
                  bgColor={colors.green100}
                  textColor={colors.black}
                  borderColor={colors.black}
                  onPress={() => null}
                  style={{ marginRight: halfPadding }}
                /> */}
              {/* confirmed orders */}
              <ListFilterButton
                title={t('À confirmar')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('confirmed'))}
                total={ordersByStatus('confirmed').length}
                numberColor={ordersByStatus('confirmed').length ? colors.white : colors.black}
                numberBgColor={ordersByStatus('confirmed').length ? colors.red : colors.grey50}
                style={{ marginRight: halfPadding }}
              />
              {/* preparing orders */}
              <ListFilterButton
                title={t('Preparação')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('preparing'))}
                total={ordersByStatus('preparing').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              <ListFilterButton
                title={t('Retirada')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('ready'))}
                total={ordersByStatus('ready').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
                numberBgColor={ordersByStatus('ready').length ? colors.darkYellow : colors.grey50}
              />
              <ListFilterButton
                title={t('Despachado')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('dispatching'))}
                total={ordersByStatus('dispatching').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              {/* delivered orders */}
              <ListFilterButton
                title={t('Concluído')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('delivered'))}
                total={ordersByStatus('delivered').length}
                numberColor={colors.black}
                style={{ marginRight: halfPadding }}
              />
              {/* canceled orders */}
              <ListFilterButton
                title={t('Cancelados')}
                bgColor={colors.white}
                textColor={colors.grey700}
                borderColor={colors.grey700}
                onPress={() => setKanbanOrders(ordersByStatus('canceled'))}
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
