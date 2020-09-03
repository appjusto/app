import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import ConfigItem from '../../../common/components/ConfigItem';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { screens, padding } from '../../../common/styles';
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
  const cards = consumer?.getCards() ?? [];

  return (
    <View style={{ ...screens.configScreen, marginTop: padding }}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConfigItem
            title={item.lastFourDigits}
            subtitle={`Cartão de crédito\n${item.brand}`}
            onPress={() => {
              if (returnScreen) navigation.navigate(returnScreen, { cardId: item.id });
            }}
          />
        )}
        ListFooterComponent={() => (
          <ConfigItem
            title={t('Adicionar novo cartão de crédito')}
            subtitle={t('Aceitamos as bandeiras Visa, Mastercard, Amex e Elo')}
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
