import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'Withdraws'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'Withdraws'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const Withdraws = ({ navigation, route }: Props) => {
  // params
  const { balanceForWithdraw } = route.params;
  console.log(balanceForWithdraw);
  return (
    <ScrollView style={{ ...screens.config }}>
      <PaddedView>
        <Text style={{ ...texts.sm }}>
          {t(
            'O AppJusto não fica com nada do valor do seu trabalho. Todas os pagamentos são processados com segurança pela operadora financeira Iugu.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: padding,
            marginTop: 24,
          }}
        >
          <Feather name="info" size={14} />
          <Text style={{ ...texts.md, marginLeft: halfPadding }}>{t('Como funciona')}</Text>
        </View>
        <Text style={{ ...texts.sm, paddingBottom: halfPadding }}>
          {t(
            'Você tem direito a 4 saques grátis a cada 30 dias. O valor mínimo para transferência é de R$5,00. Recomendamos que faça 1 saque por semana. Dessa forma, durante o período de 30 dias, você consegue sacar sem taxas adicionais. Caso precise de mais saques dentro desse mesmo período, será cobrada uma taxa de R$2,00 por saque adicional. Para solicitar saques adicionais, entre em contato com nosso suporte.'
          )}
        </Text>
      </PaddedView>
    </ScrollView>
  );
};
