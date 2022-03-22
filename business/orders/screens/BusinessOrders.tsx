import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getManager } from '../../../common/store/business/selectors';
import { getUser } from '../../../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { useObserveBusinessManagedBy } from '../../hooks/useObserveBusinessManagedBy';
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
  // const business = useSelector(getBusiness);
  const user = useSelector(getUser);
  const manager = useSelector(getManager);
  const business = useObserveBusinessManagedBy(user?.email);
  // screen state
  const noOrdersToday = false; //helper, to be replaced with isEmpty(activeOrders)
  const testingOrder = useObserveOrder('usDi5nFeaBRNF8SzjEW4');
  // TODO: choose best business initially and remember last selected
  // active orders
  // const activeOptions = React.useMemo((): ObserveOrdersOptions => {
  //   const statuses: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'dispatching'];
  //   return { businessId, statuses, orderField: 'timestamps.charged' };
  // }, [businessId]);
  // inactive orders
  // const inactiveOptions = React.useMemo((): ObserveOrdersOptions => {
  //   const statuses = ['delivered', 'canceled'] as OrderStatus[];
  //   return { businessId: business.id, statuses };
  // }, [business.id]);
  // const inactiveOrders = useObserveOrders(inactiveOptions);
  // const orders = useObserveOrders(inactiveOptions);
  // maybe:
  // trazer os dois switches de configurações - receber notificações e imprimir pedido - pra essa tela
  // tracking
  useSegmentScreen('BusinessOrders');
  //UI
  if (!user || business === undefined || !testingOrder) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
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
          {noOrdersToday ? (
            <View style={{ ...screens.centered, backgroundColor: colors.grey50 }}>
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
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: padding, paddingLeft: padding }}
              >
                {/* all orders */}
                <ListFilterButton
                  title={t('Todos')}
                  bgColor={colors.green100}
                  textColor={colors.black}
                  borderColor={colors.black}
                  onPress={() => null}
                  style={{ marginRight: halfPadding }}
                />
                {/* confirmed orders */}
                <ListFilterButton
                  title={t('Pendente')}
                  bgColor={colors.white}
                  textColor={colors.grey700}
                  borderColor={colors.grey700}
                  onPress={() => null}
                  number="2"
                  numberColor={colors.white}
                  numberBgColor={colors.red}
                  style={{ marginRight: halfPadding }}
                />
                {/* preparing orders */}
                <ListFilterButton
                  title={t('Preparação')}
                  bgColor={colors.white}
                  textColor={colors.grey700}
                  borderColor={colors.grey700}
                  onPress={() => null}
                  number="3"
                  numberColor={colors.black}
                  style={{ marginRight: halfPadding }}
                />
                {/* take away orders - not included for now */}
                {/* dispatching orders */}
                <ListFilterButton
                  title={t('Despachado')}
                  bgColor={colors.white}
                  textColor={colors.grey700}
                  borderColor={colors.grey700}
                  onPress={() => null}
                  number="4"
                  numberColor={colors.black}
                  style={{ marginRight: halfPadding }}
                />
                {/* delivered orders */}
                <ListFilterButton
                  title={t('Concluído')}
                  bgColor={colors.white}
                  textColor={colors.grey700}
                  borderColor={colors.grey700}
                  onPress={() => null}
                  number="4"
                  numberColor={colors.black}
                  style={{ marginRight: halfPadding }}
                />
                {/* canceled orders */}
                <ListFilterButton
                  title={t('Todos')}
                  bgColor={colors.white}
                  textColor={colors.grey700}
                  borderColor={colors.grey700}
                  onPress={() => null}
                  style={{ marginRight: 32 }}
                />
              </ScrollView>
              <PaddedView>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
              </PaddedView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
