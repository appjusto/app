import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import ConfigItem from '../../../common/components/views/ConfigItem';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfilePaymentMethods'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfilePaymentMethods'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const { returnScreen } = route.params ?? {};
  // app state
  const consumer = useSelector(getConsumer);
  const cards = consumer?.paymentChannel?.methods ?? [];

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
              navigation.navigate('PaymentMethodDetail', {
                paymentData: item,
              });
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
