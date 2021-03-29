import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

export type ProfilePaymentMethodsParamList = {
  ProfilePaymentMethods?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P';
  };
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & RestaurantNavigatorParamList & P2POrderNavigatorParamList,
  'ProfilePaymentMethods'
>;
type ScreenRouteProp = RouteProp<ProfilePaymentMethodsParamList, 'ProfilePaymentMethods'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const { returnScreen } = route.params ?? {};
  // redux
  const consumer = useSelector(getConsumer);
  const cards = consumer?.paymentChannel?.methods ?? [];
  // UI
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConfigItem
            title={item.data.last_digits}
            subtitle={`Cartão de crédito\n${item.data.brand}`}
            onPress={() => {
              if (returnScreen) navigation.navigate(returnScreen, { paymentMethodId: item.id });
              else {
                navigation.navigate('PaymentMethodDetail', {
                  paymentData: item,
                });
              }
            }}
          />
        )}
        ListFooterComponent={() => (
          <ConfigItem
            title={t('Adicionar novo cartão de crédito')}
            subtitle={t('Aceitamos as bandeiras Visa, Mastercard, Amex, Elo e Diners')}
            onPress={() => {
              if (returnScreen) navigation.navigate('ProfileAddCard', { returnScreen });
              else navigation.navigate('ProfileAddCard');
            }}
          />
        )}
      />
    </View>
  );
}
