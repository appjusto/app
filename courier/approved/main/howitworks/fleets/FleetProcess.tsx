import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import GainSimulator from '../../profile/fleet/GainSimulator';
import { HowAppJustoWorksParams } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'RevenueProcess'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const FleetProcess = ({ navigation }: Props) => {
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView>
        <Text
          style={{
            ...texts.x2l,
            marginBottom: halfPadding,
          }}
        >
          {t('Funcionamento das frotas')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'No AppJusto, o valor da corrida é definido pela frota que você está. Após aprovação do seu cadastro, você estará automaticamente na frota padrão AppJusto mas você pode entrar ou criar outra frota a qualquer momento.'
          )}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t('Você pode também se juntar à uma frota já criada.')}
        </Text>
        <DefaultButton
          title="Ver frotas"
          onPress={() =>
            navigation.navigate('ProfileNavigator', {
              screen: 'ChooseFleet',
            })
          }
        />
        <Text
          style={{
            ...texts.x2l,
            marginTop: doublePadding,
            marginBottom: padding,
          }}
        >
          {t('Ganhos')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'Na frota AppJusto o valor mínimo da entrega é de R$10,00. Todo o valor é repassado para você sem taxas ou comissão.'
          )}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'Nos pedidos de entrega de comida, o AppJusto cobra comissão apenas dos restaurantes. Nos pedidos de entrega administrativa cobramos uma taxa fixa de R$ 5,00 dos consumidores. O valor da entrega vai todo para você.'
          )}
        </Text>
        <GainSimulator fee={1000} distance={5000} additional={200} />
      </PaddedView>
    </ScrollView>
  );
};
