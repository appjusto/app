import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { RestaurantNavigatorParamList } from '../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../p2p/types';

type ScreenNavigationProp = StackNavigationProp<
  P2POrderNavigatorParamList & RestaurantNavigatorParamList,
  'AvailableFleets'
>;
type ScreenRouteProp = RouteProp<
  P2POrderNavigatorParamList & RestaurantNavigatorParamList,
  'AvailableFleets'
>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const AvailableFleets = ({ navigation, route }: Props) => {
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PaddedView style={{ flex: 1 }}>
        <View>
          <Text style={{ ...texts.x2l }}>
            {t('Você escolhe a frota e o entregador fica com todo o dinheiro da entrega')}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding, color: colors.grey700 }}>
            {t(
              'Você pode selecionar mais de uma frota ao mesmo tempo. O valor final será definido após o aceite da corrida. Frotas disponíveis agora:'
            )}
          </Text>
        </View>
      </PaddedView>
    </ScrollView>
  );
};
