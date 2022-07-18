import { IuguCustomerPaymentMethod } from '@appjusto/types/payment/iugu';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PaymentBoxSelector } from '../../common/order-summary/PaymentBoxSelector';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & RestaurantNavigatorParamList,
  // we might need this later
  //  & OngoingOrderNavigatorParamList
  'SelectPaymentMethod'
>;
type ScreenRouteProp = RouteProp<
  ProfileParamList & RestaurantNavigatorParamList,
  'SelectPaymentMethod'
>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectPaymentMethod = ({ navigation, route }: Props) => {
  // params
  const { selectedPaymentMethodId, orderId, fleetId, total } = route.params ?? {};
  // redux
  const consumer = useSelector(getConsumer);
  const cards = consumer?.paymentChannel?.methods ?? [];
  // state
  const [selectedPayment, setSelectedPayment] = React.useState<
    IuguCustomerPaymentMethod | undefined
  >(getPaymentMethodById(consumer, selectedPaymentMethodId) ?? undefined);
  // helpers
  const payableWithPix = useIsPixEnabled();
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        {cards.length ? (
          cards.map((card) => (
            <View style={{ marginBottom: padding }} key={card.id}>
              <PaymentBoxSelector
                variant="card"
                selected={card.id === selectedPayment?.id}
                onSelectPayment={() => {
                  setSelectedPayment(card);
                  navigation.navigate('FoodOrderCheckout', { paymentMethodId: card.id });
                }}
                creditCard={card}
              />
            </View>
          ))
        ) : (
          <View style={{ marginBottom: padding }}>
            <PaymentBoxSelector
              variant="card"
              selected={false}
              onSelectPayment={() =>
                navigation.navigate('ProfileAddCard', { returnScreen: 'FoodOrderCheckout' })
              }
            />
          </View>
        )}
        {payableWithPix ? (
          <PaymentBoxSelector
            variant="pix"
            selected={false}
            onSelectPayment={() =>
              navigation.navigate('PayWithPix', {
                orderId: orderId!,
                fleetId: fleetId!,
                total: total!,
              })
            }
          />
        ) : null}
      </PaddedView>
      <View style={{ flex: 1 }} />
      {cards.length ? (
        <PaddedView>
          <DefaultButton
            title={t('Adicionar cartão')}
            onPress={() =>
              navigation.navigate('ProfileAddCard', { returnScreen: 'FoodOrderCheckout' })
            }
          />
        </PaddedView>
      ) : null}
    </ScrollView>
  );
};
