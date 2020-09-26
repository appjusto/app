import { BaseRouter, NavigationHelpersContext, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet } from 'appjusto-types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { HomeNavigatorParamList } from '../../../consumer/home/types';
import { t } from '../../../strings';
import DefaultButton from '../../components/buttons/DefaultButton';
import PaddedView from '../../components/containers/PaddedView';
import RoundedText from '../../components/texts/RoundedText';
import { colors, screens, texts } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'FleetDetail'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'FleetDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { fleet } = route.params;
  const participants = `${fleet.participantsOnline} participantes`;
  const minFee = `R$ ${fleet.minimumFee}`;
  const minDistance = `${fleet.distanceThreshold} Km`;
  const additionalPerKm = `R$ ${fleet.additionalPerKmAfterThreshold}`;
  const maxDistance = `${fleet.maxDistance} Km`;
  const maxDistanceOrigin = `${fleet.maxDistanceToOrigin} Km`;
  const feePct = `${fleet.feePctOverValue} %`;
  const valueThresh = `R$ ${fleet.valueThreshold}`;
  return (
    <View style={[screens.configScreen]}>
      <ScrollView>
        <PaddedView>
          <Text style={[texts.big]}>{fleet.name}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen, marginTop: 8 }}>
            {participants}
          </Text>
          <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 8 }}>
            {fleet.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Pagamento Mínimo')}</Text>
            <RoundedText>{minFee}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Valor que os entregadores dessa frota receberão ao percorrer a Distância Inicial Mínima.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Distância Inicial Mínima')}</Text>
            <RoundedText>{minDistance}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Distância para o Pagamento Mínimo. Abaixo dessa distância, os entregadores dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os entregadores receberão um Valor Adicional por Km Rodado.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Valor Adicional por Km Rodado')}</Text>
            <RoundedText>{additionalPerKm}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Valor adicional por Km que os entregadores dessa frota receberão ao percorrer uma distância acima da Distância Inicial Mínima.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Distância Máxima para Entrega')}</Text>
            <RoundedText>{maxDistance}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Distância máxima em Km que os entregadores dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima não serão exibidos.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Distância Máxima até a Origem')}</Text>
            <RoundedText>{maxDistanceOrigin}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Distância máxima em km da posição atual até a origem do pedido que essa frota poderá percorrer. Pedidos recebidos com origem acima não serão exibidos.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Porcentagem do Valor do Pedido')}</Text>
            <RoundedText>{feePct}</RoundedText>
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginTop: 8 }}>
            {t(
              'Percentual do valor do pedido em restaurantes que será adicionado ao pagamento dessa frota.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Valor Mínimo para Porcentagem')}</Text>
            <RoundedText>{valueThresh}</RoundedText>
          </View>
          <Text
            style={{ ...texts.default, color: colors.darkGrey, marginTop: 8, marginBottom: 16 }}
          >
            {t('Valor mínimo do pedido em restaurantes para que se comece a cobrar a porcentagem.')}
          </Text>
          {/* TODO: add the gain simulation here */}
          <DefaultButton title={t('Escolher essa frota')} onPress={() => navigation.goBack()} />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
