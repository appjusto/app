import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { colors, padding, screens, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { OngoingOrderNavigatorParamList } from '../../ongoing/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

export type ProfilePaymentMethodsParamList = {
  ProfilePaymentMethods?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P' | 'OngoingOrderDeclined';
    courierFee?: number;
    fleetName?: string;
  };
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList &
  RestaurantNavigatorParamList &
  P2POrderNavigatorParamList &
  OngoingOrderNavigatorParamList,
  'ProfilePaymentMethods'
>;
type ScreenRouteProp = RouteProp<ProfilePaymentMethodsParamList, 'ProfilePaymentMethods'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const { returnScreen, courierFee, fleetName } = route.params ?? {};
  // redux
  const consumer = useSelector(getConsumer);
  const cards = consumer?.paymentChannel?.methods ?? [];
  // tracking
  useSegmentScreen('ProfilePaymentMethods');
  // UI
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConfigItem
            title={item.data.display_number}
            subtitle={`Cartão de crédito\n${item.data.brand}`}
            onPress={() => {
              if (returnScreen) {
                navigation.navigate(returnScreen, { paymentMethodId: item.id });
              } else {
                navigation.navigate('PaymentMethodDetail', {
                  paymentData: item,
                });
              }
            }}
          />
        )}
        ListHeaderComponent={
          courierFee && fleetName ? (
            <View style={{ backgroundColor: colors.white }}>
              <SingleHeader title={t('Valor pendente')} />
              <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
                <Text style={{ ...texts.xs, color: colors.grey700 }}>
                  {t(
                    'Já foi efetuado o pagamento do produto, e ocorreu um problema para cobrar o valor  da entrega.'
                  )}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    paddingBottom: 2,
                  }}
                >
                  <Text style={{ ...texts.sm }}>{t('Entregador')}</Text>
                  <Text style={{ ...texts.sm }}>{formatCurrency(courierFee!)}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ ...texts.sm }}>{t('Frota escolhida')}</Text>
                  <Text style={{ ...texts.sm }}>{fleetName}</Text>
                </View>
              </View>
            </View>
          ) : null
        }
        ListFooterComponent={() => (
          <ConfigItem
            title={t('Adicionar novo cartão de crédito')}
            subtitle={t('Aceitamos as bandeiras Visa, Mastercard, Elo e Diners')}
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
