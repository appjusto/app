import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getBusiness } from '../../../common/store/business/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedBusinessNavParamsList } from '../../types';
import { CookingTimeModal } from '../components/CookingTimeModal';
import { ListFilterButton } from '../components/ListFilterButton';
import { OrdersKanbanItem } from '../components/OrdersKanbanItem';
import { OrderManagerHeader } from '../components/OrdersManagerHeader';

type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'OrdersManager'>;
type ScreenRouteProp = RouteProp<LoggedBusinessNavParamsList, 'OrdersManager'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrdersManager = ({ navigation, route }: Props) => {
  // redux store
  const business = useSelector(getBusiness);
  // screen state
  const [cookingModalVisible, setCookingModalVisible] = React.useState(false);
  const noOrdersToday = false;
  // needed:
  // 1 - restaurante como user
  // 2 - observar e receber todos os pedidos do restaurante naquele dia
  // 3 - separar os pedidos por status, que formarão as sections da SectionList horizontal com os ListFilterButtons
  // 4 - função para aceitar o pedido e definir o tempo de preparo

  // maybe:
  // trazer os dois switches de configurações - receber notificações e imprimir pedido - pra essa tela
  // tracking
  useSegmentScreen('OrdersManager');
  //UI
  return (
    <View style={screens.default}>
      <View>
        <PaddedView>
          <OrderManagerHeader />
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
                    onTakeOrder={() => setCookingModalVisible(true)}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => setCookingModalVisible(true)}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => setCookingModalVisible(true)}
                  />
                </View>
                <View style={{ marginBottom: padding }}>
                  <OrdersKanbanItem
                    onCheckOrder={() =>
                      navigation.navigate('OrderDetail', { orderId: 'usDi5nFeaBRNF8SzjEW4' })
                    }
                    onTakeOrder={() => setCookingModalVisible(true)}
                  />
                </View>
              </PaddedView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <CookingTimeModal
        buttonTitle={t('Confirmar e aceitar pedido')}
        modalVisible={cookingModalVisible}
        onModalClose={() => setCookingModalVisible(false)}
        onConfirmOrder={
          // confirmOrder after setting cooking time
          // close modal
          () => setCookingModalVisible(false)
        }
      />
    </View>
  );
};
