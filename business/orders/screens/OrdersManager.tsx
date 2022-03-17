import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { useObserveBusiness } from '../../../common/store/api/business/hooks/useObserveBusiness';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getFlavor } from '../../../common/store/config/selectors';
import { getUser } from '../../../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessNavParamsList } from '../../types';
import { ListFilterButton } from '../components/ListFilterButton';
import { OrdersKanbanItem } from '../components/OrdersKanbanItem';
import { OrderManagerHeader } from '../components/OrdersManagerHeader';
import { useObserveBusinessOrders } from '../hooks/useObserveBusinessOrders';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'OrdersManager'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'OrdersManager'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrdersManager = ({ navigation, route }: Props) => {
  // redux store
  // const business = useSelector(getBusiness);
  const user = useSelector(getUser);
  const flavor = useSelector(getFlavor);
  // screen state
  const noOrdersToday = false; //helper
  const business = useObserveBusiness('OW0ZNz0cax6ZX6Lxd1wz');
  const options = React.useMemo(() => {
    const activeStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'];
    return { businessId: user?.uid, activeStatuses };
  }, [user?.uid]);
  const activeOrders = useObserveBusinessOrders(options);
  const testingOrder = useObserveOrder('3b1IXPPlPvdxufcXo86f');
  // needed:

  // 2 - observar e receber todos os pedidos do restaurante em ordem descendente de charged com os status const statuses = ['confirmed', 'preparing', 'ready', 'dispatching']
  // 2.1 -observar e receber os pedidos com os status 'delivered' e 'canceled'. ver observeBusinessOrdersCompletedInTheLastHour no admin
  // 3 - separar os pedidos por status. ao clicar em um dos ListFilterButtons, mostrar um map scrollable com os pedidos com aquele status
  // 4 - função para aceitar o pedido e definir o tempo de preparo

  // maybe:
  // trazer os dois switches de configurações - receber notificações e imprimir pedido - pra essa tela
  // tracking
  useSegmentScreen('OrdersManager');
  //UI
  if (!business || !testingOrder) {
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
          <OrderManagerHeader business={business} />
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
                      navigation.navigate('OrderDetail', { orderId: '3b1IXPPlPvdxufcXo86f' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: '3b1IXPPlPvdxufcXo86f' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: '3b1IXPPlPvdxufcXo86f' })
                    }
                    onTakeOrder={() => null}
                    order={testingOrder}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: '3b1IXPPlPvdxufcXo86f' })
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
      {/* <CookingTimeModal
        order={order}
        buttonTitle={t('Confirmar e aceitar pedido')}
        modalVisible={cookingModalVisible}
        onModalClose={() => setCookingModalVisible(false)}
        onConfirmOrder={
          // confirmOrder after setting cooking time
          // close modal
          () => setCookingModalVisible(false)
        }
      /> */}
    </View>
  );
};
