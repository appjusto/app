import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { OngoingOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'ScheduledOrderConfirmation'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'ScheduledOrderConfirmation'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ScheduledOrderConfirmation = ({ navigation, route }: Props) => {
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View>
        <Text>{t('Pedido agendado com sucesso!')}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: padding }}>
        <DefaultButton
          title={t('Voltar para o início')}
          // onPress={() => navigation.replace('Home')}
        />
      </View>
    </ScrollView>
  );
};
