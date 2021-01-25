import { StackNavigationProp } from '@react-navigation/stack';
import { Fare } from 'appjusto-types';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { colors, padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderSummary from '../../orders/summary/OrderSummary';
import { RestaurantsNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'CartSummary'>;

export default function () {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const order = useContextActiveOrder();
  //state
  const [quotes, setQuotes] = React.useState<Fare[]>([]);
  const [isLoading, setLoading] = React.useState(false);

  // side effects
  // update quotes
  useEffect(() => {
    (async () => {
      if (!order?.origin?.location || !order.route) return;
      setQuotes([]);
      // try {
      setQuotes(await api.order().getOrderQuotes(order.id));
      // } catch (error) {}
    })();
  }, [order]);
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  return (
    <ScrollView style={{ ...screens.default }}>
      {/* restaurant and items ordered */}
      <OrderSummary
        order={order!}
        // paymentMethod={null}
        waiting={isLoading}
        showMap={false}
        onEditStep={() => null}
        placeOrder={() => null}
        navigateToFillPaymentInfo={() => null}
        navigateFleetDetail={() => null}
      />
      <HR height={padding} />
      <PaddedView>
        <DefaultButton
          title={t('Finalizar cadastro e adicionar pagamento')}
          onPress={() => null}
          secondary
        />
        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Confirmar pedido')}
          onPress={() => null}
        />
      </PaddedView>
    </ScrollView>
  );
}
