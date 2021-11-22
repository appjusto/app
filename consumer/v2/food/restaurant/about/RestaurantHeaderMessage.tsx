import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { colors, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'RestaurantHeaderMessage'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
  >
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RestaurantHeaderMessage = ({ navigation }: Props) => {
  // context
  const restaurant = useContextBusiness();
  // side effects
  // setting the restaurant.name in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  //UI
  return (
    <PaddedView style={{ ...screens.default }}>
      <Text style={{ ...texts.xl }}>{t('Título da mensagem')}</Text>
      <Text style={{ ...texts.sm, color: colors.grey700, paddingTop: 4 }}>
        {t(
          'Aqui vai a mensagem completa independentemente da sua extensão. Na verdade, tenho algumas dúvidas se não seria melhor expandir o componente com o texto na tela anterior em vez de navegar para uma outra. Mas, como isso já estava nos priorizados, deduzo que decidiu-se por termos essa nova tela mesmo '
        )}
      </Text>
    </PaddedView>
  );
};
